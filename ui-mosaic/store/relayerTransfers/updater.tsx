import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/index";
import {
  newTransfer,
  relayerDepositCanceled,
  relayerDeposited,
  relayerDepositFailed,
  relayerUpdateDepositBlock,
  selectAllRelayerTransfers,
  TransferStore,
} from "./slice";
import { getNetworkRpcUrl } from "defi";
import { ContractsContext } from "defi/ContractsContext";
import { selectAllBlockInfos } from "store/blockchain/slice";
import { ethers } from "ethers";
import {
  NEEDED_CONFIRMATIONS,
  RELAYER_SUPPORTED_NETWORKS,
  SupportedRelayerNetwork,
  WS_URL,
} from "../../constants";
import { ADDRESSES } from "defi/addresses";
import relayerVaultAbi from "defi/contracts/abis/relayerVaultAbi.json";
import useDebounce from "hooks/useDebounce";
import { SupportedNetworks } from "defi/types";
import {
  getTransferByFromAccount,
  getTransferById,
  TransactionStatusApiResponse,
} from "store/apiService";
import { convertApiTransfer } from "utils/transfers";
import { io } from "socket.io-client";
import { AnyAction, Dispatch } from "redux";
import { sleep } from "@/utils";

export default function Updater(): null {
  const { account } = useContext(ContractsContext);
  const dispatch = useAppDispatch();

  const transfers = useAppSelector(selectAllRelayerTransfers);
  const blockNumbers = useAppSelector(selectAllBlockInfos);

  const debouncedState = useDebounce(blockNumbers, 500);

  const [isInitialized, setIsInitialized] = useState(false);
  const [_, setIsLive] = useState(false);

  const [providers, setProviders] = useState<{
    [chainId in SupportedRelayerNetwork]: {
      provider: ethers.providers.JsonRpcProvider;
      interface: ethers.utils.Interface;
      confirmationsNeeded: number;
    };
  }>();

  useEffect(() => {
    const providersTmp: {
      [cid: number]: {
        provider: ethers.providers.JsonRpcProvider;
        interface: ethers.utils.Interface;
        confirmationsNeeded: number;
      };
    } = {};
    for (let i = 0; i < RELAYER_SUPPORTED_NETWORKS.length; i++) {
      const chainId = RELAYER_SUPPORTED_NETWORKS[i];
      providersTmp[chainId as SupportedRelayerNetwork] = {
        provider: new ethers.providers.JsonRpcProvider(
          getNetworkRpcUrl(chainId),
          chainId
        ),
        interface: new ethers.Contract(
          ADDRESSES.relayervault[chainId],
          relayerVaultAbi
        ).interface,
        confirmationsNeeded:
          NEEDED_CONFIRMATIONS[chainId as SupportedRelayerNetwork],
      };
    }
    setProviders(
      providersTmp as {
        [chainId in SupportedRelayerNetwork]: {
          provider: ethers.providers.JsonRpcProvider;
          interface: ethers.utils.Interface;
          confirmationsNeeded: number;
        };
      }
    );
  }, []);

  useEffect(() => {
    if (!account || !isInitialized) {
      return;
    }
    const socket = io(
      WS_URL + `/api/socket/transaction?fromAddress=${account.toLowerCase()}`
    );
    socket.on("connect", () => {
      setIsLive(true);
    });
    socket.on("status", (data) => {
      data as TransactionStatusApiResponse;
      dispatch(newTransfer(convertApiTransfer(data)));
    });

    socket.on("disconnect", () => setIsLive(false));
    socket.on("connect_error", (err) => {
      console.error(`connect_error due to ${err.message}`);
      setIsLive(false);
    });

    return () => {
      socket.disconnect();
      setIsLive(false);
    };
  }, [account, isInitialized]);

  useEffect(() => {
    if (!account || !blockNumbers) {
      setIsInitialized(false);
      return;
    }
    getTransferByFromAccount(account).then((dbTxs) => {
      for (const tr of dbTxs) {
        dispatch(newTransfer(convertApiTransfer(tr)));
      }
      for (let i = 0; i < RELAYER_SUPPORTED_NETWORKS.length; i++) {
        const chainId = RELAYER_SUPPORTED_NETWORKS[i];

        const processingDeposits: TransferStore[] = Object.values(
          transfers
        ).filter(
          (x) =>
            //x.status === "processing" &&
            x.fromChainId === (chainId as SupportedRelayerNetwork) &&
            x.fromAddress.toLowerCase() === account.toLowerCase() &&
            !["success-done", "error-done", "expired-done"].includes(x.status)
        );
        for (const tr of processingDeposits) {
          //if (tr.fromChainId in blockNumbers) {
          getTransferById(`${tr.fromChainId}-${tr.depositTxHash}`).then(
            (transfer) => {
              if (transfer) {
                dispatch(newTransfer(convertApiTransfer(transfer)));
              }
            }
          );
          //}
        }
      }
      setIsInitialized(true);
    });

    return () => {
      setIsInitialized(false);
    };
  }, [account]);

  useEffect(() => {
    if (!account || !providers) {
      return undefined;
    }

    const chainIds = Object.keys(debouncedState.after);

    let pendingTransfers: TransferStore[] = [];
    let confirmingDeposits: TransferStore[] = [];

    for (let i = 0; i < chainIds.length; i++) {
      const chainId = parseInt(chainIds[i]) as SupportedNetworks;
      if (
        !RELAYER_SUPPORTED_NETWORKS.includes(chainId) ||
        !debouncedState.before ||
        !(chainId in debouncedState.before) ||
        debouncedState.after[chainId].blockNumber ===
          debouncedState.before[chainId].blockNumber
      ) {
        continue;
      }
      pendingTransfers = Object.values(transfers).filter(
        (x) =>
          x.status === "depositing" &&
          x.fromChainId === (chainId as SupportedRelayerNetwork) &&
          x.fromAddress.toLowerCase() === account.toLowerCase()
      );

      confirmingDeposits = Object.values(transfers).filter(
        (x) =>
          x.status === "confirmingDeposit" &&
          x.fromChainId === (chainId as SupportedRelayerNetwork) &&
          x.fromAddress.toLowerCase() === account.toLowerCase()
      );

      for (const tr of confirmingDeposits) {
        if (tr.fromChainId in blockNumbers) {
          dispatch(
            relayerUpdateDepositBlock({
              fromChainId: tr.fromChainId,
              depositTxHash: tr.depositTxHash,
              fromBlockCurrent: blockNumbers[tr.fromChainId].blockNumber,
              confirmationsNeeded:
                providers[tr.fromChainId].confirmationsNeeded,
            })
          );
        }
      }

      for (const tr of pendingTransfers) {
        if (true /* SHOULD CHECK */) {
          handleTransaction(
            tr,
            providers[tr.fromChainId].provider,
            providers[tr.fromChainId].interface,
            dispatch
          );
        }
      }
    }
    return () => {};
  }, [debouncedState.after, account]);

  return null;
}

const handleTransaction = async (
  tr: TransferStore,
  provider: ethers.providers.JsonRpcProvider,
  contractInterface: ethers.utils.Interface,
  dispatch: Dispatch<AnyAction>,
  retries: number = 3
) => {
  const receipt = await provider
    .getTransactionReceipt(tr.depositTxHash)
    .catch((error) => {
      console.error(error);
      return -1 as -1;
    });
  if (receipt === -1) {
    return;
  }
  if (receipt !== undefined || receipt !== null) {
    if (receipt.status === 1) {
      let uniqueId;
      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        try {
          const parsed = contractInterface.parseLog(log);
          if (parsed.eventFragment.name === "DepositCompleted") {
            uniqueId = parsed.args.uniqueId;
            break;
          }
        } catch (e) {}
      }

      if (!uniqueId) {
        console.error("could not parse unique id");
      }

      dispatch(
        relayerDeposited({
          fromBlock: receipt.blockNumber,
          fromChainId: tr.fromChainId,
          depositTxHash: tr.depositTxHash,
          fromTimestamp: new Date().getTime(),
          gasFee: receipt.gasUsed.toString(),
          id: `${tr.fromChainId}-${tr.depositTxHash}`,
        })
      );
      // TODO add notification
      /*
        dispatch(
          addNotification({
            message: `[${tx.label}] completed.`,
            type: 'success',
            url: urlBase + txHash,
            timeout: 7000,
            button:
              tx.functionName.toLowerCase() === 'deposit' || tx.functionName.toLowerCase() === 'withdraw'
                ? { label: 'To Portfolio', path: '/portfolio' }
                : undefined,
          })
        )*/
    } else {
      dispatch(
        relayerDepositFailed({
          fromChainId: tr.fromChainId,
          depositTxHash: tr.depositTxHash,
        })
      );

      // TODO update failed transfer
      // TODO notify
    }
  } else {
    if (retries) {
      await sleep(1000 * (4 - retries));
      await handleTransaction(
        tr,
        provider,
        contractInterface,
        dispatch,
        --retries
      );
    } else {
      dispatch(
        relayerDepositCanceled({
          fromChainId: tr.fromChainId,
          depositTxHash: tr.depositTxHash,
        })
      );
    }
  }
};

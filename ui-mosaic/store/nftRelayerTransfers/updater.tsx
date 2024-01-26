import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/index";
import {
  newNftTransfer,
  nftRelayerDepositCanceled,
  nftRelayerDeposited,
  nftRelayerDepositFailed,
  nftRelayerUpdateDepositBlock,
  NftTransferStore,
  selectAllNftRelayerTransfers,
} from "./slice";
import { getNetworkRpcUrl } from "defi";
import { ContractsContext } from "defi/ContractsContext";
import { selectAllBlockInfos } from "store/blockchain/slice";
import { ethers } from "ethers";
import {
  NEEDED_CONFIRMATIONS,
  NFT_RELAYER_SUPPORTED_NETWORKS,
  SupportedNftRelayerNetwork,
} from "../../constants";
import { ADDRESSES } from "defi/addresses";
import nftRelayerVaultAbi from "defi/contracts/abis/nftVaultAbi.json";
import useDebounce from "hooks/useDebounce";
import {
  getNftTransferByFromAccount,
  getNftTransferById,
} from "store/apiService";
import { convertApiTransfer } from "utils/nftTransfers";
import { AnyAction, Dispatch } from "redux";
import { sleep } from "@/utils";
import { getUserTxsWs } from "../nftWsService";

export default function Updater(): null {
  const { account } = useContext(ContractsContext);
  const dispatch = useAppDispatch();

  const transfers = useAppSelector(selectAllNftRelayerTransfers);
  const blockNumbers = useAppSelector(selectAllBlockInfos);

  const debouncedState = useDebounce(blockNumbers, 500);

  const [isInitialized, setIsInitialized] = useState(false);
  const [_, setIsLive] = useState(false);

  const [providers, setProviders] = useState<{
    [chainId in SupportedNftRelayerNetwork]: {
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
    for (let i = 0; i < NFT_RELAYER_SUPPORTED_NETWORKS.length; i++) {
      const chainId = NFT_RELAYER_SUPPORTED_NETWORKS[i];
      providersTmp[chainId as SupportedNftRelayerNetwork] = {
        provider: new ethers.providers.StaticJsonRpcProvider(
          getNetworkRpcUrl(chainId),
          chainId
        ),
        interface: new ethers.Contract(
          ADDRESSES.relayervault[chainId],
          nftRelayerVaultAbi
        ).interface,
        confirmationsNeeded:
          NEEDED_CONFIRMATIONS[chainId as SupportedNftRelayerNetwork],
      };
    }
    setProviders(
      providersTmp as {
        [chainId in SupportedNftRelayerNetwork]: {
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

    const socket = getUserTxsWs(
      account,
      (data) => {
        dispatch(newNftTransfer(convertApiTransfer(data)));
      },
      setIsLive
    );

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
    getNftTransferByFromAccount(account).then((dbTxs) => {
      for (const tr of dbTxs) {
        dispatch(newNftTransfer(convertApiTransfer(tr)));
      }
      for (let i = 0; i < NFT_RELAYER_SUPPORTED_NETWORKS.length; i++) {
        const chainId = NFT_RELAYER_SUPPORTED_NETWORKS[i];

        const processingDeposits: NftTransferStore[] = Object.values(
          transfers
        ).filter(
          (x) =>
            //x.status === "processing" &&
            x.sourceNftInfo.chainId ===
              (chainId as SupportedNftRelayerNetwork) &&
            x.fromAddress.toLowerCase() === account.toLowerCase() &&
            !["success-done", "error-done", "expired-done"].includes(x.status)
        );

        for (const tr of processingDeposits) {
          //if (tr.fromChainId in blockNumbers) {
          getNftTransferById(
            `${tr.sourceNftInfo.chainId}-${tr.depositTxHash}`
          ).then((transfer) => {
            if (transfer) {
              dispatch(newNftTransfer(convertApiTransfer(transfer)));
            }
          });
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

    let pendingTransfers: NftTransferStore[] = [];
    let confirmingDeposits: NftTransferStore[] = [];

    for (let i = 0; i < chainIds.length; i++) {
      const chainId = parseInt(chainIds[i]) as number;
      if (
        !NFT_RELAYER_SUPPORTED_NETWORKS.includes(
          chainId as SupportedNftRelayerNetwork
        ) ||
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
          x.sourceNftInfo.chainId === (chainId as SupportedNftRelayerNetwork) &&
          x.fromAddress.toLowerCase() === account.toLowerCase()
      );

      confirmingDeposits = Object.values(transfers).filter(
        (x) =>
          x.status === "confirmingDeposit" &&
          x.sourceNftInfo.chainId === (chainId as SupportedNftRelayerNetwork) &&
          x.fromAddress.toLowerCase() === account.toLowerCase()
      );

      for (const tr of confirmingDeposits) {
        if (tr.sourceNftInfo.chainId in blockNumbers) {
          dispatch(
            nftRelayerUpdateDepositBlock({
              fromChainId: tr.sourceNftInfo.chainId,
              depositTxHash: tr.depositTxHash,
              fromBlockCurrent:
                blockNumbers[tr.sourceNftInfo.chainId].blockNumber,
              confirmationsNeeded:
                providers[tr.sourceNftInfo.chainId].confirmationsNeeded,
            })
          );
        }
      }

      for (const tr of pendingTransfers) {
        if (true /* SHOULD CHECK */) {
          handleTransaction(
            tr,
            providers[tr.sourceNftInfo.chainId].provider,
            providers[tr.sourceNftInfo.chainId].interface,
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
  tr: NftTransferStore,
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
  if (receipt !== undefined && receipt !== null) {
    if (receipt.status === 1) {
      let uniqueId;
      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        try {
          const parsed = contractInterface.parseLog(log);
          if (parsed.eventFragment.name === "TransferInitiated") {
            uniqueId = parsed.args.id;
            break;
          }
        } catch (e) {}
      }

      if (!uniqueId) {
        console.error("could not parse unique id");
      }

      dispatch(
        nftRelayerDeposited({
          fromBlock: receipt.blockNumber,
          fromChainId: tr.sourceNftInfo.chainId,
          depositTxHash: tr.depositTxHash,
          fromTimestamp: new Date().getTime(),
          id: `${tr.sourceNftInfo.chainId}-${tr.depositTxHash}`,
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
        nftRelayerDepositFailed({
          fromChainId: tr.sourceNftInfo.chainId,
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
        nftRelayerDepositCanceled({
          fromChainId: tr.sourceNftInfo.chainId,
          depositTxHash: tr.depositTxHash,
        })
      );
    }
  }
};

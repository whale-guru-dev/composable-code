import { Contract, ethers } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { newTransaction } from "store/tranasctions/slice";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { getNetworkUrl } from "defi";
import { BNExt } from "utils/BNExt";
import { ContractAddresses } from "defi/addresses";
import { TokenId } from "defi/tokenInfo";
import relayerVaultAbi from "./abis/relayerVaultAbi.json";
import { SupportedRelayerNetwork } from "../../constants";
import { newRelayerDeposit } from "store/relayerTransfers/slice";


export class RelayerVaultService {
  contract: Contract;
  dispatch: Dispatch<AnyAction>;
  signerAddress: string;
  chainId: number;

  constructor(
    address: string,
    provider: MulticallProvider,
    signerAddress: string,
    dispatcher: Dispatch<AnyAction>,
    signer?: ethers.Signer
  ) {
    const contract = new ethers.Contract(address, relayerVaultAbi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async deposit(
    amount: BNExt,
    fromTokenAddress: string,
    fromTokenId: TokenId,
    userDestinationAddress: string,
    remteChainId: SupportedRelayerNetwork,
    label: string
  ) {
    const txR: ethers.providers.TransactionResponse =
      await this.contract.depositERC20(
        amount.raw().toFixed(),
        fromTokenAddress,
        userDestinationAddress,
        remteChainId,
        1800 // TODO hardcoded for now
      );

    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [
          {
            contractType: fromTokenId === "weth" ? "raw" : "erc20",
            functionName: "balance",
            contract: fromTokenId as ContractAddresses,
          },
        ],
        label,
        functionName: this.deposit.name,
      })
    );

    this.dispatch(
      addNotification({
        message: `Transaction [${label}] started.`,
        type: "info",
        url: getNetworkUrl(this.chainId) + txR.hash,
        timeout: 5000,
      })
    );

    this.dispatch(
      newRelayerDeposit({
        amount: amount.toFixed(),
        depositTxHash: txR.hash,
        fromAddress: this.signerAddress,
        toAddress: userDestinationAddress,
        fromChainId: this.chainId as SupportedRelayerNetwork,
        tokenId: fromTokenId,
        toChainId: remteChainId,
      })
    );

    return `${this.chainId}-${txR.hash}`
  }
}

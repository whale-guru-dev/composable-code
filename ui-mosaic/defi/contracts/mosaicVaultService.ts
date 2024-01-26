import { Contract, ethers } from "ethers";
import { Dispatch } from "react";
import { getNetworkUrl } from "defi";
import { TokenId } from "defi/tokenInfo";
import { ContractAddresses } from "defi/addresses";
import { newTransaction } from "store/tranasctions/slice";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { AnyAction } from "redux";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import mosaicVault from "./abis/mosaicVault.json";

export class MosaicVaultService {
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
    const contract = new ethers.Contract(address, mosaicVault, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async owner(): Promise<string> {
    const res = await this.contract.owner();
    return res;
  }

  async providePassiveLiquidity(
    amount: string,
    tokenAddress: string,
    tokenId: TokenId,
    label: string
  ): Promise<void> {
    const txR: ethers.providers.TransactionResponse =
      await this.contract.providePassiveLiquidity(amount, tokenAddress, {
        value: 0,
      });

    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [
          {
            contractType: tokenId === "weth" ? "raw" : "erc20",
            functionName: "providePassiveLiquidity",
            contract: tokenId as ContractAddresses,
          },
        ],
        label,
        functionName: this.providePassiveLiquidity.name,
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
  }
}

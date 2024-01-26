import { Contract, ethers } from "ethers";
import { BigNumber } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import mosaicNftAbi from "./abis/mosaicNftAbi.json";

export class MosaicNftService {
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
    const contract = new ethers.Contract(address, mosaicNftAbi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async originalNftInfo(tokenId: BigNumber): Promise<any> {
    const res = await this.contract.getOriginalNftInfo(tokenId);
    return res;
  }
}

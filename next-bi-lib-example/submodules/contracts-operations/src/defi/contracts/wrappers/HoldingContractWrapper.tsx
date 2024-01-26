import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { BigNumber, ContractInterface, ethers, Signer } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";

import { Contract, ContractsWrapper } from "../../../submodules/bi-lib-submodule/packages/interaction/src/contracts"
import { Holding } from "../../abis/types/holding";

export class HoldingContractWrapper implements ContractsWrapper<Holding> {
  readerContract: Contract<Holding>;
  writerContract: Contract<Holding> | undefined;

  dispatch: Dispatch<AnyAction>;
  chainId: number;

  constructor(
    address: string,
    abi: ContractInterface,
    chainId: number,
    provider: MulticallProvider,
    signer: Signer | undefined,
    dispatch: Dispatch<AnyAction>,
  ) {
    this.writerContract = signer && new ethers.Contract(
      address,
      abi,
      signer
    ) as Contract<Holding> || undefined;
    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Holding>;

    this.chainId = chainId;
    this.dispatch = dispatch;
  }

  update = (
    chainId: number, signer: Signer | undefined, provider: MulticallProvider
  ) => {
    const address = this.readerContract.address;
    const abi = this.readerContract.interface;

    this.writerContract = signer && new ethers.Contract(
      address,
      abi,
      signer
    ) as Contract<Holding> || undefined;

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Holding>;

    this.chainId = chainId;
  }

  getTokenLiquidity = async (tokenAddress: string): Promise<BigNumber> => {
    return await this.readerContract.getTokenLiquidity(
      tokenAddress,
      []
    );
  }
}

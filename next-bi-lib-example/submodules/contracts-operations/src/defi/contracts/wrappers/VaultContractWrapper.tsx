import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import BigNumber from "bignumber.js";
import { BigNumber as EthersBigNumber, ContractInterface, ethers, Signer } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";

import { addNotification } from "../../../store/notifications/slice";
import { Contract, ContractsWrapper } from "../../../submodules/bi-lib-submodule/packages/interaction/src/contracts"
import { Vault } from "../../abis/types/vault";
import { getNetworkUrl, SupportedNetworkId, SwapAmmID } from "../../constants";

export class VaultContractWrapper implements ContractsWrapper<Vault> {
  readerContract: Contract<Vault>;
  writerContract: Contract<Vault> | undefined;

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
    ) as Contract<Vault> || undefined;
    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Vault>;

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
    ) as Contract<Vault> || undefined;

    this.readerContract = new ethers.Contract(
      address,
      abi,
      provider
    ) as Contract<Vault>;

    this.chainId = chainId;
  }

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (
    owner: string, spender: string
  ): Promise<EthersBigNumber> => {
    return this.readerContract.allowance(
      owner,
      spender
    );
  };

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  async approveUnlimited(
    spender: string, label: string
  ) {
    if (!this.writerContract) {
      throw Error("Vault Contract Wrapper - Write Contract Undefined");
    }

    const txR: ethers.providers.TransactionResponse =
      await this.writerContract.approve(
        spender,
        ethers.constants.MaxUint256
      ); // todo add type here

    this.dispatch(addNotification({
      message: `Transaction [${label}] started.`,
      type: "info",
      url: getNetworkUrl(this.chainId as SupportedNetworkId) + txR.hash,
      timeout: 5000,
    }));
  }

  async approve(
    spender: string, amount: EthersBigNumber, label: string
  ) {
    if (!this.writerContract) {
      throw Error("Vault Contract Wrapper - Write Contract Undefined");
    }

    const txR: ethers.providers.TransactionResponse =
      await this.writerContract.approve(
        spender,
        amount
      ); // todo add type here

    this.dispatch(addNotification({
      message: `Transaction [${label}] started.`,
      type: "info",
      url: getNetworkUrl(this.chainId as SupportedNetworkId) + txR.hash,
      timeout: 5000,
    }));
  }

  transferERC20ToLayer = async (
    amount: BigNumber,
    fromTokenAddress: string,
    destinationAddress: string,
    toChain: SupportedNetworkId,
    deadlineMinutes: number,
    toTokenAddress: string,
    amm: SwapAmmID,
    amountOutMinimum: number,
    swapToNative: boolean,
  ) => {
    if (!this.writerContract) {
      throw Error("Vault Contract Wrapper - Writer contract undefined")
    }

    return this.writerContract.transferERC20ToLayer(
      ethers.utils.parseEther(amount.toString()),
      fromTokenAddress,
      destinationAddress,
      toChain,
      deadlineMinutes * 60,
      toTokenAddress,
      amm,
      ethers.utils.parseEther(amountOutMinimum.toString()),
      swapToNative
    )
  }

  async providePassiveLiquidity(
    amount: BigNumber,
    tokenAddress: string,
    label?: string
  ): Promise<void> {
    if (!this.writerContract) {
      throw Error("Vault Contract Wrapper - Writer contract undefined")
    }

    const txR: ethers.providers.TransactionResponse =
      await this.writerContract.providePassiveLiquidity(
        ethers.utils.parseEther(amount.toString()),
        tokenAddress
      );

    this.dispatch(addNotification({
      message: `Transaction [${label}] started.`,
      type: "info",
      url: getNetworkUrl(this.chainId as SupportedNetworkId) + txR.hash,
      timeout: 5000,
    }));
  }
}

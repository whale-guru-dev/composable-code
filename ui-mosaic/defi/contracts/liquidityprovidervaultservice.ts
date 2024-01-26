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
import BigNumber from "bignumber.js";

const abi = [
  "function deposit(address token, uint256 amount) external",
  "function withdraw(address token) external",
  "function getProviderBalance(address provider, address token) public view returns (uint256)",
  "function getTokenBalance(address token) public view returns (uint256)",
  "function maxAssetCap(address token) public view returns (uint256)",
];

export class LiquidityProviderVaultService {
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
    const contract = new ethers.Contract(address, abi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async deposit(
    amount: BNExt,
    tokenAddress: string,
    label: string,
    tokenId: TokenId
  ) {
    const txR: ethers.providers.TransactionResponse =
      await this.contract.deposit(tokenAddress, amount.raw().toFixed());

    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [
          {
            contractType: tokenId === "weth" ? "raw" : "erc20",
            functionName: "balance",
            contract: tokenId as ContractAddresses,
          },
          {
            contractType: "liquidityprovidervault",
            functionName: "lpVaultUpdateGeneralTvl",
            data: [tokenId]
          },
          {
            contractType: "liquidityprovidervault",
            functionName: "tokenDepositedBalance",
            data: [tokenId]
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
  }

  async withdraw(
    tokenAddress: string,
    label: string,
    tokenId: TokenId
  ) {
    console.log("HANDLE tokenAddress", tokenAddress)

    const txR: ethers.providers.TransactionResponse =
      await this.contract.withdraw(tokenAddress);

    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [
          {
            contractType: tokenId === "weth" ? "raw" : "erc20",
            functionName: "balance",
            contract: tokenId as ContractAddresses,
          },
          {
            contractType: "liquidityprovidervault",
            functionName: "lpVaultUpdateGeneralTvl",
            data: [tokenId]
          },
          {
            contractType: "liquidityprovidervault",
            functionName: "tokenDepositedBalance",
            data: [tokenId]
          },
        ],
        label,
        functionName: this.withdraw.name,
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

  async getTokenBalance(tokenAddress: string): Promise<BigNumber> {
    return await this.contract.getTokenBalance(tokenAddress);
  }

  async getAssetCap(tokenAddress: string): Promise<BigNumber> {
    return await this.contract.maxAssetCap(tokenAddress);
  }

  async getProviderBalance(
    providerBalance: string,
    tokenAddress: string
  ): Promise<BigNumber> {
    return await this.contract.getProviderBalance(
      providerBalance,
      tokenAddress
    );
  }
}

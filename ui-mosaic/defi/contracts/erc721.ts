import { Contract, ethers } from "ethers";
import { BigNumber } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { newTransaction } from "@/store/tranasctions/slice";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { getNetworkUrl } from "..";

const erc721Abi = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function approve(address to, uint256 tokenId) external",
  "function getApproved(uint256 tokenId) external view returns (address)",
  "function name() external view returns (string _name)",
];

export class ERC721Service {
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
    const contract = new ethers.Contract(address, erc721Abi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async balanceOf(owner: string): Promise<number> {
    const res: BigNumber = await this.contract.balanceOf(owner);
    return res.toNumber();
  }

  async getTokenId(owner: string, index: number): Promise<number> {
    const res: BigNumber = await this.contract.tokenOfOwnerByIndex(
      owner,
      index
    );
    return res.toNumber();
  }

  async getTokenURI(tokenId: BigNumber): Promise<string> {
    return this.contract.tokenURI(tokenId);
  }

  async getApproved(tokenId: BigNumber): Promise<string> {
    return this.contract.getApproved(tokenId);
  }

  async approveNft(spender: string, tokenId: BigNumber, label: string) {
    const txR: ethers.providers.TransactionResponse =
      await this.contract.approve(spender, tokenId);
    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        label,
        functionName: this.approveNft.name + tokenId.toString(),
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

  getName(): Promise<string> {
    return this.contract.name();
  }
}

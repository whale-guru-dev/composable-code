import { Contract, ethers } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { newTransaction } from "store/tranasctions/slice";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { getNetworkUrl } from "defi";
import { ADDRESSES, ContractAddresses } from "defi/addresses";
import { getToken, TokenId } from "defi/tokenInfo";
import nftRelayerVaultAbi from "./abis/nftVaultAbi.json";
import { SupportedNftRelayerNetwork } from "../../constants";
import {
  newNftRelayerDeposit,
  NftNetworkInfoDestination,
} from "@/store/nftRelayerTransfers/slice";
import { SupportedNetworks } from "../types";
import BigNumber from "bignumber.js";
import { toBaseUnitBN } from "@/utils";

export class NftRelayerVaultService {
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
    const contract = new ethers.Contract(address, nftRelayerVaultAbi, provider);
    this.contract = signer ? contract.connect(signer) : contract;
    this.signerAddress = signerAddress;
    this.chainId = provider.network.chainId;
    this.dispatch = dispatcher;
  }

  async depositNft(
    nftAddress: string,
    nftId: string,
    nftUri: string,
    userDestinationAddress: string,
    feeToken: {
      amount: BigNumber;
      tokenId: TokenId;
      address: string;
    },
    remoteChainId: SupportedNftRelayerNetwork,
    originalNftInfo: {
      nftId: ethers.BigNumber;
      nftAddress: string;
      chainId: SupportedNftRelayerNetwork;
    },
    label: string = "Initiate transfer of NFT"
  ) {
    const tokenAmount = toBaseUnitBN(
      feeToken.amount.toFixed(getToken(feeToken.tokenId).decimals),
      getToken(feeToken.tokenId).decimals
    ).toFixed();

    const txR: ethers.providers.TransactionResponse =
      feeToken.address === ethers.constants.AddressZero
        ? await this.contract.transferERC721ToLayer(
            nftAddress,
            nftId,
            userDestinationAddress,
            remoteChainId,
            1800, // TODO hardcoded for now
            feeToken.address,
            {
              value: tokenAmount,
            }
          )
        : await this.contract.transferERC721ToLayer(
            nftAddress,
            nftId,
            userDestinationAddress,
            remoteChainId,
            1800, // TODO hardcoded for now
            feeToken.address
          );

    this.dispatch(
      newTransaction({
        txHash: txR.hash,
        chainId: this.chainId,
        address: this.signerAddress,
        contractAddress: this.contract.address,
        toUpdate: [
          {
            contractType:
              feeToken.address === ethers.constants.AddressZero
                ? "raw"
                : "erc20",
            functionName: "balance",
            contract: feeToken.tokenId as ContractAddresses,
          },
        ],
        label,
        functionName: this.depositNft.name,
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

    const destinationNftInfo: NftNetworkInfoDestination = {
      chainId: remoteChainId,
      nftAddress: ADDRESSES.mosaicnft[remoteChainId as SupportedNetworks],
    };

    if (destinationNftInfo.chainId === originalNftInfo.chainId) {
      (destinationNftInfo.nftAddress = originalNftInfo.nftAddress),
        (destinationNftInfo.nftId = originalNftInfo.nftId.toString());
    }

    this.dispatch(
      newNftRelayerDeposit({
        destinationNftInfo: destinationNftInfo,
        fee: {
          amount: feeToken.amount.toFixed(getToken(feeToken.tokenId).decimals),
          feeTokenId: feeToken.tokenId,
        },
        sourceNftInfo: {
          chainId: this.chainId as SupportedNftRelayerNetwork,
          nftAddress: nftAddress,
          nftId: nftId,
        },
        originalNftInfo: {
          chainId: originalNftInfo.chainId,
          nftId: originalNftInfo.nftId.toString(),
          nftAddress: originalNftInfo.nftAddress,
        },

        nftUri: nftUri,
        depositTxHash: txR.hash,
        fromAddress: this.signerAddress,
        toAddress: userDestinationAddress,
      })
    );

    return `${this.chainId}-${txR.hash}`;
  }
}

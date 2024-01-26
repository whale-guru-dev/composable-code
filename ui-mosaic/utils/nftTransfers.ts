import { SupportedNftRelayerNetwork } from "../constants";
import { NEEDED_CONFIRMATIONS } from "../constants";
import {
  ContractAddresses,
  getContractAddressIDByChainIdAndAddress,
} from "defi/addresses";
import { getToken, TokenId } from "defi/tokenInfo";

import { toTokenUnitsBN } from "utils";
import {
  initialNftTransferState,
  NftTransferStore,
} from "@/store/nftRelayerTransfers/slice";

import {
  NftEventType,
  NftTransferStates,
  NftTransfertatusApiResponse,
} from "@/types/nfts";
import { ethers } from "ethers";
import { SupportedNetworks } from "@/defi/types";
import { NETWORKS } from "@/defi/networks";

export const convertApiTransfer = (
  apiNft: NftTransfertatusApiResponse
): NftTransferStore => {
  let tokenId = getContractAddressIDByChainIdAndAddress(
    parseInt(apiNft.sourceNetworkId) as SupportedNetworks,
    apiNft.feeToken
  );

  if (!tokenId) {
    if (apiNft.feeToken.toLowerCase() === ethers.constants.AddressZero) {
      tokenId = NETWORKS[parseInt(apiNft.sourceNetworkId) as SupportedNetworks]
        .nativeToken as ContractAddresses;
    } else {
      console.error("Token not found when converting transfer");
      return initialNftTransferState;
    }
  }

  const token = getToken(tokenId as TokenId);

  const [_, id] = apiNft.publicId.split("-");

  let withdrawalInfo: { hash: string; timestamp: string } | undefined;

  if (NftEventType.Release in apiNft.transactions) {
    withdrawalInfo = apiNft.transactions[NftEventType.Release];
  } else if (NftEventType.Summon in apiNft.transactions) {
    withdrawalInfo = apiNft.transactions[NftEventType.Summon];
  }

  let p: NftTransferStore = {
    originalNftInfo: {
      chainId: parseInt(apiNft.originalNetworkId) as SupportedNftRelayerNetwork,
      nftAddress: apiNft.originalNftAddress,
      nftId: apiNft.originalNftId,
    },
    destinationNftInfo: {
      chainId: parseInt(
        apiNft.destinationNetworkId
      ) as SupportedNftRelayerNetwork,
      nftAddress: apiNft.destinationNftAddress,
    },
    sourceNftInfo: {
      chainId: parseInt(apiNft.sourceNetworkId) as SupportedNftRelayerNetwork,
      nftAddress: apiNft.sourceNftAddress,
      nftId: apiNft.sourceNftId,
    },
    depositTxHash: apiNft.transactions[NftEventType.Deposit].hash,
    withdrawalTxHash: withdrawalInfo ? withdrawalInfo.hash : "",
    fromAddress: apiNft.sourceNftOwner,
    toAddress: apiNft.destinationNftOwner,
    fromBlock: 0,
    fromBlockCurrent:
      NEEDED_CONFIRMATIONS[
        parseInt(apiNft.originalNetworkId) as SupportedNftRelayerNetwork
      ],
    fromTimestamp: new Date(
      apiNft.transactions[NftEventType.Deposit].timestamp
    ).getTime(),
    toTimestamp: withdrawalInfo
      ? new Date(withdrawalInfo.timestamp).getTime()
      : 0,
    status: apiNft.status as NftTransferStates,
    id: id,
    nftUri: apiNft.nftUri,
    fee: {
      amount: toTokenUnitsBN(apiNft.feeAmount, token.decimals).toFixed(),
      feeTokenId: tokenId as TokenId,
    },
  };

  if (apiNft.destinationNftAddress) {
    p.destinationNftInfo.nftAddress = apiNft.destinationNftAddress;
  }

  if (apiNft.destinationNftId) {
    p.destinationNftInfo.nftId = apiNft.destinationNftId;
  }

  return p;
};

import axios from "axios";
import {
  RELAYER_SUPPORTED_NETWORKS,
  SupportedLpToken,
  LIQUIDITY_PROVIDER_SUPPORTED_TOKEN,
} from "../constants";
import { ADDRESSES, ContractAddresses } from "defi/addresses";
import { getToken } from "defi/tokenInfo";
import { handleErr } from "defi/errorHandling";
import { toTokenUnitsBN } from "utils";
import BigNumber from "bignumber.js";
import { NftTransfertatusApiResponse } from "@/types/nfts";

const api = axios.create({
  baseURL: process.env.RELAYER_API_URL,
});

const apiL1 = axios.create({
  baseURL: process.env.ANALYTICS_API_URL,
});

const nftApi = axios.create({
  baseURL: process.env.NFT_API_URL,
});

export interface TransactionStatusApiResponse {
  uniqueId: string;
  publicId: string;

  depositTxHash: string;
  depositTimestamp: string;

  withdrawTxHash?: string;
  withdrawTimestamp?: string;

  unlockInTransferTxHash?: string;
  unlockInTransferTimestamp?: string;

  sourceUserAddress: string;
  destinationUserAddress: string;

  amount: { $numberDecimal: string };
  fee?: { $numberDecimal: string };
  gasUsed: { $numberDecimal: string };

  sourceTokenAddress: string;
  destinationTokenAddress: string;

  maxTransferWaitingTime: number;
  status: string;

  sourceNetworkId: number;
  remoteNetworkId: number;
}

export const getRewardsInfo = async (userAddress?: string) => {
  const responseFees = await handleErr(() => apiL1.get(`/relayer/totalFees`));

  const ret: { [tokenId: string]: {} } = {};

  for (let i = 0; i < LIQUIDITY_PROVIDER_SUPPORTED_TOKEN.length; i++) {
    const relayerToken = LIQUIDITY_PROVIDER_SUPPORTED_TOKEN[i];
    const tokenAddress =
      ADDRESSES[relayerToken.tokenId as ContractAddresses][1].toLowerCase();
    const token = getToken(relayerToken.tokenId);
    userAddress = userAddress ? userAddress.toLowerCase() : "";

    const response = await handleErr(() =>
      apiL1.get(`/l1vault/rewards/${tokenAddress}`)
    );
    let totalDeposited = new BigNumber(0);
    if (Object.values(response.data.totalDeposits).length) {
      totalDeposited = Object.values(response.data.totalDeposits)
        .map((x: any) => toTokenUnitsBN(x, token.decimals))
        .reduce((b: BigNumber, x: BigNumber) => b.plus(x));
    }

    let totalFees = new BigNumber(0);

    if (responseFees.data && responseFees.data.data) {
      const feeData = responseFees.data.data;
      for (let j = 0; j < RELAYER_SUPPORTED_NETWORKS.length; j++) {
        const chainId = RELAYER_SUPPORTED_NETWORKS[j].toString();
        const tokenAddressRelayer =
          ADDRESSES[relayerToken.tokenId as ContractAddresses][
            RELAYER_SUPPORTED_NETWORKS[j]
          ].toLowerCase();
        if (
          chainId in feeData &&
          tokenAddressRelayer in feeData[chainId].fees
        ) {
          totalFees = totalFees.plus(
            toTokenUnitsBN(
              feeData[chainId].fees[tokenAddressRelayer],
              token.decimals
            ).toFixed()
          );
        }
      }
    }

    if (response.data) {
      if (
        userAddress in response.data.shares &&
        userAddress in response.data.totalDeposits
      ) {
        ret[relayerToken.tokenId as string] = {
          feeShares: parseFloat(response.data.shares[userAddress]),
          depositedAmount: toTokenUnitsBN(
            response.data.totalDeposits[userAddress],
            token.decimals
          ).toFixed(),
          totalDeposited: totalDeposited.toFixed(),
          totalFees: totalFees.toFixed(),
        };
      } else {
        ret[relayerToken.tokenId as string] = {
          feeShares: 0,
          depositedAmount: "0",
          totalDeposited: totalDeposited.toFixed(),
          totalFees: totalFees.toFixed(),
        };
      }
    }
  }

  return ret as {
    [tokens in SupportedLpToken]: {
      feeShares: number;
      depositedAmount: string;
      totalDeposited: string;
      totalFees: string;
    };
  };
};

export const getTransferByFromAccount = async (fromAccount: string) => {
  const ret = await api.get("/transactions/user/" + fromAccount.toLowerCase());
  return ret.data as TransactionStatusApiResponse[];
};

export const getTransferById = async (transferId: string) => {
  const ret = await api.get("/transactions/" + transferId);

  if (ret.data.length) {
    return ret.data[0] as TransactionStatusApiResponse;
  } else {
    return undefined;
  }
};

export const getLastNSuccessfulTransfers = async (count: number) => {
  const ret = await api.get("/transactions/latest/" + count);
  return ret.data as TransactionStatusApiResponse[];
};

export const getNftTransferByFromAccount = async (fromAccount: string) => {
  const ret = await nftApi.get(
    "/relayer/transactions/user/" + fromAccount.toLowerCase()
  );
  return ret.data.data as NftTransfertatusApiResponse[];
};

export const getNftTransferById = async (transferId: string) => {
  const ret = await nftApi.get("/relayer/transaction/" + transferId);

  if ('data' in ret.data) {
    return ret.data.data as NftTransfertatusApiResponse;
  } else {
    return undefined;
  }
};

export const getLastNSuccessfulNftTransfers = async (count: number) => {
  const ret = await nftApi.get("/relayer/transactions/latest/" + count);
  return ret.data.data as NftTransfertatusApiResponse[];
};

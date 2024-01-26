import axios from "axios";
import BigNumber from "bignumber.js";

import { SUPPORTED_NETWORKS, SupportedNetworkId, SwapAmmID } from "../defi/constants";
import { APISupportedTokens, CrossChainId } from "../store/supportedTokens/slice";
import { toTokenUnitsBN } from "../submodules/bi-lib-submodule/packages/interaction/src/tokens/utils";

const transfersApi = axios.create({ baseURL: process.env.TRANSFERS_API_URL });

const priceFeedApi = axios.create({ baseURL: process.env.PRICE_FEED_API_URL })

const logError = (e: any) => {
  if (e.response) {
    /*
    * The request was made and the server responded with a
    * status code that falls out of the range of 2xx
    */
    console.log('Fetch supported tokens: Server responded');
    console.log(
      'Data:',
      e.response.data
    );
    console.log(
      'Status',
      e.response.status
    );
    console.log(
      'Headers',
      e.response.headers
    );
  } else if (e.request) {
    /*
      * The request was made but no response was received, `error.request`
      * is an instance of XMLHttpRequest in the browser and an instance
      * of http.ClientRequest in Node.js
      */
    console.log('Fetch supported tokens: Server did not respond');
    console.log(
      'Request:',
      e.request
    );
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log('Fetch supported tokens: Config error');
    console.log(
      'Message:',
      e.message
    );
  }

  console.log(
    'Config:',
    e.config
  );
}

export const getSupportedTokens = async () => {
  const requestedData = ["liquidityTokens", "supportedAmms", "transferPairs"];
  const path = `/supported?requestedData=${requestedData.join(',')}&chainIds=${Object.keys(SUPPORTED_NETWORKS).join(',')}`;

  try {
    const ret = await transfersApi.get(path);

    return ret.data as APISupportedTokens;
  } catch (e: any) {
    logError(e);
    return [];
  }
};

export interface APIFees {
  baseFee?: BigNumber;
  mosaicFeePercentage?: number;
}

export const getFees = async (
  ammId: SwapAmmID, amount: number, tokenAddress: string, chainId: SupportedNetworkId
) => {
  const path = `/withdrawal-fee?ammId=${ammId}&amount=${amount}&destinationTokenAddress=${tokenAddress}&destinationChainId=${chainId}`;

  try {
    const ret = await transfersApi.get(path);

    return {
      ...ret.data,
      baseFee: toTokenUnitsBN(
        ret.data.baseFee,
        18
      ), // TODO(Marko): Decimals hardcoded - Should be using decimals of destination chain native token
    } as APIFees;
  } catch (e: any) {
    logError(e);
    return {};
  }
};

export const getTokenPrice = async (
  chainId: SupportedNetworkId, tokenAddress: string
) => {
  const path = `/erc20/prices/current`;

  try {
    const ret = await priceFeedApi.post(
      path,
      {
        chainTokenAddresses: [{
          chainId,
          addresses: [tokenAddress]
        }]
      }
    );

    return ret.data?.[0]?.usdPrice || 1;
  } catch (e: any) {
    logError(e);
    return 1;
  }
};

export const getNativeTokenPrice = async (chainId: SupportedNetworkId) => getTokenPrice(
  chainId,
  "0x0000000000000000000000000000000000000000"
)

export const getRewards = async (
  crossChainId: CrossChainId, account: string
) => {
  const path = `/rewards?tokenId=${crossChainId}&userAddress=${account}`;

  try {
    const ret = await transfersApi.get(path);

    return {
      ...ret.data,
      alreadyClaimed: toTokenUnitsBN(
        ret.data.alreadyClaimed,
        18
      ), // TODO(Marko): Decimals hardcoded - Should be using decimals of destination chain native token
      claimable: toTokenUnitsBN(
        ret.data.claimable,
        18
      ), // TODO(Marko): Decimals hardcoded - Should be using decimals of destination chain native token
    } as APIFees;
  } catch (e: any) {
    logError(e);
    return {};
  }
};
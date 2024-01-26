import axios from "axios";

import { logError } from "@/submodules/contracts-operations/src/api"

const tvlVolumeApi = axios.create({ baseURL: process.env.TVL_VOLUME_API_URL });

export interface DataPoint {
  timestamp: number;
  valueUsd: number;
  valueToken: string;
};

export interface ByChainInfo {
  txCount?: number;
  volume?: number;
  points?: Array<DataPoint>;
}

export const TVLAPIIntervalValues = ['1h', '24h', '1w', '1m', '1y'] as const;
export type TVLAPIInterval = typeof TVLAPIIntervalValues[number];

export type APIType = 'tvl-by-liquidity' | 'bridge-volume' | 'total-bridge-tvl';

export const queryTVLAPI = async (api: APIType, chainId?: number, interval?: TVLAPIInterval) : Promise<ByChainInfo> => {
  const path = `/api/mosaic/${api}?${!!chainId ? `chainId=${chainId}` : ''}${!!interval ? `&interval=${interval}` : ''}`;

  try {
    const ret = await tvlVolumeApi.get(path);
    const points = ret.data.data.totalRecord;

    const txCount = ret.data.data.recordsCount;
    const volume = points.length > 0 ? points[points.length - 1].valueUsd : 0;

    return {
      txCount,
      volume,
      points,
    }
  } catch (e: any) {
    logError(e);
    return {
      txCount: 0,
      volume: 0,
      points: [],
    };
  }
}
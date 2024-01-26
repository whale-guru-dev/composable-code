import { DEFI_CONFIG } from "./config";

import { TokenId } from "./tokenInfo";

const supportedNetworkIds = DEFI_CONFIG.supportedNetworkIds; // important
export type SupportedNetworks = typeof supportedNetworkIds[number]

const supportedAMMs = DEFI_CONFIG.supportedAMMs // important
export type SupportedAMM = typeof supportedAMMs[number]

export type Network = {
  name: string;
  rpcUrl: string;
  infoPageUrl: string;
  infoPage: string;
  backgroundColor: string;
  logo: string;
  defaultTokenSymbol: string
  publicRpcUrl: string
  nativeToken: TokenId
}

export type AMM = {
  name: string;
  logo: string;
  recommended?: boolean;
};

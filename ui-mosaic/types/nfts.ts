import { TokenId } from "defi/tokenInfo";

import { SupportedNftRelayerNetwork } from "@/constants";
import BigNumber from "bignumber.js";

export type NftInternalStates =
  | "depositing"
  | "depositFailed"
  | "confirmingDeposit"
  | "processing";

/*
type NftExternalStates =
  | "summon_confirmed" // processing
  | "release_confirmed" // processing
  | "transferring-summoning" // processing
  | "transferring-summon-submitted"// processing
  | "transferring-releasing" // processing
  | "transferring-release-submitted" // processing
  | "transferring-released" // processing
  | "success-done"  // success
  | "expired-releasing" // processing
  | "expired-release-submitted" // processing
  | "expired-released" // processing
  | "expired-done"  // expired
  | "error-summoning" // processing
  | "error-summoned" // processing
  | "error-releasing" // processing
  | "error-released"; // processing
*/

export interface NftTransfertatusApiResponse {
  uniqueId: string;
  publicId: string;
  eventType: string;
  sourceNftId: string;
  originalNftId: string;

  sourceNftOwner: string;
  sourceNftAddress: string;

  destinationNftAddress: string;
  destinationNftId?: string;
  destinationNftOwner: string;

  originalNftAddress: string;
  sourceNetworkId: string;
  destinationNetworkId: string;
  originalNetworkId: string;
  maxTransferWaitingTime: string;
  depositGasFee: string;
  transactions: { [eventType: string]: { hash: string; timestamp: string } };
  status: NftExternalStates;
  nftUri: string;

  feeToken: string;
  feeAmount: string;
}

export type NftExternalStates =
  | "processing"
  | "success"
  | "expired"
  | "withdrawSubmitted";

export type NftTransferStates = NftInternalStates | NftExternalStates;

export enum NftEventType {
  Summon = "Summon",
  Release = "Release",
  Deposit = "Deposit",
}

export interface Transfer {
  id: string;
  fromChainId: SupportedNftRelayerNetwork;
  toChainId: SupportedNftRelayerNetwork;
  fromTimestamp: number;
  fromBlock: number;
  fromBlockCurrent: number;
  toTimestamp: number;
  fromAddress: string;
  toAddress: string;
  fee: BigNumber;
  feeTokenId: TokenId;
  depositTxHash: string;
  withdrawalTxHash: string;
  status: NftTransferStates;
}

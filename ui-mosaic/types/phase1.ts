import BigNumber from "bignumber.js";
import { TokenId } from "defi/tokenInfo";

import { SupportedRelayerNetwork } from "@/constants";

export type InternalStates =
  | "depositing"
  | "depositFailed"
  | "confirmingDeposit"
  | "processing";

export type ExternalStates =
  | "deposit_confirmed" // done
  | "tranferring-withdrawing" // done
  | "transferring-withdraw_submitted" //done
  | "transferring-withdrawn" // not done
  | "transferring-unlocking_in_transfer_funds" // done
  | "transferring-unlock_in_transfer_funds_submitted" // done
  | "transferring-unlocked_in_transfer_funds" // not done
  | "success-done" //done
  | "expired-unlocking_funds" // done
  | "expired-unlock_funds_submitted" // done
  | "expired-unlocked_funds" // not done
  | "expired-done" //done
  | "error-invalid_deposit" // done
  | "error-unlocked_funds" //done
  | "error-withdrawn" //done
  | "error-unlocked_in_transfer_funds" //done
  | "error-done"; //done

export type TransferStates = InternalStates | ExternalStates;

export interface Transfer {
  id: string;
  fromChainId: SupportedRelayerNetwork;
  toChainId: SupportedRelayerNetwork;
  fromTimestamp: number;
  toTimestamp: number;
  fromAddress: string;
  toAddress: string;
  amount: BigNumber;
  gasFee: BigNumber;
  fee: BigNumber;
  tokenId: TokenId;
  depositTxHash: string;
  withdrawalTxHash: string;
  status: TransferStates;
}

export interface TransferApiResponseStatus {
  uniqueId: string;

  depositTxHash: string;
  depositTimestamp: Date;

  withdrawTxHash: string;
  withdrawTimestamp: Date;

  unlockInTransferTxHash: string;
  unlockInTransferTimestamp: Date;

  sourceUserAddress: string;
  destinationUserAddress: string;

  amount: string;
  fee: string;
  depositGasCost: string;

  sourceTokenAddress: string;
  destinationTokenAddress: string;

  maxTransferWaitingTime: number;
  status: string;

  sourceNetworkId: number;
  remoteNetworkId: number;
}

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

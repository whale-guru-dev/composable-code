import { NftTransferStatusType } from "./types";

export const NFTTransferStatusValues = {
  depositing: "depositing" as NftTransferStatusType,
  deposited: "deposited" as NftTransferStatusType,
  confirming: "confirming" as NftTransferStatusType,
  sending: "sending" as NftTransferStatusType,
  processing: "processing" as NftTransferStatusType,
  done: "done" as NftTransferStatusType,
  error: "error" as NftTransferStatusType,
};

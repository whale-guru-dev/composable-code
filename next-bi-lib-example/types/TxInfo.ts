export enum TxStatus {
  Error = "Error",
  WaitingForConfirmation = "Waiting for confirmation",
  Done = "Done",
}

export interface TxInfo {
  info?: any;
  status: TxStatus;
}
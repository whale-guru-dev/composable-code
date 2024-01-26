import { NftTransferStates } from "@/types/nfts";
import { TransferStates } from "@/types/phase1";
import { AllColorType } from "@/types/types";

export const CELL_WIDTHS: Record<string, string> = {
  asset: "12%",
  value: "14%",
  from: "15%",
  to: "13%",
  time: "15%",
  status: "13%",
  rewards: "13%",
};

export const CELL_WIDTHS_NO_REWARDS: Record<string, string> = {
  asset: "14%",
  value: "17%",
  from: "17%",
  to: "15%",
  time: "17%",
  rewards: "15%",
};

export const CELL_WIDTHS_NFTS: Record<string, string> = {
  asset: "25%",
  from: "18%",
  to: "18%",
  time: "20%",
  status: "14%",
};

export const CELL_WIDTHS_TRANSFERS_NFTS: Record<string, string> = {
  asset: "25%",
  from: "15%",
  to: "15%",
  time: "15%",
  status: "15%",
}

export type HeaderInfo = {
  key: keyof typeof CELL_WIDTHS;
  label: string;
  detail?: boolean;
};

export const EXPLORER_HEADERS: Array<HeaderInfo> = [
  { key: "asset", label: "Asset" },
  { key: "value", label: "Value" },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "time", label: "Time" },
  { key: "rewards", label: "Your rewards", detail: true },
];

export const EXPLORER_NFT_HEADERS: Array<HeaderInfo> = [
  { key: "asset", label: "Asset" },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "time", label: "Time" },
];

export const MY_TRANSFER_HEADERS: Array<HeaderInfo> = [
  { key: "asset", label: "Asset" },
  { key: "value", label: "Value" },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status" },
];

export const MY_TRANSFER_NFT_HEADERS: Array<HeaderInfo> = [
  { key: "asset", label: "Asset" },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status" },
];

const numberEnding = (number: number) => (number > 1 ? "s" : "");

export const humanizeTime = (epoch: number) => {
  const milliseconds = new Date().getTime() - epoch;

  let temp = Math.floor(milliseconds / 1000);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }

  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  const seconds = temp % 60;
  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }
  return "less than a second";
};

const statusArray = (...statuses: TransferStates[]) => {
  return [...statuses];
};

export const mapStatusToColor = (status: TransferStates): AllColorType => {
  if (statusArray("depositing", "expired-done").includes(status)) {
    return "warning";
  }

  if (
    statusArray(
      "depositing",
      "confirmingDeposit",
      "processing",
      "deposit_confirmed",
      "tranferring-withdrawing",
      "transferring-withdraw_submitted",
      "transferring-withdrawn", // not done

      "expired-unlocked_funds",
      "error-invalid_deposit",
      "error-unlocked_funds",
      "expired-unlocking_funds",
      "expired-unlock_funds_submitted",
      "error-withdrawn",
      "error-unlocked_in_transfer_funds"
    ).includes(status)
  ) {
    return "info";
  }

  if (
    statusArray(
      "transferring-unlocking_in_transfer_funds",
      "transferring-unlock_in_transfer_funds_submitted",
      "transferring-unlocked_in_transfer_funds",
      "success-done"
    ).includes(status)
  ) {
    return "success";
  }

  if (statusArray("error-done", "depositFailed").includes(status)) {
    return "error";
  }

  return "primary";
};

export const humanizeStatus = (status: TransferStates) => {
  if (statusArray("depositing").includes(status)) {
    return "Depositing";
  }

  if (statusArray("expired-done").includes(status)) {
    return "Expired";
  }

  if (statusArray("error-done").includes(status)) {
    return "Error";
  }

  if (statusArray("depositFailed").includes(status)) {
    return "Error Depositing";
  }

  if (
    statusArray(
      "depositing",
      "confirmingDeposit",
      "processing",
      "deposit_confirmed",
      "tranferring-withdrawing",
      "transferring-withdraw_submitted",
      "transferring-withdrawn", // not done

      "expired-unlocked_funds",
      "error-invalid_deposit",
      "error-unlocked_funds",
      "expired-unlocking_funds",
      "expired-unlock_funds_submitted",
      "error-withdrawn",
      "error-unlocked_in_transfer_funds"
    ).includes(status)
  ) {
    return "Transferring";
  }

  if (
    statusArray(
      "transferring-unlocking_in_transfer_funds",
      "transferring-unlock_in_transfer_funds_submitted",
      "transferring-unlocked_in_transfer_funds",
      "success-done"
    ).includes(status)
  ) {
    return "Success";
  }

  return "Unknown";
};

const nftStatusArray = (...statuses: NftTransferStates[]) => {
  return [...statuses];
};

export const mapNftStatusToColor = (
  status: NftTransferStates
): AllColorType => {
  if (nftStatusArray("expired").includes(status)) {
    return "warning";
  }

  if (
    nftStatusArray(
      "processing",
      "withdrawSubmitted",
      "depositing",
      "confirmingDeposit"
    ).includes(status)
  ) {
    return "info";
  }

  if (nftStatusArray("success").includes(status)) {
    return "success";
  }

  if (nftStatusArray("depositFailed").includes(status)) {
    return "error";
  }

  return "primary";
};

export const nftHumanizeStatus = (status: NftTransferStates) => {
  if (nftStatusArray("expired").includes(status)) {
    return "Expired";
  }

  if (nftStatusArray("depositing", "confirmingDeposit").includes(status)) {
    return "Depositing";
  }
  if (nftStatusArray("processing", "withdrawSubmitted").includes(status)) {
    return "Transferring";
  }
  if (nftStatusArray("success").includes(status)) {
    return "Success";
  }

  if (nftStatusArray("depositFailed").includes(status)) {
    return "Error Depositing";
  }

  return "Unknown";
};

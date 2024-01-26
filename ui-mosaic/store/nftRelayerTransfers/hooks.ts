import { ContractsContext } from "defi/ContractsContext";
import { SupportedNetworks } from "defi/types";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppSelector } from "store";
import { initialNftTransferState, selectAllNftRelayerTransfers } from "./slice";

export function useTransactions() {
  const { chainId, account } = useContext(ContractsContext);

  const t = useSelector((state: RootState) => state.transactions);

  const exists =
    account &&
    (chainId as SupportedNetworks) in t &&
    account in t[chainId as SupportedNetworks];

  return useSelector((state: RootState) =>
    exists ? state.transactions[chainId ?? -1][account ?? ""] : {}
  );
}

export const useNftTransfer = (transferId: string) => {
  const transfers = useAppSelector(selectAllNftRelayerTransfers);
  const f = Object.values(transfers).find(
    (transfer) =>
      transfer.id === transferId ||
      `${transfer.sourceNftInfo.chainId}-${transfer.depositTxHash}` ===
        transferId
  );
  return f ?? initialNftTransferState;
};

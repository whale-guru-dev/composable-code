import { ContractsContext } from "@/defi/ContractsContext";
import { useContext, useMemo } from "react";
import { useAppSelector } from "store";
import { selectAllTransactions } from "store/tranasctions/slice";

export const usePendingTransactions = (
  contractAddress: string | undefined,
  functionNames: string | string[]
): boolean => {
  const { account, chainId } = useContext(ContractsContext);
  const txs = useAppSelector(selectAllTransactions);

  const isOngoingTx = () => {
    if (
      !chainId ||
      !account ||
      !(chainId in txs) ||
      !(account in txs[chainId])
    ) {
      return false;
    }

    return Object.values(txs[chainId][account]).some(
      (x) =>
        contractAddress !== undefined &&
        x.contractAddress === contractAddress &&
        (Array.isArray(functionNames)
          ? functionNames.includes(x.functionName)
          : x.functionName === functionNames) &&
        x.status === "pending"
    );
  };

  return useMemo(() => {
    return isOngoingTx();
  }, [txs, contractAddress, functionNames, account, chainId]);
};

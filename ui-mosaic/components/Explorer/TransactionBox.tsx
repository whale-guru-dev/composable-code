import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { BoxProps } from "@mui/material";
import EarnTransaction from "./EarnTransaction";
import SwapTransaction from "./SwapTransaction";

export type TransactionBoxProps = {
  tx: Transaction;
} & BoxProps;

export const TransactionBox = (props: TransactionBoxProps) => {
  const { tx } = props;
  
  switch (tx.type) {
    case 'token':
      return <SwapTransaction {...props} />;
    case 'liquidity-deposit':
      return <EarnTransaction {...props} />;
    case 'liquidity-withdrawal':
      return <EarnTransaction {...props} />;
    default:
      return null;
  }
}
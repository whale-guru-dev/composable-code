import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Stepper, Step, StepLabel } from "@mui/material";

import Connector from "./Connector";
import StepIcon from "./StepIcon";
import FlowLabel from "./FlowLabel";
import { TransferStore } from "store/relayerTransfers/slice";

type TransactionFlowProps = {
  transaction: TransferStore;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "transparent",
    },
  })
);

const TransactionFlow = ({ transaction }: TransactionFlowProps) => {
  const classes = useStyles();
  const activeStep = () => {
    if (["depositing", "depositFailed"].includes(transaction.status)) {
      return 0;
    }

    if (["confirmingDeposit"].includes(transaction.status)) {
      return 1;
    }

    if (
      ["processing", "deposit_confirmed", "error-unlocked_funds"].includes(
        transaction.status
      )
    ) {
      return 2;
    }

    if (
      [
        "transferring-withdrawn",
        "error-withdrawn",
        "tranferring-withdrawing",
        "transferring-withdraw_submitted",
        "expired-done",
      ].includes(transaction.status)
    ) {
      return 3;
    }
    /*
    | "transferring-unlocking_in_transfer_funds" // done
  | "transferring-unlock_in_transfer_funds_submitted" // done
  | "transferring-unlocked_in_transfer_funds" // not done
  | "success-done" //done
  | "expired-unlocking_funds" // done
  | "expired-unlock_funds_submitted" // done
  | "expired-unlocked_funds" // not done
  | "expired-done" //done
   "error-invalid_deposit" // done
     | "error-unlocked_in_transfer_funds" //done
  | "error-done"; //done
    */
    return 4;
  };

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep()}
      connector={<Connector />}
      className={classes.root}
    >
      {[0, 1, 2, 3, 4].map((_, index) => (
        <Step key={index}>
          <StepLabel icon={<StepIcon transaction={transaction} step={index} />}>
            <FlowLabel transaction={transaction} step={index} />
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default TransactionFlow;

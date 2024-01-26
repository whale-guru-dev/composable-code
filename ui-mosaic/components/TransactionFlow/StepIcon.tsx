import Image from "next/image";
import { Theme } from "@mui/material/styles";

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import { getToken } from "defi/tokenInfo";
import { NETWORKS } from "defi/networks";
import { TransferStore } from "store/relayerTransfers/slice";
import { clock } from "assets/icons/common";

type StepIconProps = {
  transaction: TransferStore;
  step: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
    },
    token: {},
    network: {
      marginLeft: theme.spacing(-0.8),
    },
  })
);

const StepIcon = ({ transaction, step }: StepIconProps) => {
  const classes = useStyles();
  const deposited = step <= 2;
  const token = getToken(transaction.tokenId);
  const network =
    NETWORKS[deposited ? transaction.fromChainId : transaction.toChainId];
  const tokenImage = step === 4 ? network.logo: [0, 3].includes(step)
    ? `${getToken(transaction.tokenId).picture}`
    : clock;

  return (
    <div className={classes.root}>
      <div className={classes.token}>
        <Image src={tokenImage} alt={token.symbol} width="24" height="24" />
      </div>
      {(step !== 2 && step !== 4) && (
        <div className={classes.network}>
          <Image
            src={network.logo}
            alt={network.name}
            width="12"
            height="12"
          />
        </div>
      )}
    </div>
  );
};

export default StepIcon;

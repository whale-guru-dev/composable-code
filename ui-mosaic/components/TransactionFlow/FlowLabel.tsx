import { Typography, Link } from "@mui/material";
import { Theme } from "@mui/material/styles";

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import { NETWORKS } from "defi/networks";
import { TransferStore } from "store/relayerTransfers/slice";
import { NEEDED_CONFIRMATIONS } from "../../constants";
import { getToken } from "defi/tokenInfo";
import Image from "next/image";
import { openInNew } from "assets/icons/common";

type FlowLabelProps = {
  transaction: TransferStore;
  step: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      color: theme.palette.text.primary,
      fontSize: "10px",
      lineHeight: "16px",
    },
    icon: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing(1),
      "& svg path": {
        fill: theme.palette.primary.main,
      },
    },
  })
);

const FlowLabel = ({ transaction, step }: FlowLabelProps) => {
  const classes = useStyles();

  const confirmationsNeeded = NEEDED_CONFIRMATIONS[transaction.fromChainId];
  const token = getToken(transaction.tokenId);

  let content;
  switch (step) {
    case 0:
      content = (
        <>
          <Typography className={classes.label}>
            Depositing {token.symbol}
          </Typography>
          <Link
            href={`${NETWORKS[transaction.fromChainId].infoPageUrl}${
              transaction.depositTxHash
            }`}
            target="_blank"
            rel="noreferrer"
            underline="none"
            className={classes.icon}
          >
            <Image src={openInNew} alt={"Go to transaction"} height={14} width={14} />
          </Link>
        </>
      );
      break;
    case 1:
      content = (
        <Typography className={classes.label}>{`${
          transaction.fromBlockCurrent - transaction.fromBlock
        }/${confirmationsNeeded} confirmations`}</Typography>
      );
      break;
    case 2:
      content = <Typography className={classes.label}>Processing</Typography>;
      break;
    case 3:
      content = (
        <>
          <Typography className={classes.label}>
            Sending {token.symbol}
          </Typography>
          {transaction.withdrawalTxHash.length && (
            <Link
              href={`${NETWORKS[transaction.toChainId].infoPageUrl}${
                transaction.withdrawalTxHash
              }`}
              target="_blank"
              rel="noreferrer"
              underline="none"
              className={classes.icon}
            >
             <Image src={openInNew} alt={"Go to transaction"} height={14} width={14} />
            </Link>
          )}
        </>
      );
      break;
    case 4:
      content = <Typography className={classes.label}>Done</Typography>;
  }

  return <div className={classes.root}>{content}</div>;
};

export default FlowLabel;

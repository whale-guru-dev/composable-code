import { Typography, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { alpha } from '@mui/material/styles';
import BigNumber from "bignumber.js";
import Image from "next/image";

import { SupportedNetworks } from "defi/types";
import { NETWORKS } from "defi/networks";
import { Token } from "@/defi/tokenInfo";

type LiquidityProps = {
  fromId: SupportedNetworks;
  toId: SupportedNetworks;
  fromAmount: BigNumber;
  toAmount: BigNumber;
  token: Token;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    content: {
      display: "flex",
      border: `1px solid ${alpha(theme.palette.text.primary, 0.16)}`,
      borderRadius: "10px",
      padding: theme.spacing(3, 4),
    },
    label: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1),
    },
    image: {},
    networks: {
      display: "flex",
      width: "100%",
      margin: theme.spacing(0.75, 1.5, 0, 1.5),
    },
    network: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    bar: {
      width: "100%",
      height: "5px",
      marginBottom: theme.spacing(1),
      borderRadius: "3px",
    },
    amount: {
      fontSize: "18px",
      color: theme.palette.text.primary,
    },
    symbol: {
      marginLeft: theme.spacing(1),
      fontSize: "14px",
      color: theme.palette.text.secondary,
    },
  })
);

const Liquidity = ({
  fromId,
  toId,
  fromAmount,
  toAmount,
  token,
}: LiquidityProps) => {
  const classes = useStyles();
  const fromNetwork = NETWORKS[fromId];
  const toNetwork = NETWORKS[toId];

  const total = fromAmount.toNumber() + toAmount.toNumber();
  const fromPercent = (fromAmount.toNumber() / total) * 100 + 1;
  const toPercent = (toAmount.toNumber() / total) * 100 + 1;
  const fromStyle = {
    width: `${!toPercent && !fromPercent ? 50 : fromPercent}%`,
  };
  const toStyle = {
    width: `${!toPercent && !fromPercent ? 50 : toPercent}%`,
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.label}>Available Liquidity</Typography>

      <div className={classes.content}>
        <div className={classes.image}>
          <Image
            src={fromNetwork.logo}
            alt={fromNetwork.name}
            width="16"
            height="16"
          />
        </div>
        <div className={classes.networks}>
          <div className={classes.network} style={fromStyle}>
            <div
              className={classes.bar}
              style={{ backgroundColor: fromNetwork.backgroundColor }}
            ></div>
            <Typography className={classes.amount}>
              {fromAmount.toFixed(token.displayedDecimals)}
              <span className={classes.symbol}>{token.symbol}</span>
            </Typography>
          </div>
          <div className={classes.network} style={toStyle}>
            <div
              className={classes.bar}
              style={{ backgroundColor: toNetwork.backgroundColor }}
            ></div>
            <Typography className={classes.amount}>
              {toAmount.toFixed(token.displayedDecimals)}
              <span className={classes.symbol}>{token.symbol}</span>
            </Typography>
          </div>
        </div>
        <div className={classes.image}>
          <Image
            src={toNetwork.logo}
            alt={toNetwork.name}
            width="16"
            height="16"
          />
        </div>
      </div>
    </div>
  );
};

export default Liquidity;

import React from "react";
import Image from "next/image";
import { Theme, Typography } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

import { getToken, TokenId } from "defi/tokenInfo";
import BigNumber from "bignumber.js";
import { kFormatter } from "utils";

export type TokenValueProps = {
  size: "default" | "large";
  tokenId: TokenId;
  value: BigNumber;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    image: {
      marginRight: theme.spacing(1.2),
      display: "flex",
      alignItems: "center",
    },
    valueContainer: {
      display: "flex",
      alignItems: "baseline",
    },
    value: {
      fontSize: "16px",
      color: theme.palette.text.primary,
      lineHeight: "24px",
      marginRight: theme.spacing(1),
      "&.large": {
        fontSize: "36px",
        lineHeight: "40px",
      },
    },
    symbol: {
      fontSize: "14px",
      color: theme.palette.text.secondary,
      lineHeight: "14px",
      "&.large": {
        fontSize: "16px",
        lineHeight: "24px",
      },
    },
  })
);

const TokenValue = ({ size, tokenId, value }: TokenValueProps) => {
  const classes = useStyles();

  const imgSize = size === "default" ? "18px" : "24px";

  const token = getToken(tokenId);

  return (
    <div className={classes.root}>
      <div className={classes.image}>
        <Image
          src={token.picture ? token.picture : `/tokens/${token.symbol.toLowerCase()}.png`} // TODO fix other images than .svgs
          alt={token.symbol}
          width={imgSize}
          height={imgSize}
        />
      </div>
      <div className={classes.valueContainer}>
        <Typography className={`${classes.value} ${size}`}>
          {kFormatter(parseFloat(value.toFixed(token.displayedDecimals)), token.displayedDecimals)}
        </Typography>
        <Typography className={`${classes.symbol} ${size}`}>
          {token.symbol}
        </Typography>
      </div>
    </div>
  );
};

export default TokenValue;

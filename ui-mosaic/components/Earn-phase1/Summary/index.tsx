import { Box, Grid, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

import SummaryPanel from "./SummaryPanel";
import VerticalMetric from "./VerticalMetric";
import HorizontalMetric from "./HorizontalMetric";
import TokenValue from "./TokenValue";
import { useAppSelector } from "store";
import { selectLpVaultGeneral, selectLpVaultUser } from "store/lpVault/slice";
import BigNumber from "bignumber.js";
import { selectRelayerVaultGeneral } from "store/relayerVault/slice";
import {
  LIQUIDITY_PROVIDER_SUPPORTED_TOKEN,
  LIQUIDITY_PROVIDER_WITHDRAWABLE_ADDRESSES,
  RELAYER_SUPPORTED_TOKENS,
  SupportedLpToken,
  SupportedRelayerToken,
} from "../../../constants";
import { getToken, TokenId } from "defi/tokenInfo";
import {
  RELAYER_SUPPORTED_NETWORKS,
  SupportedRelayerNetwork,
  LAYR_PRICE,
} from "../../../constants";
import { useTokenData } from "hooks/useTokenData";
import { useContext } from "react";
import { ContractsContext } from "@/defi/ContractsContext";
import Button from "@/components/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(6, 0),
    },
    panel: {
      display: "flex",
      justifyContent: "space-between",
      minHeight: "110px",
    },
    panelX: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "110px",
    },
  })
);

const SummaryPart = ({
  tokenId,
  onClick,
  onWithdraw,
}: {
  tokenId: TokenId;
  onClick: (tokenId: SupportedLpToken) => any;
  onWithdraw: (tokenId: SupportedLpToken) => any;
}) => {
  const classes = useStyles();
  const { account } = useContext(ContractsContext);

  const general = useAppSelector(selectLpVaultGeneral);
  const user = useAppSelector(selectLpVaultUser);
  const relayerGeneral = useAppSelector(selectRelayerVaultGeneral);
  const tokens = useTokenData(RELAYER_SUPPORTED_TOKENS.map((x) => x.tokenId));
  const isDisabled = !general[tokenId as SupportedRelayerToken].isEnabled;
  const isDisabledWithdraw =
    !general[tokenId as SupportedRelayerToken].isEnabledWithdraw;

  const isAbleToWithdraw =
    !isDisabledWithdraw &&
    LIQUIDITY_PROVIDER_WITHDRAWABLE_ADDRESSES.map((x) =>
      x.toLowerCase()
    ).includes(account ? account.toLowerCase() : "");

  const getFees = () => {
    let fees = new BigNumber(0);
    const chainId = RELAYER_SUPPORTED_NETWORKS[0] as SupportedRelayerNetwork;

    if (tokenId in relayerGeneral) {
      fees = new BigNumber(
        tokenId === "usdc"
          ? 64265.72 // TODO remove this shit
          : relayerGeneral[tokenId as SupportedRelayerToken][chainId].totalFees
      );
    }

    return fees;
  };

  const apy = (tokenId: SupportedRelayerToken) => {
    const relayerToken = RELAYER_SUPPORTED_TOKENS.find(
      (x) => x.tokenId === (tokenId as SupportedRelayerToken)
    );
    if (!relayerToken) {
      return new BigNumber(0);
    }
    // @ts-ignore
    const price = tokenId in tokens ? tokens[tokenId].price : 1;
    let fees = getFees();

    const totalDeposited = new BigNumber(
      general[tokenId as SupportedRelayerToken].tvl
    );

    const daysSinceLaunch =
      (Date.now() - relayerToken.launchTimestamp) / (60 * 60 * 24 * 1000);
    const apy = fees
      .div(daysSinceLaunch)
      .multipliedBy(1 * 365)
      .dividedBy(totalDeposited)
      .multipliedBy(100);
    return isNaN(apy.toNumber()) ? new BigNumber(0) : apy;
  };

  const earnedFees = (tokenId: SupportedRelayerToken) => {
    // @ts-ignore
    const price = tokenId in tokens ? tokens[tokenId].price : 1;
    let fees = getFees();
    const feeShare = user[tokenId as SupportedRelayerToken].feeShare;
    if (feeShare === 0 || fees.isZero()) {
      return new BigNumber(0);
    }
    const token = getToken(tokenId);
    return new BigNumber(
      fees
        .multipliedBy(feeShare / 100)
        .multipliedBy(price)
        .dividedBy(LAYR_PRICE)
        .toFixed(token.decimals)
    );
  };

  return (
    <SummaryPanel className={classes.panel}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
          <Box display="flex" justifyContent="space-around">
            <VerticalMetric
              label="Average APY"
              value={`${
                apy(tokenId as SupportedRelayerToken).isZero()
                  ? "~"
                  : apy(tokenId as SupportedRelayerToken).toFixed(0)
              }%`}
            />
            <VerticalMetric
              label="Your rewards"
              value={
                <TokenValue
                  tokenId={"layr"}
                  value={earnedFees(tokenId as SupportedRelayerToken)}
                  size="large"
                />
              }
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              size="large"
              type="submit"
              onClick={() => onClick(tokenId as SupportedLpToken)}
              style={{
                marginTop: 16,
                width: isAbleToWithdraw ? "45%" : "100%",
                height: 50,
              }}
              disabled={isDisabled}
            >
              Earn
            </Button>
            {isAbleToWithdraw && (
              <Button
                variant="outlined"
                size="large"
                type="submit"
                onClick={() => onWithdraw(tokenId as SupportedLpToken)}
                style={{ marginTop: 16, width: "45%", height: 50 }}
              >
                Withdraw
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
          <HorizontalMetric
            label="Position"
            value={
              <TokenValue
                tokenId={tokenId}
                value={
                  new BigNumber(user[tokenId as SupportedLpToken].deposited)
                }
                size="default"
              />
            }
          />
          <HorizontalMetric
            label="Pool share"
            value={`${new BigNumber(user[tokenId as SupportedLpToken].deposited)
              .div(general[tokenId as SupportedLpToken].tvl)
              .multipliedBy(100)
              .toFixed(2)}%`}
          />
          <HorizontalMetric
            label="TVL"
            value={
              <Box display="flex">
                <TokenValue
                  tokenId={tokenId}
                  value={
                    new BigNumber(general[tokenId as SupportedLpToken].tvl)
                  }
                  size="default"
                />
              </Box>
            }
          />
          <HorizontalMetric
            label="Total fees"
            value={
              <TokenValue tokenId={tokenId} value={getFees()} size="default" />
            }
          />
        </Grid>
      </Grid>
    </SummaryPanel>
  );
};

const Summary = ({
  onTokenSelect,
  onTokenSelectWithdraw,
}: {
  onTokenSelect: (tokenId: SupportedLpToken) => any;
  onTokenSelectWithdraw: (tokenId: SupportedLpToken) => any;
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {LIQUIDITY_PROVIDER_SUPPORTED_TOKEN.map((t, i) => (
          <Grid key={i} item xs={12} md={12}>
            {SummaryPart({
              tokenId: t.tokenId,
              onClick: onTokenSelect,
              onWithdraw: onTokenSelectWithdraw,
            })}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Summary;

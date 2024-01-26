import Image from "next/image";
import BigNumber from "bignumber.js";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  alpha,
  Box,
  BoxProps,
  Grid,
  IconButton,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import InfoBox from "@/components/InfoBox";
import BoxItem from "./BoxItem";
import TextItem from "./TextItem";
import { CrossChainId, CrossChainToken, selectCrossChainTokens } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import FeaturedBox from "@/components/FeaturedBox";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store";
import { useConnector } from "@integrations-lib/core";
import { APIRewards, getRewards } from "@/submodules/contracts-operations/src/api";
import { useRouter } from "next/router";
import useMobile from "@/hooks/useMobile";
import PositionCell from "../Positions/PositionCell";
import { TokenInfo, TokenInfoPerChains } from "@/phase2/components/CrossChainTokenDetails";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";

type PositionDetailsProps = {
  crossChainId: CrossChainId;
  tokenInfo: TokenInfoPerChains;
  variant: 'row' | 'boxes';
} & BoxProps;

const PositionDetails = ({
  crossChainId,
  tokenInfo,
  variant,
  ...rest
}: PositionDetailsProps) => {
  const crossChainTokens: Array<CrossChainToken> = useAppSelector(selectCrossChainTokens);
  
  const crossChainToken = useMemo(
    () => crossChainTokens.find((token: CrossChainToken) => token.crossChainId === crossChainId),
    [crossChainId, crossChainTokens]
  )

  console.log("GAGAS", tokenInfo)

  const depositedValue = useMemo(
    () => Object.values(tokenInfo).reduce(
      (sum: BigNumber, info: TokenInfo) => sum.plus(info.deposited),
      new BigNumber(0)
    ),
    [tokenInfo]
  )

  const depositedUSDValue = useMemo(
    () => Object.values(tokenInfo).reduce(
      (sum: BigNumber, info: TokenInfo) => sum.plus(info.deposited?.multipliedBy(info.price) || 0),
      new BigNumber(0)
    ).toFixed(2),
    [tokenInfo]
  )

  const depositedText = `$${depositedUSDValue}`;

  const hasDeposited = depositedValue.isGreaterThan(0);

  const [rewards, setRewards] = useState<APIRewards | undefined>(undefined);

  const { account } = useConnector('metamask');

  useEffect(() => {
    if (account && crossChainToken) {
      getRewards(
        crossChainToken.crossChainId,
        account
      ).then((value: APIRewards) => {
        setRewards(value);
      });
    }
  }, [account, crossChainToken]);

  const { getTokenAmountDecimals } = useContext(NetworkTokenOperationsContext);

  const displayTokenDecimals = useMemo(
    () => crossChainToken && getTokenAmountDecimals({
      ...crossChainToken,
      chainId: 4, // TODO(Marko): Which chainId to use when token could be deposited on multiple networks? Information lost?
      address: crossChainToken.addresses[4] as string, // TODO(Marko): Which chainId to use when token could be deposited on multiple networks? Information lost?
      decimals: crossChainToken.decimals[4] as number, // TODO(Marko): Which chainId to use when token could be deposited on multiple networks? Information lost?
    }),
    [crossChainToken, getTokenAmountDecimals]
  );

  const tokenDecimals = crossChainToken?.decimals[4]; // TODO(Marko): Which token decimals to use when token could be deposited on multiple networks? Information lost?
  const tokenPrice = tokenInfo[4]?.price; // TODO(Marko): Which token price to use when token could be deposited on multiple networks? Information lost?

  const earnedFeesValue = rewards?.claimable && displayTokenDecimals ? `${rewards.claimable.toFixed(displayTokenDecimals)} ${crossChainToken?.symbol}` : "-";
  const earnedFeesUSDValue = rewards?.claimable && `${rewards.claimable.times(tokenPrice).toFixed(2)} USD` || "-";

  const totalValue = rewards?.claimable && tokenDecimals && `${depositedValue.plus(rewards.claimable).toFixed(tokenDecimals)} ${crossChainToken?.symbol}` || "-";
  const totalUSDValue = rewards?.claimable && `${depositedValue.plus(rewards.claimable).times(tokenPrice).toFixed(2)} USD` || "-";

  const tvlValue = useMemo(
    () => Object.values(tokenInfo).reduce(
      (sum: BigNumber, info: TokenInfo) => sum.plus(info.liquidity?.multipliedBy(info.price) || 0),
      new BigNumber(0)
    ),
    [tokenInfo]
  )

  const tvlText = `$${tvlValue.toFixed(2)}`;

  const poolShare = `${depositedValue.div(tvlValue).times(100).toFixed(2)}%`;

  const router = useRouter();

  const onTokenSelect = () => {
    router.push(`/vaults/${crossChainToken?.crossChainId}/deposit`);
  };

  const isMobile = useMobile("sm");

  const theme = useTheme();

  return (
    variant === 'boxes' ?
    crossChainToken && hasDeposited ?
    <Box {...rest}>
      <InfoBox textAlign="center">
        <Typography variant="subtitle1">
          Total Value
        </Typography>
        <Typography variant="h5" mt={1}>
          {totalValue}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {totalUSDValue}
        </Typography>
      </InfoBox>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <BoxItem  label="Deposited"
                  icon={
                    <Image src={crossChainToken.image} width={24} height={24} alt={crossChainToken.symbol} />
                  }
                  amountText={depositedText}
                  amountIntro={depositedUSDValue}
                  width="50%"
                  mr={3}
                  padding={3} />
        <BoxItem  label="Earned Fees*"
                  icon={
                    <Image src={crossChainToken.image} width={24} height={24} alt={crossChainToken.symbol} />
                  }
                  amountText={earnedFeesValue}
                  amountIntro={earnedFeesUSDValue}
                  width="50%"
                  padding={3} />

      </Box>

      <Box display="flex" justifyContent="space-between" mt={6}>
        <TextItem label="APY" amountText="58%" width="30%" />
        <TextItem label="TVL" amountText={tvlText} width="30%" />
        <TextItem label="Pool share" amountText={poolShare} width="30%" />
      </Box>

      <Box sx={{
                borderTop: (theme: Theme) => `1px solid ${alpha(theme.palette.common.white, theme.opacity.lighter)}`,
              }}
            mt={6}/>

      <Typography variant="caption"
                  color="text.secondary"
                  mt={3}
                  textAlign="center"
                  component="div"
      >
        *Earned Fees will be withdrawn once you withdraw your Deposited Assets.
      </Typography>
    </Box>
    :
    <FeaturedBox
      title="Vault Balance"
      intro="Deposit to start eraning"
      mt={6}
    />
    :
    crossChainToken && hasDeposited ?
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        border: (theme: Theme) =>
          `1px solid ${alpha(
            theme.palette.text.primary,
            theme.opacity.lighter
          )}`,
        borderRadius: 1,
        padding: (theme: Theme) => theme.spacing(3, 3),
        ":hover": {
          cursor: "pointer",
          borderColor: "primary.main",
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.primary.main, theme.opacity.lighter),
        },
      }}
      onClick={onTokenSelect}
      {...rest}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={2}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  marginRight: (theme: Theme) => theme.spacing(2),
                }}
              >
                <Image src={crossChainToken.image} width={24} height={24} alt={crossChainToken.symbol} />
              </Box>
              <Box>
                <Typography variant="body2">{crossChainToken.symbol}</Typography>
              </Box>
            </Box>
            {isMobile && (
              <Box>
                <IconButton
                  sx={{
                    fontSize: 14,
                    border: 0,
                    padding: 0,
                    width: "auto",
                    height: "auto",
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{
                      fontSize: 14,
                    }}
                  />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <PositionCell label="APY:">
            <Typography variant="body2">
              58%
            </Typography>
          </PositionCell>
        </Grid>
        <Grid item xs={12} md={2}>
          <PositionCell label="TVL:">
            <Typography variant="body2">
              {tvlText}
            </Typography>
          </PositionCell>
        </Grid>
        <Grid item xs={12} md={2}>
          <PositionCell label="Pool share:">
            <Typography variant="body2">{poolShare}</Typography>
          </PositionCell>
        </Grid>
        <Grid item xs={12} md={2}>
          <PositionCell label="Deposited:">
            <Typography variant="body2">{depositedText}</Typography>
          </PositionCell>
        </Grid>
        <Grid item xs={12} md={2}>
          <PositionCell label="Earned Fees:">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: (theme: Theme) => theme.palette.other.featured.main,
                }}
              >
                {earnedFeesValue}
              </Typography>
              {!isMobile && (
                <IconButton
                  sx={{
                    fontSize: 14,
                    border: 0,
                    padding: 0,
                    width: "auto",
                    height: "auto",
                    "&:hover": {
                      background: "transparent !important",
                    },
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{
                      fontSize: 14,
                    }}
                    htmlColor={theme.palette.primary.main}
                  />
                </IconButton>
              )}
            </Box>
          </PositionCell>
        </Grid>
      </Grid>
    </Box>
    :
    null
  );
};

PositionDetails.defaultProps = {
  variant: 'boxes',
}

export default PositionDetails;

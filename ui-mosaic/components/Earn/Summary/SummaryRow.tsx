import Image from "next/image";
import {
  Box,
  Grid,
  IconButton,
  Theme,
  useTheme,
  Typography,
  BoxProps,
  alpha,
} from "@mui/material";

import BigNumber from "bignumber.js";

import { kFormatter } from "utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useMobile from "@/hooks/useMobile";
import SummaryCell from "./SummaryCell";
import { useRouter } from "next/router";
import { CrossChainId, CrossChainToken, selectCrossChainTokens } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { useMemo } from "react";

import { useAppSelector } from "@/store";
<<<<<<< HEAD
import { SupportedNetworkId } from "@/submodules/contracts-operations/src/defi/constants";

import { toTokenUnitsBN } from "@integrations-lib/interaction";
import { getTokenPrice } from "@/submodules/contracts-operations/src/api";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";

type ChainIdTokenPair = {
  chainId: SupportedNetworkId;
  token: Token;
}

type TokenInfo = {
  liquidity: BigNumber;
  price: number;
}

type TokenInfoPerChains = {
  [chainId: number]: TokenInfo;
}
=======
import { TokenInfo, TokenInfoPerChains } from "@/phase2/components/CrossChainTokenDetails";
>>>>>>> a02151ebce3d9dba0e72967ee786d2174aaaef7c

type SummaryRowProps = {
  crossChainId: CrossChainId;
  tokenInfo: TokenInfoPerChains;
} & BoxProps;

const SummaryRow = ({
  crossChainId,
  tokenInfo,
  ...rest
}: SummaryRowProps) => {
  const isMobile = useMobile("sm");
  const theme = useTheme();
  const router = useRouter();

<<<<<<< HEAD
  const supportedTokens: SupportedTokens = useAppSelector(selectSupportedTokens);

  const chainIdTokenPairs: Array<ChainIdTokenPair> = useMemo(
    () => Object.entries(supportedTokens).reduce(
      (result: Array<ChainIdTokenPair>, chainTokens: [string, ChainSupportedTokens]) => {
        return chainTokens[1].liquidityTokens.reduce(
          (chainResult: Array<ChainIdTokenPair>, liquidityToken: LiquidityToken) => {
            if (liquidityToken.token.crossChainId === crossChainId) {
              chainResult.push({
                chainId: parseInt(chainTokens[0]) as SupportedNetworkId,
                token: liquidityToken.token,
              })
            }

            return chainResult;
          },
          result
        )
      },
      []
    ),
    [crossChainId, supportedTokens]
  );

  const token = chainIdTokenPairs[0].token;

  const [tokenInfo, setTokenIndo] = useState<TokenInfoPerChains>({});

  const {
    setToken,
    getLiquidity,
  } = useContext(NetworkTokenOperationsContext);

  useEffect(
    () => {
      chainIdTokenPairs.forEach((pair: ChainIdTokenPair) => setToken(pair.token));
    },
    [chainIdTokenPairs, setToken]
  )

  useEffect(
    () => {
      chainIdTokenPairs.forEach((pair: ChainIdTokenPair) => {
        const {
          chainId,
          token,
        } = pair;

        const liquidity = getLiquidity(token);

        if (liquidity) {
          setTokenIndo(tokenInfo => ({
            ...tokenInfo,
            [chainId]: {
              ...tokenInfo[chainId],
              liquidity: toTokenUnitsBN(liquidity.toString(), token.decimals),
            }
          }));
        }
      })
    },
    [chainIdTokenPairs, getLiquidity]
  );

  useEffect(
    () => {
      chainIdTokenPairs.forEach((pair: ChainIdTokenPair) => {
        const {
          chainId,
          token,
        } = pair;

        getTokenPrice(chainId, token.address).then((value: string) => {
          setTokenIndo(tokenInfo => ({
            ...tokenInfo,
            [chainId]: {
              ...tokenInfo[chainId],
              price: parseFloat(value),
            }
          }));
        });
      });
    },
    [chainIdTokenPairs]
  );

=======
>>>>>>> a02151ebce3d9dba0e72967ee786d2174aaaef7c
  const tvl = useMemo(
    () => Object.values(tokenInfo).reduce(
      (sum: BigNumber, info: TokenInfo) => sum.plus(info.liquidity?.multipliedBy(info.price) || 0),
      new BigNumber(0)
    ),
    [tokenInfo]
  )

  const apy = () => {
    return new BigNumber(0);
  };

  const crossChainTokens: Array<CrossChainToken> = useAppSelector(selectCrossChainTokens);
  
  const crossChainToken = useMemo(
    () => crossChainTokens.find((token: CrossChainToken) => token.crossChainId === crossChainId),
    [crossChainId, crossChainTokens]
  )

  const onTokenSelect = () => {
    router.push(`/vaults/${crossChainToken?.crossChainId}/deposit`);
  };

  return (
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
        <Grid item xs={12} md={3}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  marginRight: (theme: Theme) => theme.spacing(2),
                }}
              >
                <Image
                  src={
                    crossChainToken?.image
                      ? crossChainToken?.image
                      : `/tokens/${crossChainToken?.symbol.toLowerCase()}.png`
                  } // TODO fix other images than .svgs
                  alt={crossChainToken?.symbol}
                  width={24}
                  height={24}
                />
              </Box>
              <Box>
                <Typography variant="body2">{crossChainToken?.symbol}</Typography>
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
        <Grid item xs={12} md={4}>
          <SummaryCell label="APY:">
            <Typography variant="body2">
              {`${
                apy().isZero()
                  ? "~"
                  : apy().toFixed(0)
              }%`}
            </Typography>
          </SummaryCell>
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCell label="TVL:">
            <Typography variant="body2">
              $
              {kFormatter(
                parseFloat(tvl.toFixed(2)),
                2
              )}
            </Typography>
          </SummaryCell>
        </Grid>
        {!isMobile && (
          <Grid item xs={12} md={1} display="flex" justifyContent="right">
            <SummaryCell textAlign="right">
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
            </SummaryCell>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SummaryRow;

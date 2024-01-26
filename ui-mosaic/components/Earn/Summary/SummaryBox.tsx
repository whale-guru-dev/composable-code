import BigNumber from "bignumber.js";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Box, Grid, Theme, Typography, BoxProps, alpha } from "@mui/material";

import { allowedToMigrateTokenSymbols, getToken, Token, TokenId } from "defi/tokenInfo";
import Button from "components/Button";
import { useAppSelector } from "@/store";
import { selectLpVaultGeneral, selectLpVaultUser } from "@/store/lpVault/slice";
import { RELAYER_SUPPORTED_NETWORKS, SupportedLpToken, SupportedRelayerNetwork, SupportedRelayerToken } from "@/constants";
import { kFormatter } from "@/utils";
import { selectRelayerVaultGeneral } from "@/store/relayerVault/slice";

type SummaryRowInfoRowProps = {
  name: string;
  isVisible: boolean;
  symbol: string;
  token: Token;
  usingTokenImage: boolean;
  value: string;
}

const SummaryRowInfoRow = ({
  name,
  symbol,
  token,
  usingTokenImage,
  value,
}: SummaryRowInfoRowProps) => {
  return (
    <Grid container>
      <Grid item md={6} sm={6} xs={6} padding={1}>
        <Typography variant="body2" color="text.secondary">
          {name}
        </Typography>
      </Grid>
      <Grid item md={6} sm={6} xs={6} padding={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          flexWrap="wrap"
        >
          {usingTokenImage &&
          <Box
            sx={{
              display: "flex",
              marginRight: (theme: Theme) => theme.spacing(2),
            }}
          >
            <Image
              src={
                token.picture
                  ? token.picture
                  : `/tokens/${token.symbol.toLowerCase()}.png`
              } // TODO fix other images than .svgs
              alt={token.symbol}
              width={24}
              height={24}
            />
          </Box>
          }
          <Box mr={1}>
            <Typography variant="body2">{value}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {symbol}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

SummaryRowInfoRow.defaultProps = {
  isVisible: true,
  usingTokenImage: false,
}

type SummaryRowTokenInfoRowProps = {
  name: string;
  token: Token;
  value: BigNumber;
}

const SummaryRowTokenInfoRow = (props: SummaryRowTokenInfoRowProps) => 
  <SummaryRowInfoRow
    {...props}
    isVisible={true}
    usingTokenImage={true}
    symbol={props.token.symbol}
    value={kFormatter(parseFloat(props.value.toFixed(props.token.displayedDecimals)), props.token.displayedDecimals)}
  />

type SummaryBoxProps = {
  tokenId: TokenId;
  isDisabled: boolean;
  onMigrate: (tokenId: SupportedLpToken) => void;
} & BoxProps;

const SummaryRow = ({
  tokenId,
  isDisabled,
  onMigrate,
  ...rest
}: SummaryBoxProps) => {
  const general = useAppSelector(selectLpVaultGeneral);
  const relayerGeneral = useAppSelector(selectRelayerVaultGeneral);
  const user = useAppSelector(selectLpVaultUser);
  
  const token = getToken(tokenId);
  const [avgApy] = useState(58);
  const [reward] = useState(58);

  const position = new BigNumber(user[tokenId as SupportedLpToken].deposited || 0);

  const positionFormatted = kFormatter(parseFloat(position.toFixed(token.displayedDecimals)), token.displayedDecimals);

  const share = position
    .div(general[tokenId as SupportedLpToken].tvl)
    .multipliedBy(100)
    .toFixed(2);

  const tvl = new BigNumber(general[tokenId as SupportedLpToken].tvl);

  const fee = useMemo(
    () => {
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
    },
    [relayerGeneral, tokenId]
  );

  return (
    <Box
      sx={{
        border: (theme: Theme) =>
          `1px solid ${alpha(
            theme.palette.text.primary,
            theme.opacity.lighter
          )}`,
        borderRadius: 1,
        padding: (theme: Theme) => theme.spacing(8, 8),
      }}
      {...rest}
    >
      <Grid container spacing={8}>
        <Grid item md={6} sm={12} xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Box padding={1}>
                <Typography variant="body2" color="text.secondary">
                  Average APY
                </Typography>
              </Box>
              <Box padding={1}>
                <Typography variant="h5">{avgApy}%</Typography>
              </Box>
            </Grid>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Box padding={1}>
                <Typography variant="body2" color="text.secondary">
                  Your rewards
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                padding={1}
                flexWrap="wrap"
              >
                <Box mr={1} display="flex">
                  <Image
                    src={
                      token.picture
                        ? token.picture
                        : `/tokens/${token.symbol.toLowerCase()}.png`
                    }
                    alt={token.symbol}
                    width={24}
                    height={24}
                  />
                </Box>

                <Typography variant="h5" mr={1}>
                  {reward}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  LAYR
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="small"
              sx={{ py: 1 }}
              disabled={isDisabled}
              onClick={() => onMigrate(tokenId as SupportedLpToken)}
            >
              {allowedToMigrateTokenSymbols.includes(token.symbol) ? "Migrate" : "Withdraw"}
            </Button>
          </Box>
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <SummaryRowInfoRow
            name="Position"
            token={token}
            value={positionFormatted}
            symbol={token.symbol}
            usingTokenImage={true}
          />

          <SummaryRowInfoRow
            name="Pool share"
            token={token}
            value={share}
            symbol="%"
          />

          <SummaryRowTokenInfoRow
            name="TVL"
            token={token}
            value={tvl}
          />

          <SummaryRowTokenInfoRow
            name="Total fees"
            token={token}
            value={fee}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryRow;

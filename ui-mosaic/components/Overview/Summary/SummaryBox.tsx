import Image from "next/image";
import { useState } from "react";
import { Box, Grid, Theme, Typography, BoxProps, alpha } from "@mui/material";

import { getToken, TokenId } from "defi/tokenInfo";
import Button from "components/Button";

type SummaryBoxProps = {
  tokenId: TokenId;
  isDisabled: boolean;
  onMigrate: () => void;
} & BoxProps;

const SummaryRow = ({
  tokenId,
  isDisabled,
  onMigrate,
  ...rest
}: SummaryBoxProps) => {
  const token = getToken(tokenId);
  const [avgApy] = useState(58);
  const [reward] = useState(58);
  const [position] = useState(10.03);
  const [share] = useState(0.0);
  const [tvl] = useState(10.03);
  const [fee] = useState(10.03);

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
              onClick={onMigrate}
            >
              Migrate
            </Button>
          </Box>
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <Grid container>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Typography variant="body2" color="text.secondary">
                Position
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                flexWrap="wrap"
              >
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
                <Box mr={1}>
                  <Typography variant="body2">{position}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {token.symbol}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Typography variant="body2" color="text.secondary">
                Pool share
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                flexWrap="wrap"
              >
                <Box mr={1}>
                  <Typography variant="body2">{share}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    %
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Typography variant="body2" color="text.secondary">
                TVL
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                flexWrap="wrap"
              >
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
                <Box mr={1}>
                  <Typography variant="body2">{tvl}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {token.symbol}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Typography variant="body2" color="text.secondary">
                Total fees
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={6} padding={1}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                flexWrap="wrap"
              >
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
                <Box mr={1}>
                  <Typography variant="body2">{fee}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {token.symbol}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryRow;

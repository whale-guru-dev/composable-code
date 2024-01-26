import Image from "next/image";
import { useMemo } from "react";
import { Box, Grid, Theme, Typography, BoxProps, alpha, CircularProgress } from "@mui/material";
import SummaryCell from "./SummaryCell";
import { SupportedNetwork, TestSupportedNetworkId, TEST_SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";
import { ByChainInfo } from "@/phase2/api";

export type OverwiewChainDataType = 'volume' | 'txCount'

export interface ByChainInfoExtended extends ByChainInfo {
  isLoading: boolean;
}

type SummaryRowProps = {
  chainId: TestSupportedNetworkId;
  dataType: OverwiewChainDataType;
  data?: ByChainInfoExtended;
} & BoxProps;

const SummaryRow = ({
  chainId,
  dataType,
  data,
  ...rest
}: SummaryRowProps) => {
  const network : SupportedNetwork | undefined = TEST_SUPPORTED_NETWORKS[chainId];

  const value = useMemo(
    () => data?.[dataType] || '-',
    [dataType, data]
  )

  const label = useMemo(
    () => dataType === 'volume' ? 'volume' : 'transaction count',
    [dataType]
  )

  const unit = useMemo(
    () => dataType === 'volume' && data?.[dataType] && ' $' || '',
    [dataType, data]
  )

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
      }}
      {...rest}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  marginRight: (theme: Theme) => theme.spacing(2),
                }}
              >
                <Image
                  src={getChainIconURL(chainId)} // TODO fix other images than .svgs
                  alt={network?.name}
                  width={24}
                  height={24}
                />
              </Box>
              <Box>
                <Typography variant="body2">
                  {network?.name == "Mainnet" ? "Ethereum" : network?.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCell label={`Total ${label}:`}>
            {data?.isLoading &&
            <CircularProgress size={16} />
            ||
            <Typography variant="body2">{value}{unit}</Typography>
            }
          </SummaryCell>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryRow;

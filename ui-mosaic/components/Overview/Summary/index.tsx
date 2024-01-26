import { Box, Grid, Typography, BoxProps } from "@mui/material";

import SummaryRow, { OverwiewChainDataType } from "./SummaryRow";
import SummaryHeader from "./SummaryHeader";
import useMobile from "@/hooks/useMobile";
import { TestSupportedNetworkId, testSupportedNetworksIds } from "@/submodules/contracts-operations/src/defi/constants";
import { VolumeData } from "..";

type SummaryProps = {
  title: string;
  dataType: OverwiewChainDataType;
  data: VolumeData;
} & BoxProps;

const Summary = ({
  title,
  dataType,
  data,
  ...rest
}: SummaryProps) => {
  const isMobile = useMobile("sm");

  return (
    <Box {...rest}>
      <Box mb={6}>
        <Typography variant="h6" align="center">
          {title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {!isMobile && (
          <Grid item xs={12} md={12}>
            <SummaryHeader dataType={dataType} />
          </Grid>
        )}

        {testSupportedNetworksIds.map((chainId: TestSupportedNetworkId, index: number) => (
          <Grid key={index} item xs={12} md={12}>
            {<SummaryRow dataType={dataType} chainId={chainId} data={data['bridge-volume']?.all?.[chainId]}/>}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Summary;

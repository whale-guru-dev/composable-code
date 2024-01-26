import React, { useMemo } from "react";
import { Box, Grid, Typography, BoxProps, Theme } from "@mui/material";
import { OverwiewChainDataType } from "./SummaryRow";

type SummaryHeaderProps = {
  dataType: OverwiewChainDataType;
} & BoxProps;

const BridgeHeader = ({
  dataType,
  ...rest
}: SummaryHeaderProps) => {
  const label = useMemo(
    () => dataType === 'volume' ? 'volume' : 'transaction count',
    [dataType]
  )

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: (theme: Theme) => theme.spacing(0, 3),
      }}
      {...rest}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md>
          <Typography variant="body2" color="text.secondary">
            Chain
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
            Total {label}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BridgeHeader;

import React from 'react';
import {
  Box,
  Grid,
  Typography,
  BoxProps,
  Theme
} from '@mui/material';

const PositionHeader = ({...rest}: BoxProps) => {

  return (
    <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: (theme: Theme) => theme.spacing(0, 3)
            }}
            {...rest}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary">Asset</Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary">APY</Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary">TVL</Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary">Pool share</Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary">Deposited</Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary">Earned Fees</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PositionHeader

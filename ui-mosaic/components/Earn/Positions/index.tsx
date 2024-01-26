import {
  Box,
  Grid,
  Typography,
  BoxProps,
  Theme,
} from "@mui/material";

import useMobile from "@/hooks/useMobile";
import PositionHeader from "./PositionHeader";
import PositionDetails from "../PositionDetails";
import { CrossChainId } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { CrossChainTokensDetailsContext, TokenInfoPerChains } from "@/phase2/components/CrossChainTokenDetails";
import { useContext } from "react";

const Positions = ({ ...rest }: BoxProps) => {
  const { tokensInfo } = useContext(CrossChainTokensDetailsContext);
  
  const isMobile = useMobile('sm');

  console.log("IKO parent Positions", tokensInfo)

  return (
    <Box sx={{
              backgroundColor: (theme: Theme) => theme.palette.other.background.n4,
              borderRadius: 1,
              padding: (theme: Theme) => theme.spacing(4),
            }}
          {...rest}>
      <Box mb={6}>
        <Typography variant="h6" align="center">Your Positions</Typography>
      </Box>

      <Grid container spacing={3}>
        {!isMobile && <Grid item xs={12} md={12}>
          <PositionHeader />
        </Grid>}

        {Object.entries(tokensInfo).map(([crossChainId, tokenInfo]: [CrossChainId, TokenInfoPerChains], index: number) => (
        <Grid key={index} item xs={12} md={12}>
          <PositionDetails variant="row" crossChainId={crossChainId} tokenInfo={tokenInfo} />
        </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Positions;

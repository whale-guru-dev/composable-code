import {
  Box,
  Grid,
  Typography,
  BoxProps
} from "@mui/material";

import SummaryRow from "./SummaryRow";
import SummaryHeader from "./SummaryHeader";
import useMobile from "@/hooks/useMobile";
import { CrossChainId } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { CrossChainTokensDetailsContext, TokenInfoPerChains } from "@/phase2/components/CrossChainTokenDetails";
import { useContext } from "react";

const Summary = ({ ...rest }: BoxProps) => {
  const { tokensInfo } = useContext(CrossChainTokensDetailsContext);

  const isMobile = useMobile('sm');

  return (
    <Box {...rest}>
      <Box mb={6}>
        <Typography variant="h6" align="center">Vaults</Typography>
      </Box>

      <Grid container spacing={3}>
        {!isMobile && <Grid item xs={12} md={12}>
          <SummaryHeader />
        </Grid>}

        {Object.entries(tokensInfo).map(([crossChainId, tokenInfo]: [CrossChainId, TokenInfoPerChains], index: number) => (
          <Grid key={index} item xs={12} md={12}>
            {
              <SummaryRow crossChainId={crossChainId} tokenInfo={tokenInfo} />
            }
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Summary;

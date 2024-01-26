import React from "react";
import { Details } from "./Details";
import { Box, Typography } from "@mui/material";
import CrossLayerTokenFlow from "@/components/CrossLayerFlow/Flows/CrossLayerTokenFlow";
import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";

const TransactionDetails = (tx: Transaction) => {
  const showTransactionPath = ['liquidity-withdrawal', 'token', 'nft'].includes(tx.type);

  return (
    <Box mb={12}>
      <Details tx={tx} />

      {showTransactionPath &&
      <React.Fragment>
        <Typography variant="caption"
                    color="text.secondary"
                    component="div"
                    mt={3}
                    textAlign="center"
        >
          *This transaction will last 2 hours or it will be reverted
        </Typography>

        <Typography variant="h6"
                    textAlign="center"
                    mt={9}
                    mb={6}
        >
          Transaction Path
        </Typography>

        <CrossLayerTokenFlow tx={tx} />
      </React.Fragment>
      }
    </Box>
  );
};

export default TransactionDetails;

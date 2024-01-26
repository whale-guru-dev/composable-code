import React, { useState } from "react";
import { Grid, Box, Typography, Theme } from "@mui/material";
import DotAccountSelector from "./DotAccountSelector";
import { polkadot } from "@/assets/wallets";
import { Dialog } from "@/components/PreReview/Dialog";
import Image from "next/image";

export type ConnectorSelectionProps = {
  isOpen: boolean;
  onClose: () => void;
  setAccount: (account: string) => void;
};

const ConnectorSelection = ({
  isOpen,
  onClose,
  setAccount,
}: ConnectorSelectionProps) => {
  const [dotAccountOpen, setDotAccountOpen] = useState(false);
  return (
    <>
      <Dialog open={isOpen && !dotAccountOpen} onClose={onClose}>
        <Box margin="auto" maxWidth={500} width="100%">
          <Grid container direction="column">
            <Typography variant="h5" textAlign="center">
              Connect wallet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mt={5}
              mb={8}
              textAlign="center"
            >
              Select a wallet to connect with.
            </Typography>
            <Grid
              item
              sx={{
                border: (theme: Theme) =>
                  `1px solid ${theme.palette.primary.main}`,
                borderRadius: 1,
                marginBottom: "20px",
                transition: "all 0.3s",
                opacity: 0.8,
                "&:hover": {
                  background: (theme: Theme) => theme.palette.primary.light,
                },
              }}
            >
              <Box
                onClick={() => setDotAccountOpen(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: (theme: Theme) => theme.spacing(1.875, 5),
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <Image src={polkadot} alt={"polkadot"} width="24" height="24" />
                <Box textAlign="center" width="100%">
                  <Typography variant="body2">Polkadot .js</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      <DotAccountSelector
        isOpen={isOpen && dotAccountOpen}
        onClose={() => setDotAccountOpen(false)}
        setAccount={setAccount}
      />
    </>
  );
};

export default ConnectorSelection;

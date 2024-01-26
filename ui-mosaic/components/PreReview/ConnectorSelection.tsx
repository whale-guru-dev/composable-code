import React, { useEffect } from "react";
import { Grid, Box, Typography, Theme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useWalletConnectModalModal } from "store/appsettings/hooks";
import { Dialog } from "./Dialog";
import Image from "next/image";
import { useConnector } from "@integrations-lib/core";
import { metamask } from "@/assets/wallets";

export const ConnectorSelection = () => {
  const { isOpen, closeWalletConnect } = useWalletConnectModalModal();

  const { activate, isActive, isActivating } = useConnector('metamask');

  const activating = isActivating;
  const connected = isActive;
  const disabled = !!isActivating || connected;

  useEffect(
    () => {
      if (isActive) {
        closeWalletConnect();
      }
    },
    [closeWalletConnect, isActive]
  )

  return (
    <Dialog open={isOpen} onClose={() => closeWalletConnect()}>
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
              opacity: disabled ? 1 : 0.8,
              "&:hover": {
                background: (theme: Theme) =>
                  disabled ? undefined : theme.palette.primary.light,
              },
            }}
          >
            <Box
              onClick={
                !disabled
                  ? () => {
                      activate();
                    }
                  : undefined
              }
              sx={{
                display: "flex",
                alignItems: "center",
                padding: (theme: Theme) => theme.spacing(1.875, 5),
                textAlign: "center",
                cursor: !disabled ? "pointer" : undefined,
              }}
            >
              <Image src={metamask} alt={"Metamask"} width="24" height="24" />
              <Box textAlign="center" width="100%">
                {activating ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  <Typography variant="body2">Metamask</Typography>
                )}{" "}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

import { useConnector } from "@integrations-lib/core";
import { Box, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

import { Dialog } from "../PreReview/Dialog";

export type AccountEVMDetailProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AccountEVMDetail = ({ isOpen, onClose }: AccountEVMDetailProps) => {
  const { account, deactivate } = useConnector('metamask');

  const theme = useTheme();
  const onDisconnect = () => {
    deactivate();
    onClose();
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: 600,
        },
      }}
      sx={{
        backdropFilter: "blur(13px)",
        backgroundColor: "other.background.n6",
      }}
    >
      <Box>
        <Typography variant="h5" textAlign={"center"}>
          Account details
        </Typography>
        <Box mb={5} />
        <Box
          sx={{
            background: alpha(
              theme.palette.background.default,
              theme.opacity.lighter
            ),
            border: 1,
            borderRadius: 1,
            padding: 1.625,
            textAlign: "center",
            borderColor: alpha(
              theme.palette.background.default,
              theme.opacity.lighter
            ),
          }}
        >
          {account}
        </Box>
        <Box mb={5} />
        <Box
          onClick={onDisconnect}
          sx={{
            cursor: "pointer",
            textAlign: "center",
            color: theme.palette.primary.main,
            fontWeight: 500,
          }}
        >
          Disconnect wallet
        </Box>
      </Box>
    </Dialog>
  );
};

export default AccountEVMDetail;

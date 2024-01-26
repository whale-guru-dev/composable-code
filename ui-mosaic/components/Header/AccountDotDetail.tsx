import { Box, Typography, alpha } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { polkaccount } from "@/assets/wallets";
import { check as CheckIcon } from "@/assets/icons/common";
import dotAccounts from "./dotAccounts.json";
import React from "react";
import Image from "next/image";
import { Dialog } from "../PreReview/Dialog";

export type AccountEVMDetailProps = {
  account: string;
  isOpen: boolean;
  onClose: () => void;
};

const AccountEVMDetail = ({
  isOpen,
  onClose,
  account,
}: AccountEVMDetailProps) => {
  const onDisconnect = () => {
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
          Your accounts
        </Typography>
        <Box mb={5} />
        {dotAccounts.accounts.map((name) => (
          <Box
            sx={{
              border: (theme: Theme) =>
                `1px solid ${theme.palette.primary.main}`,
              borderRadius: 1,
              marginBottom: "20px",
              transition: "all 0.3s",
              background: (theme: Theme) =>
                account == name
                  ? alpha(theme.palette.primary.main, 0.15)
                  : "none",
              opacity: 0.8,
            }}
            key={name}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: (theme: Theme) => theme.spacing(1.875, 5),
                textAlign: "center",
              }}
            >
              <Image
                src={polkaccount}
                alt={"polkadot"}
                width="24"
                height="24"
              />
              <Box textAlign="center" width="100%">
                <Typography variant="body2">{name}</Typography>
              </Box>
              {account === name ? (
                <Image
                  width={24}
                  height={24}
                  src={CheckIcon}
                  alt="check"
                  className="checkImage"
                />
              ) : (
                <Box ml={3} />
              )}
            </Box>
          </Box>
        ))}
        <Box mb={5} />
        <Box
          onClick={onDisconnect}
          sx={{
            cursor: "pointer",
            textAlign: "center",
            color: (theme: Theme) => theme.palette.primary.main,
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

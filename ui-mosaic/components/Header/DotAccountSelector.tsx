import React, { useState } from "react";
import { Grid, Box, Typography, Theme, useTheme, alpha } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { polkaccount } from "@/assets/wallets";
import { check as CheckIcon } from "@/assets/icons/common";
import { Dialog } from "@/components/PreReview/Dialog";
import data from "./dotAccounts.json";
import Image from "next/image";
import Button from "components/Button";

export type DotAccountSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  setAccount: (account: string) => void;
};

const DotAccountSelector = ({
  isOpen,
  onClose,
  setAccount,
}: DotAccountSelectorProps) => {
  const theme = useTheme();
  const [selected, setSelected] = useState("none");
  const onConfirm = () => {
    setAccount(selected);
    onClose();
  };
  return (
    <Dialog open={isOpen}>
      <Box margin="auto" maxWidth={500} width="100%">
        <Grid container direction="column">
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ width: "fit-content", position: "relative", mx: "auto" }}
          >
            <ChevronLeftIcon
              sx={{
                position: "absolute",
                left: -35,
                cursor: "pointer",
                top: 8,
                [theme.breakpoints.down("md")]: {
                  top: 3,
                },
              }}
              htmlColor={theme.palette.primary.main}
              onClick={onClose}
            />
            Choose an account
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mt={5}
            mb={8}
            textAlign="center"
          >
            Choose an account to connect with.
          </Typography>
          {data.accounts.map((name) => (
            <Grid
              item
              sx={{
                border: (theme: Theme) =>
                  `1px solid ${theme.palette.primary.main}`,
                borderRadius: 1,
                marginBottom: "20px",
                transition: "all 0.3s",
                background: (theme: Theme) =>
                  selected == name
                    ? alpha(theme.palette.primary.main, 0.15)
                    : "none",
                opacity: 0.8,
                "&:hover": {
                  background: (theme: Theme) =>
                    alpha(theme.palette.primary.main, 0.15),
                },
              }}
              key={name}
            >
              <Box
                onClick={() => setSelected(name)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: (theme: Theme) => theme.spacing(1.875, 5),
                  textAlign: "center",
                  cursor: "pointer",
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
                {selected === name ? (
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
            </Grid>
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="medium"
            sx={{ px: 3, py: 2 }}
            disabled={selected == "none"}
            onClick={onConfirm}
          >
            Confirm account
          </Button>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default DotAccountSelector;

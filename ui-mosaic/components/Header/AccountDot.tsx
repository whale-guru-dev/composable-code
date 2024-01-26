import Image from "next/image";
import { useState } from "react";
import { Box, Typography, alpha } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

import { dotsama, polkaccount } from "@/assets/wallets";
import AccountDotDetail from "./AccountDotDetail";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(1.5, 2),
      minWidth: 240,
      borderRadius: "10px",
      cursor: "pointer",
      height: 50,
      "&:hover": {
        opacity: 0.8,
      },
    },
    message: {
      color: theme.palette.text.primary,
      textAlign: "center",
      width: "100%",
    },
    icon: {
      display: "flex",
      alignItems: "center",
      height: 25,
      width: 25,
      cursor: "pointer",
      marginRight: 5,
    },
    exit: {
      display: "flex",
      alignItems: "center",
      height: 50,
      width: 50,
      cursor: "pointer",
      marginLeft: theme.spacing(2),
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "8px",
      justifyContent: "space-around",
      "&:hover": {
        opacity: 0.8,
      },
    },
  })
);

export type AccountDotProps = {
  className?: string;
  account: string;
  onClick?: () => void;
};

const AccountDot = ({ className, account, onClick }: AccountDotProps) => {
  const classes = useStyles();
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  return (
    <>
      <Box display="flex">
        <Box
          className={`${classes.root} ${className}`}
          onClick={
            account == "none" ? onClick : () => setAccountModalOpen(true)
          }
          sx={{
            border: (theme: Theme) =>
              account != "none"
                ? "none"
                : `1px solid ${theme.palette.primary.main}`,
            backgroundColor: (theme: Theme) =>
              account == "none"
                ? "transparent"
                : alpha(theme.palette.primary.main, 0.15),
          }}
        >
          <div className={classes.icon}>
            <Image
              src={account != "none" ? polkaccount : dotsama}
              alt="Dot connect"
              width="24"
              height="24"
            />
          </div>
          <Typography className={classes.message}>
            {account != "none" ? account : "Connect DotSama"}
          </Typography>
        </Box>
      </Box>
      <AccountDotDetail
        isOpen={accountModalOpen}
        account={account}
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
};

AccountDot.defaultProps = {
  className: "",
};

export default AccountDot;

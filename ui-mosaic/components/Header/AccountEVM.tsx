import Image from "next/image";
import { useState } from "react";
import { Box, Typography, alpha } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

import { isValidNetwork } from "defi";
import { NETWORKS } from "defi/networks";
import { SupportedNetworks } from "defi/types";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import { ethConnect } from "@/assets/wallets";
import AccountEVMDetail from "./AccountEVMDetail";
import { useConnector } from "@integrations-lib/core";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";

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

export type AccountProps = {
  className?: string;
  account?: string;
  message?: string;
  onClick?: () => void;
  chainId?: SupportedNetworks;
};

const Account = ({
  className,
  account,
  message,
  onClick,
  chainId,
}: AccountProps) => {
  const classes = useStyles();
  const network = chainId && account ? NETWORKS[chainId] : undefined;
  const { isActive } = useConnector('metamask');
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  return (
    <>
      <Box display="flex">
        <Box
          className={`${classes.root} ${className}`}
          onClick={!account ? onClick : () => setAccountModalOpen(true)}
          sx={{
            border: (theme: Theme) =>
              account ? "none" : `1px solid ${theme.palette.primary.main}`,
            backgroundColor: (theme: Theme) =>
              !account
                ? "transparent"
                : alpha(theme.palette.primary.main, 0.15),
          }}
        >
          {account && chainId && (
            <div className={classes.icon}>
              {account && network && chainId ? (
                <Image
                  src={getChainIconURL(chainId)}
                  alt={network.name}
                  width="24"
                  height="24"
                />
              ) : (
                <Brightness1Icon
                  style={{
                    color:
                    isActive && account && isValidNetwork(chainId)
                        ? "#61BC70"
                        : (isActive && !account) || !isValidNetwork(chainId)
                        ? "#FDD835"
                        : "#ff6666",
                    display: !isActive || !account ? "none" : "flex",
                  }}
                />
              )}
            </div>
          )}
          {!account && (
            <div className={classes.icon}>
              <Image
                src={ethConnect}
                alt="EVM connect"
                width="24"
                height="24"
              />
            </div>
          )}
          <Typography className={classes.message}>{message}</Typography>
        </Box>
      </Box>
      <AccountEVMDetail
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
};

Account.defaultProps = {
  className: "",
};

export default Account;

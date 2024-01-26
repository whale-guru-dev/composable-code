import { useState } from "react";
import Image from "next/image";
import { AppBar, Box, Breadcrumbs, Toolbar, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import AccountEVM from "@/components/Header/AccountEVM";
import AccountDot from "@/components/Header/AccountDot";
import { SupportedNetworks } from "defi/types";
import useMobile from "hooks/useMobile";
import { useWalletConnectModalModal } from "store/appsettings/hooks";
import useStyles from "./style";
import DotConnectorSelection from "./DotConnectorSelection";
import { useSidebar } from "@/contexts/SidebarProvider";
import { MENU_ITEMS } from "../Sidebar/types";
import { useConnector } from "@integrations-lib/core";
import TransactionSettings from "../Transfer/TransactionSettings";
import SettingsBtn from "../SettingsButton";
import { Link } from "@/components/Link";

const Header = () => {
  const classes = useStyles();
  const isMobile = useMobile("sm");
  const { subPage, activeItem } = useSidebar();

  const activeMenuItem = MENU_ITEMS.find((item) => item.name == activeItem);

  // TODO add account to useConnector once implemented
  const { account, chainId } = useConnector("metamask");

  const { openWalletConnect } = useWalletConnectModalModal();
  const [dotSelectorOpen, setDotSelectorOpen] = useState(false);
  const [dotAccount, setDotAccount] = useState("none");

  const [settingModalOpen, setSettingModalOpen] = useState(false);

  const getMessage = () => {
    // TODO notify user about the error
    if (!account) {
      return "Connect EVM";
    } else {
      if (chainId) {
        return `${account.substring(0, 6)}...${account.substring(
          account.length - 4
        )}`;
      } else {
        return "Unsupported network";
      }
    }
  };

  return (
    <AppBar position="sticky" className={classes.root}>
      <Toolbar
        className={classes.toolbar}
        sx={{ justifyContent: !!subPage ? "space-between" : "flex-end" }}
      >
        {isMobile && (
          <Image
            src="/logo-mobile.svg"
            width="32"
            height="32"
            alt="Mosaic"
            className={classes.logo}
          />
        )}
        {!!subPage && !!activeMenuItem?.path && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link href={activeMenuItem.path}>{activeMenuItem?.text}</Link>
            <Typography color="text.secondary">{subPage}</Typography>,
          </Breadcrumbs>
        )}
        <Box className={classes.account} gap={2}>
          <SettingsBtn setSettingModalOpen={setSettingModalOpen} />
          <AccountDot
            account={dotAccount}
            onClick={() => setDotSelectorOpen(true)}
          />
          <AccountEVM
            account={account === null ? undefined : account}
            message={getMessage()}
            onClick={() => openWalletConnect()}
            chainId={
              chainId === null ? undefined : (chainId as SupportedNetworks)
            }
          />
        </Box>
        <TransactionSettings
          isOpen={settingModalOpen}
          onClose={() => setSettingModalOpen(false)}
          onSave={() => {
            setSettingModalOpen(false);
          }}
          onDiscard={() => {
            setSettingModalOpen(false);
          }}
        />
        <DotConnectorSelection
          isOpen={dotSelectorOpen}
          onClose={() => setDotSelectorOpen(false)}
          setAccount={setDotAccount}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

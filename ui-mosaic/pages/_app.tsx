import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";
import { store, useAppDispatch } from "store";

import BlockchainUpdater from "store/blockchain/updater";
import TransactionUpdater from "store/tranasctions/updater";
import UserDataUpdater from "store/userdata/updater";
import LpVaultUpdater from "store/lpVault/updater";
import RelayerVaultUpdater from "store/relayerVault/updater";
import RelayerTransfersUpdater from "store/relayerTransfers/updater";
import NftRelayerTransfersUpdater from "store/nftRelayerTransfers/updater";
import CrowdloanUpdater from "store/stablesInvestor/accountsUpdater";
import { Provider } from "react-redux";
import ContractsContextProvider from "defi/ContractsContext";
import { ConnectorSelection } from "components/PreReview/ConnectorSelection";
import { NotificationWrapper } from "components/PreReview/notification/NotificationWrapper";
import "../theme/pulastingCircle.css";
import Layout from "container/Layout";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  NFT_RELAYER_SUPPORTED_NETWORKS,
  RELAYER_SUPPORTED_NETWORKS,
} from "@/constants";
import { SupportedNetworks } from "@/defi/types";
import SidebarProvider from "@/contexts/SidebarProvider";
import { Chain } from "@integrations-lib/core";
import { SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { contractAddresses } from "@/phase2/constants";
import { NetworkTokenOperationsProvider } from "@/submodules/contracts-operations/src";

declare module "@mui/material/styles" {
  interface DefaultTheme extends Theme {}
}

function Updaters() {
  return (
    <>
      {Array.from(
        new Set([
          ...RELAYER_SUPPORTED_NETWORKS,
          ...NFT_RELAYER_SUPPORTED_NETWORKS,
          1,
        ])
      ).map((networkId) => (
        <BlockchainUpdater
          key={networkId}
          chainId={networkId as SupportedNetworks}
        />
      ))}
      <NftRelayerTransfersUpdater />
      <RelayerTransfersUpdater />
      <TransactionUpdater />
      <UserDataUpdater />
      <LpVaultUpdater />
      <RelayerVaultUpdater />
      <CrowdloanUpdater />
    </>
  );
}

const supportedChains = Object.values(SUPPORTED_NETWORKS) as unknown as Chain[];

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  const router = useRouter();

  return (
    <React.Fragment>
      <Head>
        <title>Mosaic | Composable Finance</title>
        <meta name="title" content="Mosaic | Composable Finance" />
        <meta
          name="description"
          content="A cross-Ethereum union transferral system"
        />
        <meta
          name="keywords"
          content="bridge, arbitrum, polygon, ethereum, composable, finance, defi, infrastructure, layer 2"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider store={store}>
            <SidebarProvider>
              <ContractsContextProvider>
                <NetworkTokenOperationsProvider
                  supportedChains={supportedChains}
                  contractAddresses={contractAddresses}
                >
                  <Updaters />

                  <Layout>
                    <motion.div
                      key={router.route}
                      initial="pageInitial"
                      animate="pageAnimate"
                      variants={{
                        pageInitial: {
                          opacity: 0,
                        },
                        pageAnimate: {
                          opacity: 1,
                        },
                      }}
                    >
                      <Component {...pageProps} />
                    </motion.div>
                  </Layout>
                  <ConnectorSelection />
                  <NotificationWrapper />
                </NetworkTokenOperationsProvider>
              </ContractsContextProvider>
            </SidebarProvider>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </React.Fragment>
  );
}

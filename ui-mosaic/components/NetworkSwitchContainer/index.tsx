import Image from "next/image";
import { Box, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { getNetworkName, isValidNetwork } from "defi";
import { SupportedNetworks } from "defi/types";
import { NETWORKS } from "defi/networks";
import { useWalletConnectModalModal } from "store/appsettings/hooks";
import Button from "components/Button";
import NetworkButton from "components/NetworkButton";
import { Heading } from "../Heading";
import {
  useBlockchainProvider,
  useConnector,
} from "@integrations-lib/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: "100px",
    display: "flex",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: theme.palette.other.background.n3,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-80px",
  },
  button: {
    padding: theme.spacing(1.875, 18.125),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1.875),
      width: "100%",
    },
  },
  image: {
    mixBlendMode: "luminosity",
  },
}));

const NetworkSwitchContainer = ({
  supportedNetwork,
}: {
  supportedNetwork: SupportedNetworks;
}) => {
  const classes = useStyles();

  const { isActive: active, chainId } = useConnector('metamask');
  const { account } = useBlockchainProvider(chainId);
  const { openWalletConnect } = useWalletConnectModalModal();

  const getMessage = () => {
    if (!active) {
      return "error";
    } else {
      if (chainId && chainId !== supportedNetwork) {
        return `Switch to ${getNetworkName(supportedNetwork)}`;
      }
      if (!account) {
        return "connect wallet";
      } else {
        if (chainId && isValidNetwork(chainId)) {
          return `${account.substring(0, 6)}...${account.substring(
            account.length - 4
          )}`;
        } else {
          return "wrong network";
        }
      }
    }
  };

  const onChangeNetwork = async () => {
    if (chainId !== supportedNetwork) {
      const ethereum = (window as any).ethereum;
      ethereum.removeAllListeners(["networkChanged"]);
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${supportedNetwork.toString(16)}`,
            },
          ],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${supportedNetwork.toString(16)}`,
                  chainName: NETWORKS[supportedNetwork].name,
                  nativeCurrency: {
                    name: NETWORKS[supportedNetwork].defaultTokenSymbol,
                    symbol: NETWORKS[supportedNetwork].defaultTokenSymbol,
                    decimals: 18,
                  },
                  rpcUrls: [NETWORKS[supportedNetwork].publicRpcUrl],
                  blockExplorerUrls: [
                    NETWORKS[supportedNetwork].infoPageUrl.slice(0, -3),
                  ],
                },
              ],
            });
          } catch (addError) {
            console.error("err", addError);
            // handle "add" error
          }
        }
        console.error("err", switchError);
        // handle other "switch" errors
      }
    }
  };

  return !account || chainId !== supportedNetwork ? (
    <Box className={classes.root}>
      <Box className={classes.wrapper}>
        <Image
          src="/images/connect.png"
          width={320}
          height={320}
          className={classes.image}
          alt="connect wallet"
        />
        <Box mb={9} />
        <Heading
          title={!account ? "Connect wallet" : "Switch network"}
          subTitle="To transfer your NFTs across multiple networks wallet needs to be connected."
        />
        <Box mb={4} />
        {account && chainId && chainId !== supportedNetwork && (
          <NetworkButton
            network={NETWORKS[supportedNetwork]}
            onClick={
              chainId && chainId !== supportedNetwork
                ? () => onChangeNetwork()
                : !account
                ? () => openWalletConnect()
                : undefined
            }
            text={getMessage()}
            style={{ minWidth: 250 }}
          />
        )}
        {!account && (
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            className={classes.button}
            onClick={!account ? () => openWalletConnect() : undefined}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
    </Box>
  ) : null;
};

export default NetworkSwitchContainer;

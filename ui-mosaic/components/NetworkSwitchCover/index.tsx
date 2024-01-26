import { Box } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Button from "components/Button";
import { getNetworkName, isValidNetwork } from "defi";
import { SupportedNetworks } from "defi/types";
import NetworkButton from "components/NetworkButton";
import { NETWORKS } from "defi/networks";
import { useWalletConnectModalModal } from "store/appsettings/hooks";
import { useConnector } from "@integrations-lib/core";

const useStyles = makeStyles(() => ({
  connectWallet: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    justifyContent: "center",
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(46, 4, 32, 0.9)",
    backdropFilter: "blur(2px)",
    alignItems: "center",
    borderRadius: 10,
  },
}));

const NetworkSwitchCover = ({
  supportedNetwork,
}: {
  supportedNetwork: SupportedNetworks;
}) => {
  const classes = useStyles();

  const { isActive, account, chainId } = useConnector("metamask");
  const { openWalletConnect } = useWalletConnectModalModal();

  const getMessage = () => {
    if (!isActive) {
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
    <Box className={classes.connectWallet}>
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
          isExpandMore
          style={{ minWidth: 250 }}
        />
      )}
      {!account && (
        <Button
          variant="outlined"
          color="primary"
          style={{ padding: "7px 21px" }}
          onClick={!account ? () => openWalletConnect() : undefined}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  ) : null;
};

export default NetworkSwitchCover;

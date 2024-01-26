import { useEffect, useState } from "react";
import { Theme, Box, CircularProgress, Typography, Grid } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Heading } from "components/Heading";
import NetworkSelector from "../NetworkSelector";
import {
  NFT_RELAYER_SUPPORTED_NETWORKS,
  SupportedNftRelayerNetwork,
} from "@/constants";
import NftCard from "./NftCard";
import NetworkSwitchContainer from "../NetworkSwitchContainer";
import { useNft } from "./nft-hook";
import NftTransfer from "./Transfer";
import theme from "@/theme";
import { NftType } from "./types";
import ClearIcon from "@mui/icons-material/Clear";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 1024,
      margin: "auto",
      [theme.breakpoints.down("xl")]: {
        maxWidth: 672,
      },
    },
    wrapper: {
      margin: theme.spacing(6, 0),
    },
    selector: {
      maxWidth: 770,
      margin: "auto",
    },
    cardsWrapper: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
  })
);

const Nfts = () => {
  const classes = useStyles();

  const { nfts, account, chainId, status } = useNft();

  const [transferNft, setTransferNft] = useState<NftType>();

  const [selectedNetwork, setSelectedNetwork] =
    useState<SupportedNftRelayerNetwork>(NFT_RELAYER_SUPPORTED_NETWORKS[0]);

  useEffect(() => {
    const id = chainId as SupportedNftRelayerNetwork;
    if (NFT_RELAYER_SUPPORTED_NETWORKS.includes(id)) {
      setSelectedNetwork(id);
    }
  }, [chainId]);

  return account && chainId === selectedNetwork ? (
    transferNft ? (
      <NftTransfer
        item={transferNft}
        handleBack={() => setTransferNft(undefined)}
      />
    ) : (
      <div className={classes.root}>
        <Heading title="Mural" subTitle="Cross-Layer NFTs" />
        <Box className={classes.wrapper}>
          <Box className={classes.selector}>
            <NetworkSelector
              networks={NFT_RELAYER_SUPPORTED_NETWORKS}
              selected={selectedNetwork}
              onChange={(n) =>
                setSelectedNetwork(n as SupportedNftRelayerNetwork)
              }
            />
          </Box>
          {status !== "ready" ? (
            <Box sx={{ padding: theme.spacing(6), textAlign: "center" }}>
              {status !== "failed" ? (
                <CircularProgress color="inherit" size={50} />
              ) : (
                <ClearIcon color="inherit" sx={{ fontSize: 50 }} />
              )}
              <Typography variant="h5" style={{ marginTop: 16 }}>
                {status === "failed"
                  ? "Failed to retrieve NFTs. Please try again later."
                  : "Loading your NFTs"}{" "}
                {status === "retrying" ? `(Retrying...)` : null}
              </Typography>
            </Box>
          ) : null}
          {status === "ready" && !nfts.length ? (
            <Box sx={{ padding: theme.spacing(6), textAlign: "center" }}>
              <Typography variant="h5" style={{ marginTop: 16 }}>
                {`You don't have any NFTs on this network`}
              </Typography>
            </Box>
          ) : null}
          <Box mt={6} className={classes.cardsWrapper}>
            <Grid container spacing={4}>
              {nfts.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={item.id}>
                  <NftCard
                    item={item}
                    handleTransfer={(nft) => setTransferNft(nft)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </div>
    )
  ) : (
    <NetworkSwitchContainer supportedNetwork={selectedNetwork} />
  );
};

export default Nfts;

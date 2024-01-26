import React, { useState, useContext, useEffect } from "react";
import { Theme, Box, Typography, Grid, IconButton } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Heading } from "components/Heading";
import NftCard from "../NftCard";
import NetworkSwitchContainer from "../../NetworkSwitchContainer";
import { NftTransferProps, NftType } from "../types";
import {
  NFT_RELAYER_SUPPORTED_NETWORKS,
  SupportedNftRelayerNetwork,
} from "@/constants";
import NetworkSelectorDropdown from "../../NetworkSelectorDropdown";
import Button from "../../Button";
import AccordionInput from "../../AccordionInput";
import FeeSelectorDrowdown from "@/components/FeeSelectorDrowdown";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useConfirmationModal } from "@/store/appsettings/hooks";
import { ContractsContext } from "@/defi/ContractsContext";
import {
  ContractAddresses,
  ERC20Addresses,
  getContractAddressIDByChainIdAndAddress,
} from "@/defi/addresses";
import { NETWORKS } from "@/defi/networks";
import { getToken, TokenId } from "@/defi/tokenInfo";
import { useDispatch } from "react-redux";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { useAddresses } from "@/defi/hooks";
import { usePendingTransactions } from "@/hooks/usePendingTransactions";
import { ERC721Service } from "@/defi/contracts/erc721";
import { LoadingButton } from "@mui/lab";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import router from "next/router";
import { useNftFees } from "../nft-hook";
import { formatUnits } from "@ethersproject/units";
import { SupportedNetworks } from "@/defi/types";
import { ERC20Service } from "@/defi/contracts/erc20";
import { toTokenUnitsBN, toBaseUnitBN } from "@/utils";
import PaletteIcon from "@mui/icons-material/Palette";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 1250,
      margin: "auto",
    },
    wrapper: {
      margin: theme.spacing(6, 0),
      display: "flex",
      justifyContent: "space-between",

      [theme.breakpoints.down("lg")]: {
        flexWrap: "wrap",
        justifyContent: "center",
      },
    },
    source: {
      display: "flex",
      justifyContent: "center",
      [theme.breakpoints.down("lg")]: {
        //margin: theme.spacing(1),
      },
      [theme.breakpoints.down("md")]: {
        order: 1,
      },
    },
    target: {
      display: "flex",
      justifyContent: "center",
      [theme.breakpoints.down("md")]: {
        order: 2,
      },
    },
    formWrapper: {
      flexGrow: 1,

      [theme.breakpoints.down("md")]: {
        order: 3,
      },
    },
    link: {
      color: theme.palette.primary.light,
      textDecoration: "none",
    },
  })
);

const NftTransfer = ({ item, handleBack }: NftTransferProps) => {
  const { contracts, account } = useContext(ContractsContext);

  const classes = useStyles();

  const dispatch = useDispatch();
  const addresses = useAddresses();

  const availableNetworks = NFT_RELAYER_SUPPORTED_NETWORKS.filter(
    (x) => x !== item.networkId
  );

  const [targetNetworkId, setTargetNetworkId] =
    useState<SupportedNftRelayerNetwork>(availableNetworks[0]);

  const [destinationAddress, setDestinationAddress] = useState<string>(
    account ?? ethers.constants.AddressZero
  );

  const { feeTokens, isError, isLoading } = useNftFees(item.networkId);

  const getFeeTokens = () => {
    if (isError || isLoading) {
      return [];
    }

    const ft: { amount: string; token: string; remoteNetworkId: string }[] =
      feeTokens.data;
    const filtered = ft.filter(
      (x) => x.remoteNetworkId === targetNetworkId.toFixed()
    );

    const ret = [];

    for (let i = 0; i < filtered.length; i++) {
      const x = filtered[i];

      let tokenId = getContractAddressIDByChainIdAndAddress(
        item.networkId,
        x.token
      );

      if (!tokenId) {
        if (x.token === ethers.constants.AddressZero) {
          tokenId = NETWORKS[item.networkId as SupportedNetworks]
            .nativeToken as ContractAddresses;
        } else {
          continue;
        }
      }

      ret.push({
        address: x.token,
        amount: new BigNumber(
          formatUnits(x.amount, getToken(tokenId as TokenId).decimals)
        ),
        tokenId: tokenId,
      });
    }

    return ret;
  };

  const [expandedTargetAddress, setExpandedTargetAddress] =
    useState<boolean>(false);

  const [selectedFeeToken, setSelectedFeeToken] = useState<TokenId>(
    getFeeTokens().length ? (getFeeTokens()[0].tokenId as TokenId) : "usdc"
  );

  const { openConfirmation, closeConfirmation } = useConfirmationModal();

  const transferNFT = () => {
    const feeToken = getFeeTokens().find(
      (x) => (x.tokenId as TokenId) === selectedFeeToken
    )!;

    let tokenId = getContractAddressIDByChainIdAndAddress(
      item.networkId,
      feeToken.address
    );

    if (!tokenId) {
      if (feeToken.address === ethers.constants.AddressZero) {
        tokenId = NETWORKS[targetNetworkId].nativeToken as ContractAddresses;
      } else {
        return;
      }
    }

    if (contracts) {
      openConfirmation();
      const relayerVault = contracts.nftvault.contract();
      relayerVault
        .depositNft(
          item.address,
          item.tokenId,
          item.uri,
          destinationAddress,
          {
            amount: feeToken.amount,
            tokenId: tokenId as TokenId,
            address: feeToken.address,
          },

          targetNetworkId,
          {
            nftId: mosaicInfo
              ? mosaicInfo.nftId
              : ethers.BigNumber.from(item.tokenId),
            nftAddress: mosaicInfo ? mosaicInfo.address : item.address,
            chainId: mosaicInfo
              ? (mosaicInfo.chainId as SupportedNftRelayerNetwork)
              : item.networkId,
          }
        )
        .then((id) => {
          closeConfirmation();
          //setValue(new BigNumber(0));
          //setValid(false);
          router.push("/tx/" + id);
        })
        .catch((_e) => {
          let message = "";
          dispatch(
            addNotification({
              message:
                message.length === 0
                  ? "Could not submit transaction."
                  : message,
              type: "error",
            })
          );
          closeConfirmation();
        });
    }
  };

  const allow = () => {
    if (contracts) {
      openConfirmation();
      const erc721 = contracts.erc721.contract(item.address);

      erc721
        .approveNft(
          addresses.nftvault,
          ethers.BigNumber.from(item.tokenId),
          "Approve NFT"
        )
        .then(() => {
          closeConfirmation();
        })
        .catch(() => {
          dispatch(
            addNotification({
              message: "Could not submit transaction.",
              type: "error",
            })
          );
          closeConfirmation();
        });
    }
  };

  const allowToken = () => {
    const token = getFeeTokens().find(
      (x) => (x.tokenId as TokenId) === selectedFeeToken
    )!;
    const tokenData = getToken(token.tokenId as TokenId);

    if (contracts) {
      openConfirmation();
      const erc20 = contracts.erc20.contract({
        contract: token.tokenId as ERC20Addresses,
      });

      erc20
        .approve(
          addresses.nftvault,
          ethers.BigNumber.from(
            toBaseUnitBN(
              token.amount.toFixed(tokenData.decimals),
              tokenData.decimals
            ).toFixed()
          ),
          "Approve " + tokenData.symbol
        )
        .then(() => {
          closeConfirmation();
        })
        .catch(() => {
          dispatch(
            addNotification({
              message: "Could not submit transaction.",
              type: "error",
            })
          );
          closeConfirmation();
        });
    }
  };

  const [mosaicInfo, setMosaicInfo] =
    useState<{ address: string; chainId: number; nftId: ethers.BigNumber }>();

  const [isApprovedToken, setIsApprovedToken] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const isPendingApprove = usePendingTransactions(item.address, [
    ERC721Service.prototype.approveNft.name + item.tokenId,
  ]);

  const isPendingApproveToken = usePendingTransactions(
    addresses[selectedFeeToken as ContractAddresses],
    [ERC20Service.prototype.approve.name]
  );

  useEffect(() => {
    if (
      !contracts ||
      isPendingApproveToken ||
      !account ||
      !getFeeTokens().length
    ) {
      return;
    }

    const token = getFeeTokens().find(
      (x) => (x.tokenId as TokenId) === selectedFeeToken
    )!;
    if (!token) {
      return;
    }
    const tokenData = getToken(token.tokenId as TokenId);

    if (token.address === ethers.constants.AddressZero) {
      setIsApprovedToken(true);
      return;
    }
    contracts.erc20
      .contract({ address: token.address })
      .allowance(account, addresses.nftvault)
      .then((amount) => {
        setIsApprovedToken(
          token.amount.lte(
            toTokenUnitsBN(amount.toString(), tokenData.decimals)
          )
        );
      });
  }, [
    contracts,
    isPendingApproveToken,
    selectedFeeToken,
    targetNetworkId,
    getFeeTokens().length,
  ]);

  useEffect(() => {
    if (!contracts || isPendingApprove) {
      return;
    }

    contracts.erc721
      .contract(item.address)
      .getApproved(ethers.BigNumber.from(item.tokenId))
      .then((address) => {
        if (address.toLowerCase() === addresses.nftvault.toLowerCase()) {
          setIsApproved(true);
        }
      });
  }, [contracts, isPendingApprove, item]);

  useEffect(() => {
    if (
      !contracts ||
      item.address.toLowerCase() !== addresses.mosaicnft.toLowerCase()
    ) {
      return;
    }

    contracts.mosaicnft
      .contract()
      .originalNftInfo(ethers.BigNumber.from(item.tokenId))
      .then((x) => {
        if (x[0] === ethers.constants.AddressZero) {
          return;
        }
        setMosaicInfo({ address: x[0], chainId: x[1].toNumber(), nftId: x[2] });
      });
  }, [contracts, item]);

  const destinationNftCard: NftType = {
    ...item,
    networkId: targetNetworkId,
    tokenId:
      mosaicInfo && mosaicInfo.chainId === targetNetworkId
        ? mosaicInfo.nftId.toString()
        : "...",
    address:
      mosaicInfo && mosaicInfo.chainId === targetNetworkId
        ? mosaicInfo.address
        : addresses.mosaicnft,
  };

  const handleChangeNetwork = (selected: SupportedNetworks) => {
    setTargetNetworkId(selected as SupportedNftRelayerNetwork);
  };

  return account ? (
    <div className={classes.root}>
      <IconButton sx={{ position: "absolute" }} onClick={() => handleBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Heading
        title="Transfer NFT"
        subTitle="Transfer your NFTs across multiple networks, including Ethereum L1 and L2s."
      />
      <Box className={classes.wrapper}>
        <Grid container justifyContent="center">
          <Grid item className={classes.source} xs={6} md={3}>
            <NftCard item={item} isStatus />
          </Grid>
          <Grid item className={classes.formWrapper} xs={12} md={6}>
            <Box>
              <NetworkSelectorDropdown
                label="Destination network"
                selected={targetNetworkId}
                networks={availableNetworks}
                onChangeHandler={handleChangeNetwork}
                endLabel={
                  mosaicInfo
                    ? {
                        network: mosaicInfo.chainId as SupportedNetworks,
                        text: "original",
                      }
                    : undefined
                }
              />
              <Box mb={3} />
              <FeeSelectorDrowdown
                selectedFeeTokenIndex={selectedFeeToken}
                feeTokens={getFeeTokens()}
                onChange={(n) => setSelectedFeeToken(n)}
                selectedNetworkId={item.networkId}
              />
              <Box mb={3} />
              <AccordionInput
                value={destinationAddress}
                setValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setDestinationAddress(event.target.value)
                }
                expanded={expandedTargetAddress}
                onChange={() =>
                  setExpandedTargetAddress(!expandedTargetAddress)
                }
              />
              <Box mb={3} />
              <Grid container spacing={2}>
                {!isApprovedToken ? (
                  <Grid item xs={isApproved ? 6 : 4}>
                    <LoadingButton
                      variant="contained"
                      disabled={isPendingApproveToken}
                      fullWidth
                      loadingPosition="start"
                      loading={isPendingApproveToken}
                      startIcon={<MonetizationOnIcon />}
                      onClick={() => allowToken()}
                    >
                      Approve
                    </LoadingButton>
                  </Grid>
                ) : null}

                {!isApproved ? (
                  <Grid item xs={isApprovedToken ? 6 : 4}>
                    <LoadingButton
                      variant="contained"
                      disabled={isPendingApprove}
                      fullWidth
                      loadingPosition="start"
                      loading={isPendingApprove}
                      startIcon={<PaletteIcon />}
                      onClick={() => allow()}
                    >
                      Approve
                    </LoadingButton>
                  </Grid>
                ) : null}

                <Grid
                  item
                  xs={
                    isApproved && isApprovedToken
                      ? 12
                      : isApproved || isApprovedToken
                      ? 6
                      : 4
                  }
                >
                  <Button
                    variant="contained"
                    disabled={
                      !isApproved ||
                      isPendingApprove ||
                      !isApprovedToken ||
                      isPendingApproveToken ||
                      item.networkId === targetNetworkId
                    }
                    fullWidth
                    onClick={() => transferNFT()}
                    startIcon={<SwapHorizIcon fontSize="large" />}
                  >
                    <Typography>Transfer</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item className={classes.target} xs={6} md={3}>
            <NftCard
              item={destinationNftCard}
              isStatus
              noNetwork={item.networkId === targetNetworkId}
              disabled={item.networkId === targetNetworkId}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  ) : (
    <NetworkSwitchContainer supportedNetwork={item.networkId} />
  );
};

export default NftTransfer;

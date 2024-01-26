import { useContext } from "react";
import {
  alpha,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

import Image from "next/image";
import { ExpandMore } from "@mui/icons-material";
import { BigNumber } from "bignumber.js";
import { getToken, TokenId } from "@/defi/tokenInfo";
import {
  ContractAddresses,
  getContractAddressIDByChainIdAndAddress,
} from "@/defi/addresses";
import { SupportedNetworks } from "../../defi/types";
import { NETWORKS } from "@/defi/networks";
import { ethers } from "ethers";
import { useTokenData } from "@/hooks/useTokenData";
import { useAddresses } from "@/defi/hooks";
import { ContractsContext } from "@/defi/ContractsContext";

export type FeeToken = {
  address: string;
  amount: BigNumber;
};

export type NetworkSelectorProps = {
  label?: string;
  feeTokens: FeeToken[];
  selectedFeeTokenIndex: TokenId;
  onChange: (tokenId: TokenId) => any;
  selectedNetworkId: SupportedNetworks;
  disabled?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    network: {
      display: "flex",
      justifyContent: "center",
      paddingTop: theme.spacing(1.75),
      paddingBottom: theme.spacing(1.75),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.dark, theme.opacity.dark),
      },
    },
    select: {
      display: "flex",
      minWidth: "100px",
      justifyContent: "space-around",
      color: theme.palette.text.primary,
      // paddingTop: theme.spacing(1.5),
      // paddingBottom: theme.spacing(1.5),
      paddingRight: `${theme.spacing(1.75)} !important`,
    },
    logo: {
      position: "absolute",
      left: 20,
      display: "flex",
    },
    paper: {
      background: theme.palette.other.background.n3,
      border: `1px solid ${alpha(theme.palette.text.primary, 0.16)}`,
    },
    selected: {
      backgroundColor: `${alpha(
        theme.palette.primary.dark,
        theme.opacity.dark
      )} !important`,
    },
    list: {
      padding: 0,
    },
  })
);

const FeeSelectorDrowdown = ({
  label,
  feeTokens,
  selectedFeeTokenIndex,
  onChange,
  disabled,
  selectedNetworkId,
}: NetworkSelectorProps) => {
  const classes = useStyles();

  const addresses = useAddresses();
  const { chainId } = useContext(ContractsContext);
  const tokenAddresses = feeTokens.map((x) => x.address.toLowerCase());

  const feeTokensColl = Object.entries(addresses)
    .filter(([_tokenId, address]) =>
      tokenAddresses.includes(address.toLowerCase())
    )
    .map(([tokenId, address]) => {
      return {
        tokenId: tokenId as TokenId,
        address: address,
        amount: feeTokens.filter(
          (x) => x.address.toLowerCase() === address.toLowerCase()
        )[0].amount,
      };
    });

  const native = feeTokens.filter(
    (x) => x.address === ethers.constants.AddressZero
  );
  if (native.length && chainId)
    feeTokensColl.push({
      address: native[0].address,
      amount: native[0].amount,
      tokenId: NETWORKS[chainId as SupportedNetworks].nativeToken,
    });

  const tokenPrices = useTokenData(feeTokensColl.map((x) => x.tokenId));

  return (
    <>
      <InputLabel variant="standard">{label ?? "Fee token"}</InputLabel>
      <FormControl fullWidth>
        <Select
          disabled={disabled}
          value={selectedFeeTokenIndex}
          onChange={(e) => onChange(e.target.value as TokenId)}
          inputProps={{ "aria-label": "Without label" }}
          fullWidth
          IconComponent={ExpandMore}
          classes={{
            outlined: classes.select,
          }}
          MenuProps={{
            classes: {
              paper: classes.paper,
              list: classes.list,
            },
          }}
        >
          {feeTokensColl.map((feeToken) => {
            let tokenId = getContractAddressIDByChainIdAndAddress(
              selectedNetworkId,
              feeToken.address
            );

            if (!tokenId) {
              if (feeToken.address === ethers.constants.AddressZero) {
                tokenId = NETWORKS[selectedNetworkId]
                  .nativeToken as ContractAddresses;
              } else {
                return;
              }
            }

            const token = getToken(tokenId as TokenId);

            const tokenPrice =
              feeToken.tokenId in tokenPrices
                ? tokenPrices[feeToken.tokenId]!.price
                : 0;

            return (
              <MenuItem
                value={feeToken.tokenId}
                key={feeToken.tokenId}
                classes={{ selected: classes.selected }}
                className={classes.network}
              >
                <div className={classes.logo}>
                  <Image
                    src={token.picture}
                    alt={token.symbol}
                    width="24"
                    height="24"
                  />
                  <Box mr={1} />
                  <Typography>{token.symbol}</Typography>
                </div>

                <Typography>
                  {feeToken.amount.toFixed(token.displayedDecimals)} ($
                  {feeToken.amount.multipliedBy(tokenPrice).toFormat(2)})
                </Typography>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};

export default FeeSelectorDrowdown;

import { Heading } from "@/components/Heading";
import BigNumber from "bignumber.js";
import InfoBox from "@/components/InfoBox";
import Badge from "@/components/Badge";
import {
  Box,
  BoxProps,
  ListItem,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DetailItem from "./DetailItem";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import {
  ammAPINames,
  ammNames,
  liquidityFeePercentage,
  mosaicFeePercentage,
  SupportedNetwork,
  TEST_SUPPORTED_NETWORKS,
} from "@/submodules/contracts-operations/src/defi/constants";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";
import {
  selectMosaicTokens,
  Token,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { useAppSelector } from "@/store";
import React, { useContext, useEffect, useMemo } from "react";
import { TransactionStatusLabels } from "@/submodules/contracts-operations/src/api";

const TokenDetailItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  display: "flex",
  color: theme.palette.text.primary,
  height: 66,
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: theme.spacing(1),
  "&:hover": {
    background: "rgba(255, 255, 255, 0.03)",
  },
}));

interface TokenDetailsProps {
  amount: BigNumber;
  token: Token;
  tokenAmountDecimals: number;
  tokenPrice: number | undefined;
  label: string;
}

const TokenDetails = ({
  amount,
  token,
  tokenAmountDecimals,
  tokenPrice,
  label,
} : TokenDetailsProps) => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        gap={2}
      >
        <Image
          src={token.image}
          width={24}
          height={24}
          alt={token.symbol}
        />

        <Typography color="text.primary" variant={"body2"}>
          {token.symbol}
          <Typography
            component={"span"}
            color={"text.primary"}
            variant={"body2"}
            fontWeight={"bold"}
            sx={{ marginLeft: theme.spacing(2) }}
          >
            {label}
          </Typography>
        </Typography>
      </Box>

      <Box textAlign={"right"}>
        <Typography
          color="text.primary"
          fontWeight={"bold"}
          variant={"body2"}
        >
          {`${amount?.toFixed(tokenAmountDecimals)} ${token.symbol}`}
        </Typography>

        {tokenPrice &&
        <Typography color="text.primary" variant={"caption"}>
          ~ {amount?.times(tokenPrice).toFixed(2)} USD
        </Typography>
        }
      </Box>
    </React.Fragment>
  );
}

interface TypeValues {
  amountText: string;
  timestamp: string;
  textTransactionDescription: string;
  tokenTransactionDescription: string;
}

type DetailsProps = {
  tx: Transaction;
} & BoxProps;

export const Details = ({
  tx,
  ...rest
}: DetailsProps) => {
  const theme = useTheme();

  const tokens = useAppSelector(selectMosaicTokens);

  const sourceChainId = useMemo(
    () => tx.sourceNetworkId,
    [tx]
  );

  const sourceNetwork = TEST_SUPPORTED_NETWORKS[sourceChainId];

  const sourceTokenAddress = useMemo(
    () => tx.sourceTokenAddress,
    [tx]
  );
  
  const sourceToken : Token | undefined = useMemo(
    () => tokens.find((token: Token) => token.chainId === sourceChainId && token.address === sourceTokenAddress),
    [tokens, sourceChainId, sourceTokenAddress]
  )

  const destinationChainId = useMemo(
    () => tx.remoteNetworkId,
    [tx]
  );

  const destinationNetwork = TEST_SUPPORTED_NETWORKS[
    destinationChainId
  ] as SupportedNetwork;

  const destinationTokenAddress = useMemo(
    () => tx.destinationTokenAddress,
    [tx]
  );

  const destinationToken: Token | undefined = useMemo(
    () =>
      tokens.find(
        (token: Token) =>
          token.chainId === destinationChainId &&
          token.address === destinationTokenAddress
      ),
    [tokens, destinationChainId, destinationTokenAddress]
  );

  const {
    setToken,
    setNetwork,
    getNativeTokenPrice,
    getNativeTokenAmountDecimals,
    getTokenAmountDecimals,
    getTokenPrice,
  } = useContext(NetworkTokenOperationsContext);

  useEffect(
    () => {
      setNetwork(destinationChainId)
    },
    [destinationChainId, setNetwork]
  )

  useEffect(
    () => {
      setToken(sourceToken)
    },
    [sourceToken, setToken]
  )

  useEffect(
    () => {
      setToken(destinationToken)
    },
    [destinationToken, setToken]
  )

  const sourceTokenPrice = useMemo(
    () => getTokenPrice(sourceToken),
    [getTokenPrice, sourceToken]
  );

  const sourceDecimals = useMemo(
    () => getTokenAmountDecimals(sourceToken),
    [getTokenAmountDecimals, sourceToken]
  );

  const destinationTokenPrice = useMemo(
    () => getTokenPrice(destinationToken),
    [getTokenPrice, destinationToken]
  );

  const destinationDecimals = useMemo(
    () => getTokenAmountDecimals(destinationToken),
    [getTokenAmountDecimals, destinationToken]
  );

  const destinationNativeTokenPrice = useMemo(
    () => getNativeTokenPrice(destinationChainId),
    [getNativeTokenPrice, destinationChainId]
  );

  const destinationNativeDecimals = useMemo(
    () => getNativeTokenAmountDecimals(destinationChainId),
    [getNativeTokenAmountDecimals, destinationChainId]
  );

  const destinationNativeValueUSD = 10;

  const destinationNativeAmount = useMemo(
    () =>
      destinationNativeTokenPrice
        ? new BigNumber(destinationNativeValueUSD / destinationNativeTokenPrice)
        : new BigNumber(0),
    [destinationNativeValueUSD, destinationNativeTokenPrice]
  );

  const destinationTokenPriceToDestinationNativeTokenPriceRatio = useMemo(
    () =>
      (destinationTokenPrice &&
        destinationNativeTokenPrice &&
        destinationTokenPrice / destinationNativeTokenPrice) ||
      1,
    [destinationTokenPrice, destinationNativeTokenPrice]
  );

  const transactionFee = useMemo(
    () =>
      tx.feeTaken?.baseFee?.times?.(
        destinationTokenPriceToDestinationNativeTokenPriceRatio
      ),
    [tx, destinationTokenPriceToDestinationNativeTokenPriceRatio]
  );

  const mosaicFee = useMemo(
    () =>
      tx.feeTaken?.fee?.times?.(
        destinationTokenPriceToDestinationNativeTokenPriceRatio *
          mosaicFeePercentage
      ),
    [tx, destinationTokenPriceToDestinationNativeTokenPriceRatio]
  );

  const liquidityProviderFee = useMemo(
    () =>
      tx.feeTaken?.fee?.times?.(
        destinationTokenPriceToDestinationNativeTokenPriceRatio *
          liquidityFeePercentage
      ),
    [tx, destinationTokenPriceToDestinationNativeTokenPriceRatio]
  );

  const typeValues: TypeValues = useMemo(
    () => {
      switch (tx.type) {
        case "liquidity-deposit":
          return {
            amountText: "Amount deposited",
            timestamp: tx.transactions.deposit.timestamp,
            textTransactionDescription: "Deposited",
            tokenTransactionDescription: `${sourceToken?.symbol}`,
          };
        case 'liquidity-withdrawal':
          return {
            amountText: "Amount withdrawn",
            timestamp: tx.transactions.Withdrawal.timestamp, // TODO(Marko): Decapitalazie Withdrawal when fixed on the backend
            textTransactionDescription: "Cross Layer Withdrawal",
            tokenTransactionDescription: `${sourceToken?.symbol}`,
          };
        case 'nft':
          return {
            amountText: "",
            timestamp: tx.transactions.deposit.timestamp,
            textTransactionDescription: "Cross Layer Swap",
            tokenTransactionDescription: "NFT Transfer",
          }
        case 'token':
          return {
            amountText: "Amount sent",
            timestamp: tx.transactions.deposit.timestamp,
            textTransactionDescription: "Cross Layer Swap",
            tokenTransactionDescription: `${sourceToken?.symbol} to ${destinationToken?.symbol}`,
          };
        default:
          return {
            amountText: "",
            timestamp: "",
            textTransactionDescription: "",
            tokenTransactionDescription: "",
          };
      }
    },
    [destinationToken, sourceToken, tx]
  )

  const {
    amountText,
    timestamp,
    textTransactionDescription,
    tokenTransactionDescription,
  } = typeValues;

  return (
    sourceToken && (tx.type === 'liquidity-deposit' || destinationToken) &&
      <Box
        sx={{
          maxWidth: 780,
          margin: "auto",
        }}
        {...rest}
      >
        <Heading
          title="Transaction Details"
          subTitle="You will be able to check your transaction details here"
        />

        <InfoBox textAlign="center" mt={6}>
          <Typography variant="body1">
            {tokenTransactionDescription} 
          </Typography>
          <Box display="flex" mt={1} justifyContent="center">
            <Image
              src={sourceToken.image}
              width={24}
              height={24}
              alt={sourceToken.symbol}
            />
            {tx.type === 'token' && destinationToken &&
            <React.Fragment>
              <SwapHorizIcon />
              <Image
                src={destinationToken.image}
                width={24}
                height={24}
                alt={destinationToken.symbol}
              />
            </React.Fragment>
            }
          </Box>
          <Typography variant="body2" mt={2}>
            Transaction number
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: alpha(theme.palette.primary.contrastText, 0.6),
            }}
            mt={1}
          >
            {tx.publicId.split("-")[1]}
          </Typography>
        </InfoBox>

        <Typography textAlign="center" variant="h6" mt={8}>
          {textTransactionDescription}
        </Typography>

        <Box display="flex" mt={6}>
          <InfoBox width="50%" mr={3} textAlign="center" paddingX={0}>
            <Typography
              sx={{
                color: alpha(theme.palette.primary.contrastText, 0.6),
              }}
              variant="caption"
              component="div"
            >
              From
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={1}
            >
              <Image
                src={getChainIconURL(sourceChainId)}
                width={24}
                height={24}
                alt={sourceNetwork?.name}
              />
              <Typography variant="body2" ml={2}>
                {sourceNetwork?.name}
              </Typography>
            </Box>
          </InfoBox>
          <InfoBox width="50%" textAlign="center" paddingX={0}>
            <Typography variant="caption" component="div">
              To
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={1}
            >
              <Image
                src={getChainIconURL(destinationChainId)}
                width={24}
                height={24}
                alt={destinationNetwork?.name}
              />
              <Typography variant="body2" ml={2}>
                {destinationNetwork?.name}
              </Typography>
            </Box>
          </InfoBox>
        </Box>

      <InfoBox mt={4} py={4} px={3} textAlign="center">
        <Typography variant="h6">
          Details
        </Typography>
        <Box mt={4}>
          {tx.type === 'token' &&
          <DetailItem label="Initiated">
            <Typography variant="body2">
              {new Date(tx.transactions.deposit.timestamp).toLocaleString()}
            </Typography>
          </DetailItem>
          }
          <DetailItem label="Completed">
            <Typography variant="body2">
              {new Date(timestamp).toLocaleString()}
            </Typography>
          </DetailItem>
          <DetailItem label="Origin address" mt={2} isMobile>
            <Typography variant="body2">
              {tx.sourceUserAddress}
            </Typography>
          </DetailItem>
          {(tx.type === 'liquidity-withdrawal' || tx.type === 'token') &&
          <DetailItem label="Destination address" mt={2} isMobile>
            <Typography variant="body2">
              {tx.destinationUserAddress}
            </Typography>
          </DetailItem>
          }

          {tx.type !== 'nft' && sourceToken &&
          <React.Fragment>
            <Box mt={2} />

            <TokenDetailItem
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <TokenDetails
                amount={tx.amount}
                token={sourceToken}
                tokenAmountDecimals={sourceDecimals}
                tokenPrice={sourceTokenPrice}
                label="sent"
              />
            </TokenDetailItem>
          </React.Fragment>
          }

          {(tx.type === 'liquidity-withdrawal' || tx.type === 'token') &&
          <React.Fragment>
            {mosaicFee &&
            <DetailItem label="Mosaic Fee" mt={2}>
              <Box textAlign="right">
                <Typography variant="body2">
                  {`${mosaicFee?.toFixed(sourceDecimals * 3)} ${
                    sourceToken.symbol
                  }`}
                </Typography>
                {sourceTokenPrice && (
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                  >
                    ~ {mosaicFee?.times(sourceTokenPrice).toFixed(2)} USD
                  </Typography>
                )}
              </Box>
            </DetailItem>
            }
            {liquidityProviderFee &&
            <DetailItem label="Liquidity Provider Fee" mt={2}>
              <Box textAlign="right">
                <Typography variant="body2">
                  {`${liquidityProviderFee?.toFixed(sourceDecimals * 3)} ${
                    sourceToken.symbol
                  }`}
                </Typography>
                {sourceTokenPrice && (
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                  >
                    ~ {liquidityProviderFee?.times(sourceTokenPrice).toFixed(2)}{" "}
                    USD
                  </Typography>
                )}
              </Box>
            </DetailItem>
            }
            {transactionFee &&
            <DetailItem label="Transaction Fee" mt={2}>
              <Box textAlign="right">
                <Typography variant="body2">
                  {`${transactionFee?.toFixed(sourceDecimals * 3)} ${
                    sourceToken.symbol
                  }`}
                </Typography>
                {sourceTokenPrice && (
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                  >
                    ~ {transactionFee?.times(sourceTokenPrice).toFixed(2)} USD
                  </Typography>
                )}
              </Box>
            </DetailItem>
            }
          </React.Fragment>
          }

          {destinationToken &&
          <React.Fragment>
            <Box mt={2} />

            <TokenDetailItem
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <TokenDetails
                amount={tx.minimumOutAmount}
                token={destinationToken}
                tokenAmountDecimals={destinationDecimals}
                tokenPrice={destinationTokenPrice}
                label="received"
              />
            </TokenDetailItem>
          </React.Fragment>
          }

          {(tx.type === 'liquidity-withdrawal' || tx.type === 'token' ) && tx.swapToNative && destinationNetwork?.nativeToken && (
          <React.Fragment>
            <Box mt={2} />

            <TokenDetailItem
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <TokenDetails
                amount={destinationNativeAmount}
                // @ts-ignore
                token={destinationNetwork.nativeToken}
                tokenAmountDecimals={destinationNativeDecimals}
                tokenPrice={destinationNativeTokenPrice}
                label="received"
              />
            </TokenDetailItem>
          </React.Fragment>
          )}

          {!!tx.remoteAMMId && ammNames[tx.remoteAMMId] !== undefined && (
            <DetailItem label="AMM" mt={2}>
              <Box display="flex" justifyContent="right" alignItems="center">
                <Image
                  src={`/amms/${ammAPINames[
                    tx.remoteAMMId
                  ]?.toLowerCase()}.svg`}
                  width={24}
                  height={24}
                  alt="uniswap"
                />
                <Typography variant="body2" ml={1.5}>
                  {ammNames[tx.remoteAMMId]}
                </Typography>
              </Box>
            </DetailItem>
          )}

          <DetailItem label="State" mt={2}>
            <Badge type={tx.status}>
              <Typography variant="caption" color={`${tx.status}.main`}>
                {TransactionStatusLabels[tx.status]}
              </Typography>
            </Badge>
          </DetailItem>
        </Box>
      </InfoBox>
    </Box>
    ||
    null
  )
}
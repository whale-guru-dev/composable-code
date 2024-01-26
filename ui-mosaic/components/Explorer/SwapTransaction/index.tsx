import { Box, BoxProps, Typography } from "@mui/material";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ActionCell from "../ActionCell";
import TransactionHeader from "../TransactionHeader";
import TransactionRow from "../TransactionRow";
import TransactionCell from "../TransactionCell";
import TransactionItem from "../TransactionItem";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { useAppSelector } from "@/store";
import { selectMosaicTokens, Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";
import { useContext, useEffect, useMemo } from "react";
import { TEST_SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";

type SwapTransactionProps = {
  tx: Transaction;
} & BoxProps;

const SwapTransaction = ({
  tx,
  ...rest
}: SwapTransactionProps) => {
  const {
    getTokenAmountDecimals,
    setToken,
  } = useContext(NetworkTokenOperationsContext);

  const tokens = useAppSelector(selectMosaicTokens);

  const sourceToken = useMemo(
    () => tokens.find((token: Token) => token.address === tx.sourceTokenAddress),
    [tokens, tx]
  )

  useEffect(
    () => setToken(sourceToken),
    [setToken, sourceToken]
  )

  const sourceTokenDecimals = useMemo(
    () => getTokenAmountDecimals(sourceToken),
    [getTokenAmountDecimals, sourceToken]
  );

  const sourceTokenAmount = tx.amount.toFixed(sourceTokenDecimals);

  const destinationToken = useMemo(
    () => tokens.find((token: Token) => token.address === tx.destinationTokenAddress),
    [tokens, tx]
  )

  useEffect(
    () => setToken(destinationToken),
    [setToken, destinationToken]
  )

  const destinationTokenDecimals = useMemo(
    () => getTokenAmountDecimals(destinationToken),
    [getTokenAmountDecimals, destinationToken]
  );
  
  const destinationTokenAmount = tx.minimumOutAmount.toFixed(destinationTokenDecimals);

  return (
    <TransactionItem {...rest} transactionId={tx.publicId} transactionType={tx.type}>
      <TransactionHeader label="Swap" timestamp={tx.transactions.deposit.timestamp} pb={2} />

      <TransactionRow>
        <TransactionCell label="Swapped from" flexGrow={5}>
          {sourceToken &&
          <Box display="flex" alignItems="center">
            <Image src={sourceToken.image} width={24} height={24} alt="ETH" />
            <Typography variant="body2" ml={2}>
              {sourceTokenAmount} {sourceToken.symbol}
            </Typography>
          </Box>
          }
        </TransactionCell>

        <TransactionCell label="Swapped to" flexGrow={5}>
          {destinationToken &&
          <Box display="flex" alignItems="center">
            <Image src={destinationToken.image} width={24} height={24} alt="USDC" />
            <Typography variant="body2" ml={2}>
              {destinationTokenAmount} {destinationToken.symbol}
            </Typography>
          </Box>
          }
        </TransactionCell>

        <TransactionCell label="From" flexGrow={5}>
          <Box display="flex" alignItems="center">
            <Image src={getChainIconURL(tx.sourceNetworkId)} width={24} height={24} alt="NFT" />
            <Typography variant="body2" ml={2}>
              {TEST_SUPPORTED_NETWORKS[tx.sourceNetworkId]?.name}
            </Typography>
          </Box>
        </TransactionCell>

        <TransactionCell label="To" flexGrow={5}>
          <Box display="flex" alignItems="center">
            <Image src={getChainIconURL(tx.remoteNetworkId)} width={24} height={24} alt="NFT" />
            <Typography variant="body2" ml={2}>
              {TEST_SUPPORTED_NETWORKS[tx.remoteNetworkId]?.name}
            </Typography>
          </Box>
        </TransactionCell>

        <ActionCell status={tx.status} flexGrow={2}>
          <ArrowForwardIosIcon
            sx={{
              width: 16,
              height: 16,
              cursor: "pointer",
            }}
          />
        </ActionCell>
      </TransactionRow>
    </TransactionItem>
  );
};

export default SwapTransaction;

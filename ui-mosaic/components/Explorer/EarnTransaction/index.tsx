import { Box, BoxProps, IconButton, Link, Typography } from "@mui/material";
import Image from "next/image";
import LaunchIcon from "@mui/icons-material/Launch";
import { weth } from "@/assets/tokens";
import ActionCell from "../ActionCell";
import TransactionHeader from "../TransactionHeader";
import TransactionRow from "../TransactionRow";
import TransactionCell from "../TransactionCell";
import TransactionItem from "../TransactionItem";
import { useContext, useEffect, useMemo, useState } from "react";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { useAppSelector } from "@/store";
import { selectMosaicTokens, Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { TEST_SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";

type EarnTransactionProps = {
  tx: Transaction;
} & BoxProps;

const EarnTransaction = ({
  tx,
  ...rest
}: EarnTransactionProps) => {
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

  const timestamp = tx.type === 'liquidity-withdrawal' ? tx.transactions.Withdrawal.timestamp : tx.transactions.deposit.timestamp; // TODO(Marko): Decapitalazie Withdrawal when fixed on the backend

  return (
    <TransactionItem {...rest} transactionId={tx.publicId} transactionType={tx.type}>
      <TransactionHeader label="Earn" timestamp={timestamp} pb={2} />

      <TransactionRow>
        <TransactionCell
          label={
            tx.type === "liquidity-withdrawal"
              ? "Withdrawn"
              : "Deposited"
          }
          flexGrow={5}
        >
          {sourceToken &&
          <Box display="flex" alignItems="center">
            <Image src={sourceToken.image} width={24} height={24} alt="NFT" />
            <Typography variant="body2" ml={2}>
              {sourceTokenAmount} {sourceToken.symbol}
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

        {tx.sourceNetworkId &&
        <ActionCell status={tx.status} flexGrow={2}>
          <Link
            href={TEST_SUPPORTED_NETWORKS[tx.sourceNetworkId]?.infoPageUrl + tx.publicId.split('-')[1]}
            target="_blank"
            rel="noreferrer"
          >
            <IconButton
              sx={{
                border: "none",
                mx: "-12px",
              }}
              size="small"
            >
              <LaunchIcon
                color="primary"
                sx={{
                  width: 16,
                  height: 16,
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </Link>
        </ActionCell>
        }
      </TransactionRow>
    </TransactionItem>
  );
};

export default EarnTransaction;

import { Box, BoxProps, Typography } from "@mui/material";
import Image from "next/image";
import { mainnet, polygon } from "@/assets/networks";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ActionCell from "../ActionCell";
import TransactionHeader from "../TransactionHeader";
import TransactionRow from "../TransactionRow";
import TransactionCell from "../TransactionCell";
import TransactionItem from "../TransactionItem";
import RoundedLayersIcon from "@/components/RoundedLayersIcon";
import { useState } from "react";
import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";

type NFTTransactionProps = {
  tx: Transaction;
} & BoxProps;

const NFTTransaction = ({ tx, ...rest }: NFTTransactionProps) => {
  const [transactionId] = useState(
    "43114-0x111602e61d848d17bcb7ee4154a33428274bd9b750ea7fa9367f76521e06afa3"
  );

  return (
    <TransactionItem {...rest} transactionId={transactionId}>
      <TransactionHeader label="NFT" timestamp={""} pb={2} />

      <TransactionRow>
        <TransactionCell label="Transferred" flexGrow={5}>
          <Box display="flex" alignItems="center">
            <RoundedLayersIcon />
            <Typography variant="body2" ml={2}>
              Most legit NFT
            </Typography>
          </Box>
        </TransactionCell>

        <TransactionCell label="From" flexGrow={5}>
          <Box display="flex" alignItems="center">
            <Image src={mainnet} width={24} height={24} alt="NFT" />
            <Typography variant="body2" ml={2}>
              Ethereum
            </Typography>
          </Box>
        </TransactionCell>

        <TransactionCell label="To" flexGrow={5}>
          <Box display="flex" alignItems="center">
            <Image src={polygon} width={24} height={24} alt="NFT" />
            <Typography variant="body2" ml={2}>
              Polygon
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

export default NFTTransaction;

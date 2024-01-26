import React, { useContext, useEffect, useState } from "react";
import { SidebarItem, useSidebar } from "@/contexts/SidebarProvider";
import { useRouter } from "next/router";
<<<<<<< HEAD
import { CircularProgress, Container, Typography, Box } from "@mui/material";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
=======
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { NetworkTokenOperationsContext, Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
>>>>>>> a02151ebce3d9dba0e72967ee786d2174aaaef7c
import { TransactionType } from "@/submodules/contracts-operations/src/api";
import TransactionDetails from "@/components/Transaction";

const TransactionDetailPage = () => {
  const router = useRouter();
  const transactionType = router.query.transactionType as
    | TransactionType
    | undefined;
  const transactionId = router.query.transactionId as string | undefined;

  const { getTransaction } = useContext(NetworkTokenOperationsContext);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [tx, setTx] = useState<Transaction | undefined>(undefined);
  const { setActiveItem, setSubPage } = useSidebar();

  useEffect(() => {
    setActiveItem(SidebarItem.Explorer);
    setSubPage("Transaction Details");
  }, [setActiveItem, setSubPage]);

  useEffect(() => {
    if (transactionId) {
      setLoading(true);
      getTransaction(
        transactionType as TransactionType,
        transactionId as string
      ) // TODO(Marko): Proper type
        .then((response: Transaction) => {
          setTx(response);
        })
        .catch(() => {
          setTx(undefined);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [getTransaction, transactionType, transactionId]);

  return (
    <Container maxWidth="md">
      {(isLoading && (
        <Box padding={6} textAlign="center">
          <CircularProgress color="inherit" size={50} />
          <Typography variant="h5" mt={2}>
            Loading
          </Typography>
        </Box>
      )) ||
        (tx === undefined && (
          <Box padding={6} textAlign="center">
            <Typography variant="h5" mt={2}>
              Invalid transaction
            </Typography>
          </Box>
        )) ||
        (tx && <TransactionDetails {...tx} />)}
    </Container>
  );
};

export default TransactionDetailPage;

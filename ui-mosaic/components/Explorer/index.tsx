import { useContext, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Heading } from "components/Heading";
import useOnlyDesktop from "hooks/useOnlyDesktop";
import DesktopNotAllowed from "components/DesktopNotAllowed";
import FeaturedBox from "../FeaturedBox";
import Button from "../Button";
import Switcher from "../Switcher";
import FilterNav, {
  TransactionFilter,
  TransactionFilterToTypesMapping,
} from "./FilterNav";
import NoConnectCover from "./NoConnectCover";
import { useBlockchainProvider, useConnector } from "@integrations-lib/core";
import {
  compareTxByDate,
  isOwner,
  TransactionType,
} from "@/submodules/contracts-operations/src/api";
import {
  NetworkTokenOperationsContext,
  Transaction,
  TransactionOwner,
} from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { TransactionBox } from "./TransactionBox";

const Explorer = () => {
  const { account, chainId: connectedChainId } = useConnector("metamask");
  const { provider, signer, isSupported } =
    useBlockchainProvider(connectedChainId);

  const isNotDesktop = useOnlyDesktop();
  const [loadAll, setLoadAll] = useState<boolean>(false);
  const [filter, setFilter] = useState<TransactionFilter>("All Transactions");
  const [owner, setOwner] = useState<TransactionOwner>(TransactionOwner.All);
  const [txCount, setTxCount] = useState<number>(5);

  const {
    getTransactions,
    getTransactionCount,
  } = useContext(NetworkTokenOperationsContext);

  const [transactions, setTransactions] = useState<Array<Transaction>>([]);

  const [leftToLoad, setLeftToLoad] = useState<number>(0);

  useEffect(() => {
    TransactionFilterToTypesMapping[filter].forEach((type: TransactionType) => {
      setLeftToLoad((leftToLoad) => leftToLoad + 1);

      getTransactions({
        owner,
        type,
        count: txCount,
      })
        .then((value: Array<Transaction>) => {
          setTransactions((transactions) => {
            return [
              ...transactions.filter(
                (tx: Transaction) =>
                  (filter === "All Transactions" ||
                    TransactionFilterToTypesMapping[filter].includes(
                      tx.type
                    )) &&
                  (owner === TransactionOwner.All || isOwner(tx, account))
              ),
              ...value.filter(
                (tx: Transaction) =>
                  !transactions.find(
                    (alreadyFetchedTx: Transaction) =>
                      alreadyFetchedTx.publicId === tx.publicId
                  )
              ),
            ].sort(compareTxByDate);
          });
        })
        .finally(() => {
          setLeftToLoad((leftToLoad) => leftToLoad - 1);
        });
    });
  }, [account, owner, filter, getTransactions, txCount]);

  const isMyTransactionsTab = owner === 1;

  const handleLoadMore = () => {
    setTxCount((txCount) => txCount + 5);
  };

  const [totalTxCount, setTotalTxCount] = useState<number>(0);
  const [countFetched, setCountFetched] = useState<boolean>(false);

  useEffect(() => {
    setTotalTxCount(0);

    TransactionFilterToTypesMapping[filter].forEach((type: TransactionType) => {
      const count = getTransactionCount(type, owner);

      setTotalTxCount((totalTxCount) => totalTxCount + count);
    });

    setCountFetched(true);
  }, [filter, getTransactionCount, owner]);

  useEffect(() => {
    setLoadAll(countFetched && transactions.length === totalTxCount);
  }, [countFetched, transactions, totalTxCount]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setOwner(newValue);
    setCountFetched(false);
  };

  const handleFilterChange = (newValue: TransactionFilter) => {
    setFilter(newValue);
    setCountFetched(false);
  };

  useEffect(() => {
    setFilter("All Transactions");
  }, [owner]);

  return (
    <Box paddingBottom={12}>
      <Heading
        title="Explorer"
        subTitle="You will be able review here all transactions history."
      />

      {!account && (
        <FeaturedBox
          title="Connect wallet"
          intro="To review your history wallet needs to be connected."
          mt={6}
        />
      )}

      {isNotDesktop && <DesktopNotAllowed title="Explorer" />}

      {true && (
        <>
          <Switcher
            selectedTab={owner}
            handleTabChange={handleTabChange}
            firstLabel="Global transactions"
            secondLabel="My transactions"
            mt={9}
            maxWidth={680}
            marginX="auto"
          />

          {account || !isMyTransactionsTab ? (
            <>
              <FilterNav
                isGlobal={!isMyTransactionsTab}
                filter={filter}
                setFilter={handleFilterChange}
                mt={5.75}
              />

              {transactions.map((tx: Transaction, index: number) => (
                <TransactionBox key={index} tx={tx} mt={4} />
              ))}

              {!loadAll && (
                <Box mt={6}>
                  <Button variant="outlined" fullWidth onClick={handleLoadMore}>
                    {leftToLoad === 0 ? (
                      "Load more"
                    ) : (
                      <CircularProgress size={23} />
                    )}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <NoConnectCover mt={8} />
          )}
        </>
      )}
    </Box>
  );
};

export default Explorer;

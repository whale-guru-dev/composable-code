import Button from "components/Button";
import React, { useContext, useMemo } from "react";
import { Heading } from "../Heading";
import Summary from "./Summary";
import Crosslayer from "../Crosslayer";
import FeaturedBox from "../FeaturedBox";
import SupportedTokenList from "./SupportedTokensList";
import Positions from "./Positions";
import { useRouter } from "next/router";
import { useConnector } from "@integrations-lib/core";
import {
  selectLiquidityTokens,
  Token,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { useAppSelector } from "@/store";
import { Balance } from "@integrations-lib/interaction";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { CrossChainTokensDetailsProvider } from "@/phase2/components/CrossChainTokenDetails";

const Earn = () => {
  const { account } = useConnector("metamask");
  const router = useRouter();

  const {
    getDepositedSum,
  } = useContext(NetworkTokenOperationsContext);

  const liquidityTokens: Array<Token> = useAppSelector(selectLiquidityTokens);

  const deposited: Balance = useMemo(
    () => getDepositedSum(liquidityTokens),
    [getDepositedSum, liquidityTokens]
  );

  return (
    <CrossChainTokensDetailsProvider>
      <Heading
        title="Earn"
        subTitle="Earn Vault Fees by providing single-sided liquidity to faciliate cross-layer transactions.
        You will be able to deposit and withdraw your assets on any available EVM L1 & L2 chains."
      />

      <FeaturedBox
        title="Migrate Liquidity"
        intro="To start earning rewards, migrate liquidity from Phase 1."
        action={
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ px: 3, py: 2 }}
            onClick={() => router.push("/migrate")}
          >
            Go to Phase 1
          </Button>
        }
        mt={6}
      />

      {!account && (
        <FeaturedBox
          title="Connect wallet"
          intro="To start earning rewards, wallet needs to be connected."
          mt={6}
        />
      )}

      {account && deposited.value?.isLessThanOrEqualTo(0) && (
        <FeaturedBox
          title="You don´t have any Earnings running yet"
          intro="Select a vault and start earning"
          mt={6}
        />
      )}

      {account && deposited.value?.isGreaterThan(0) && <Positions mt={6} />}

      <Summary mt={9} />

      <Crosslayer
        label="See your gains in real time in our"
        linkText="Crosslayer Explorer"
        linkPath="/explorer"
        mt={6}
      />

      <SupportedTokenList mt={11} />
    </CrossChainTokensDetailsProvider>
  );
};

export default Earn;

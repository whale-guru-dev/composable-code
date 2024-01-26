import React, { useContext, useState } from "react";
import { Heading } from "../Heading";
import SummaryBox from "./Summary/SummaryBox";
import Image from "next/image";
import Crosslayer from "../Crosslayer";
import FeaturedBox, { InlineFeaturedBox } from "../FeaturedBox";
import {
  useConfirmationModal,
  useWalletConnectModalModal,
} from "store/appsettings/hooks";
import Button from "../Button";
import { InBoxSupportedTokens } from "./SupportedTokensList";
import { SimpleConfirmingModal } from "./ConfirmingModal";
import { SimpleCompleteModal } from "./CompleteModal";
import MigrateModal from "./MigrateModal";
import { getToken } from "@/defi/tokenInfo";
import { Status } from "./Vaults/types";
import { useConnector } from "@integrations-lib/core";
import {
  LIQUIDITY_PROVIDER_SUPPORTED_TOKEN,
  SupportedLpToken,
} from "@/constants";
import { useDispatch } from "react-redux";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { ContractsContext } from "@/defi/ContractsContext";
import { useAddresses } from "@/defi/hooks";

const Migrate = () => {
  const { account } = useConnector("metamask");

  const dispatch = useDispatch();
  const { openWalletConnect } = useWalletConnectModalModal();
  const [status, setStatus] = useState<Status>(Status.NotStarted);
  const [tokenId, setTokenId] = useState<SupportedLpToken | null>(null);

  const { openConfirmation, closeConfirmation } = useConfirmationModal();

  const handleMigrate = (id: SupportedLpToken) => {
    setStatus(Status.Started);
    setTokenId(id);
  };

  const { contracts } = useContext(ContractsContext);
  const addresses = useAddresses();

  const handleWithdraw = () => {
    if (tokenId) {
      const token = getToken(tokenId);
      if (contracts) {
        setStatus(Status.Confirming);
        openConfirmation();
        const lpVault = contracts.liquidityprovidervault.contract();
        console.log("HANDLE WITHDRAW tokenAddress", addresses[tokenId]);
        lpVault
          .withdraw(addresses[tokenId], "Withdraw " + token.symbol, tokenId)
          .then(() => {
            closeConfirmation();
            //handleClose();
            setStatus(Status.Completed);
          })
          .catch(() => {
            closeConfirmation();
            setStatus(Status.NotStarted);
            dispatch(
              addNotification({
                message: "Could not submit transaction.",
                type: "error",
              })
            );
            //handleClose();
          });
      }
    }
  };

  const isMigrateDisabled = !account;

  return (
    <>
      <Heading
        title="Earn"
        subTitle="Earn fees by providing single-sided liquidity to faciliate cross-layer transactions."
      />

      {!account ? (
        <FeaturedBox
          title="Connect Wallet"
          intro="To start earning rewards, wallet needs to be connected."
          action={
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={!account ? () => openWalletConnect() : undefined}
            >
              Connect Wallet
            </Button>
          }
          mt={6}
        />
      ) : (
        <InlineFeaturedBox
          image={
            <Image src="/tokens/layr2.png" alt="layr2" width={48} height={48} />
          }
          content="Migrate liquidity to Mosaic and keep earning"
          action={
            <Button variant="outlined" color="primary" size="small">
              Learn more
            </Button>
          }
          mt={6}
        />
      )}

      {/* <Positions mt={6} /> */}

      {LIQUIDITY_PROVIDER_SUPPORTED_TOKEN.map((token, i) => (
        <SummaryBox
          key={i}
          mt={9}
          tokenId={token.tokenId}
          isDisabled={isMigrateDisabled}
          onMigrate={handleMigrate}
        />
      ))}

      <Crosslayer
        label="See your gains in real time in our"
        linkText="Crosslayer Explorer"
        linkPath="/explorer"
        mt={6}
        color="text.secondary"
      />

      <InBoxSupportedTokens my={11} />
      {tokenId &&
      <MigrateModal
        handleWithdraw={handleWithdraw}
        token={getToken(tokenId)}
        onClose={() => setStatus(Status.NotStarted)}
        open={status != Status.NotStarted}
      />
      }
      <SimpleConfirmingModal open={status == Status.Confirming} />
      <SimpleCompleteModal
        open={status == Status.Completed}
        onClose={() => setStatus(Status.NotStarted)}
      />
    </>
  );
};

export default Migrate;

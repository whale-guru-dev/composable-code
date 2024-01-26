import { Heading } from "../../components/Heading";

import Summary from "./Summary";
import Crosslayer from "../Crosslayer";
//import Form from "./Form";
import ConfirmingModal from "./ConfirmingModal";
import CompleteModal from "./CompleteModal";
import React from "react";
import Form from "./Form";
import { SupportedLpToken } from "@/constants";
import WithdrawForm from "./WithdrawForm";

const Earn = ({
  //tokens,
  //onSubmit,
  confirming,
  completed,
  onConfirmCompleted,
}: {
  confirming: boolean;
  completed: boolean;
  onConfirmCompleted: () => void;
}) => {
  const [selectedToken, setSelectedToken] = React.useState<SupportedLpToken>(
    "crvTricrypto-usd-btc-eth"
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const [selectedWithdrawToken, setSelectedWithdrawToken] =
    React.useState<SupportedLpToken>("weth");
  const [isOpenWithdraw, setIsOpenWithdraw] = React.useState(false);

  const onTokenSelect = (tokenId: SupportedLpToken) => {
    setSelectedToken(tokenId);
    setIsOpen(true);
  };

  const onWithdrawTokenSelect = (tokenId: SupportedLpToken) => {
    setSelectedWithdrawToken(tokenId);
    setIsOpenWithdraw(true);
  };

  return (
    <>
      <Heading
        title="Earn"
        subTitle="Earn fees by providing single-sided liquidity to faciliate cross-layer transactions."
      />
      <Summary
        onTokenSelect={onTokenSelect}
        onTokenSelectWithdraw={onWithdrawTokenSelect}
      />
      <Crosslayer
        label="See your gains in real time in our"
        linkText="Crosslayer Explorer"
        linkPath="/explorer"
      />

      <Form
        isOpen={isOpen}
        selectedToken={selectedToken}
        handleClose={() => setIsOpen(false)}
      />
      <WithdrawForm
        isOpen={isOpenWithdraw}
        selectedToken={selectedWithdrawToken}
        handleClose={() => setIsOpenWithdraw(false)}
      />

      {/*
      <Box textAlign="center">
        <Typography variant="h5">
          First phase of liquidity provision has ended.
        </Typography>
      </Box>
    */}
      <ConfirmingModal open={confirming && !completed} />
      <CompleteModal
        open={completed && !confirming}
        onClose={onConfirmCompleted}
      />
    </>
  );
};

export default Earn;

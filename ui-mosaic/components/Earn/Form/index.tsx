import { useState, useContext } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { alpha } from "@mui/material/styles";
import BigNumber from "bignumber.js";

import BigNumberInput from "../../BigNumberInput";
import Button from "../../Button";
import { selectLpVaultGeneral } from "store/lpVault/slice";
import { getToken } from "defi/tokenInfo";
import { useTokenDataSingle } from "hooks/useTokenData";
import { useAppSelector } from "store";
import { usePendingTransactions } from "hooks/usePendingTransactions";
import { useAddresses } from "defi/hooks";
import { ERC20Service } from "defi/contracts/erc20";
import { LiquidityProviderVaultService } from "defi/contracts/liquidityprovidervaultservice";
import { useDispatch } from "react-redux";
import { ContractsContext } from "defi/ContractsContext";
import { ERC20Addresses } from "defi/addresses";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { BNExt } from "utils/BNExt";
import { useConfirmationModal } from "store/appsettings/hooks";
import NetworkSwitchCover from "components/NetworkSwitchCover";
import { SupportedLpToken } from "@/constants";
import Image from "next/image";
import { Dialog } from "@/components/PreReview/Dialog";
import { close } from "@/assets/icons/common";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    label: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(2),
    },
    symbol: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.text.secondary,
      fontSize: "14px",
    },
    max: {
      color: theme.palette.primary.main,
      fontSize: "16px",
      lineHeight: "24px",
      cursor: "pointer",
    },
    submit: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(2, 3),
    },
    closeButton: {
      position: "fixed",
      top: "5%",
      right: "5%",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
    inputSymbol: {
      color: "white",
      fontSize: "16px",
      textTransform: "uppercase",
      paddingLeft: 8,
    },
  })
);

const Form = ({
  isOpen,
  selectedToken,
  handleClose,
}: {
  isOpen: boolean;
  selectedToken: SupportedLpToken;
  handleClose: () => any;
}) => {
  const classes = useStyles();
  const [value, setValue] = useState<BigNumber>(new BigNumber(0));

  const [valid, setValid] = useState(false);

  const slectedToken = getToken(selectedToken);

  const handleMax = () => {
    setValue(new BigNumber(max));
    setValid(true);
  };

  const addresses = useAddresses();

  const tokenData = useTokenDataSingle(selectedToken);
  const general = useAppSelector(selectLpVaultGeneral);
  const cap = new BigNumber(general[selectedToken].cap);
  const tvl = new BigNumber(general[selectedToken].tvl);
  const balance = new BigNumber(tokenData.balance);
  const max = cap.minus(tvl).lt(balance) ? cap.minus(tvl) : balance;

  const isPendingApprove = usePendingTransactions(addresses[selectedToken], [
    ERC20Service.prototype.approveUnlimited.name,
  ]);

  const isPendingDeposit = usePendingTransactions(
    addresses.liquidityprovidervault,
    [LiquidityProviderVaultService.prototype.deposit.name]
  );

  const hasAllowance = tokenData.hasAllowances.find(
    (x) => x === "liquidityprovidervault"
  );

  const { contracts, account } = useContext(ContractsContext);

  const dispatch = useDispatch();

  const { openConfirmation, closeConfirmation } = useConfirmationModal();

  const deposit = (tokenId: SupportedLpToken, amount: BigNumber) => {
    const token = getToken(tokenId);

    if (contracts) {
      openConfirmation();
      const lpVault = contracts.liquidityprovidervault.contract();
      lpVault
        .deposit(
          new BNExt(amount, token.decimals, true),
          addresses[tokenId],
          "Deposit " + token.symbol,
          tokenId
        )
        .then(() => {
          closeConfirmation();
          handleClose();
          setValue(new BigNumber(0));
          setValid(false);
        })
        .catch(() => {
          dispatch(
            addNotification({
              message: "Could not submit transaction.",
              type: "error",
            })
          );
          closeConfirmation();
          handleClose();
        });
    }
  };

  const allow = (tokenId: SupportedLpToken) => {
    const token = getToken(tokenId);

    if (contracts) {
      openConfirmation();
      const erc20 = contracts.erc20.contract({
        contract: tokenId as ERC20Addresses,
      });

      erc20
        .approveUnlimited(
          addresses["liquidityprovidervault"],
          "Approve " + token.symbol
        )
        .then(() => {
          closeConfirmation();
        })
        .catch(() => {
          dispatch(
            addNotification({
              message: "Could not submit transaction.",
              type: "error",
            })
          );
          closeConfirmation();
          handleClose();
        });
    }
  };

  return (
    <Dialog open={isOpen}>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={handleClose}
        size="large"
      >
        <Image src={close} width={26} height={26} alt="Close modal" />
      </IconButton>
      <Box
        margin="auto"
        maxWidth={800}
        width="100%"
        height="100%"
        overflow="hidden"
      >
        <div className={classes.root}>
          <Box position="relative">
            <NetworkSwitchCover supportedNetwork={1} />
            <div className={classes.label}>
              <Typography>Balance</Typography>
              <Typography>
                <span>
                  {new BigNumber(tokenData.balance).toFixed(
                    slectedToken.displayedDecimals
                  )}
                </span>
                <span className={classes.symbol}>{slectedToken.symbol}</span>
              </Typography>
            </div>

            <BigNumberInput
              value={value}
              setter={setValue}
              isValid={setValid}
              maxValue={max}
              forceDisable={!account}
              adornmentStart={
                <InputAdornment position="start">
                  <Image
                    src={getToken(selectedToken).picture}
                    alt={getToken(selectedToken).symbol}
                    width="50"
                    height="50"
                  />
                  <Typography className={classes.inputSymbol}>
                    {getToken(selectedToken).symbol}
                  </Typography>
                </InputAdornment>
              }
              adornmentEnd={
                <InputAdornment position="end">
                  <div className={classes.max} onClick={handleMax}>
                    MAX
                  </div>
                </InputAdornment>
              }
              forceMaxWidth
              maxDecimals={slectedToken.decimals}
            />
            {isPendingApprove || isPendingDeposit ? (
              <Box display="flex" width="100%" justifyContent="center" mt={4}>
                <Typography
                  variant="body1"
                  style={{ textTransform: "uppercase", lineHeight: 1.7 }}
                >
                  {isPendingApprove
                    ? "Increasing spending limit"
                    : "Depositing"}
                </Typography>
                <Box mr={1} />
                <CircularProgress
                  style={{
                    color: "#FF56C6",
                  }}
                  size={26}
                  thickness={4}
                />
              </Box>
            ) : (
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
                size="large"
                className={classes.submit}
                disabled={!valid || isPendingApprove || isPendingDeposit}
                style={{ padding: "7px 21px" }}
                onClick={() =>
                  hasAllowance
                    ? deposit(selectedToken, value)
                    : allow(selectedToken)
                }
              >
                {!hasAllowance ? "Increase spending limit" : "Deposit"}
              </Button>
            )}
          </Box>
        </div>
      </Box>
    </Dialog>
  );
};

export default Form;

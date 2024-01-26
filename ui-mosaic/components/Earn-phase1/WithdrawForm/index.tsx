import { useContext } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { alpha } from "@mui/material/styles";
import BigNumber from "bignumber.js";

import { selectLpVaultUser } from "store/lpVault/slice";
import { getToken } from "defi/tokenInfo";
import { useAppSelector } from "store";
import { usePendingTransactions } from "hooks/usePendingTransactions";
import { useAddresses } from "defi/hooks";
import { LiquidityProviderVaultService } from "defi/contracts/liquidityprovidervaultservice";
import { useDispatch } from "react-redux";
import { ContractsContext } from "defi/ContractsContext";
import { addNotification } from "@/submodules/contracts-operations/src/store/notifications/slice";
import { useConfirmationModal } from "store/appsettings/hooks";
import NetworkSwitchCover from "components/NetworkSwitchCover";
import { SupportedLpToken } from "@/constants";
import Image from "next/image";
import { Dialog } from "@/components/PreReview/Dialog";
import { close } from "@/assets/icons/common";
import Button from "@/components/Button";

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
      color: alpha(theme.palette.primary.light, 0.5),
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

const WithdrawForm = ({
  isOpen,
  selectedToken,
  handleClose,
}: {
  isOpen: boolean;
  selectedToken: SupportedLpToken;
  handleClose: () => any;
}) => {
  const classes = useStyles();

  const slectedToken = getToken(selectedToken);

  const addresses = useAddresses();

  const user = useAppSelector(selectLpVaultUser);
  const deposited = new BigNumber(user[selectedToken].deposited);

  const isPendingWithdrawal = usePendingTransactions(
    addresses.liquidityprovidervault,
    [LiquidityProviderVaultService.prototype.withdraw.name]
  );

  const { contracts } = useContext(ContractsContext);

  const dispatch = useDispatch();

  const { openConfirmation, closeConfirmation } = useConfirmationModal();

  const withdraw = (tokenId: SupportedLpToken) => {
    const token = getToken(tokenId);

    if (contracts) {
      openConfirmation();
      const lpVault = contracts.liquidityprovidervault.contract();
      lpVault
        .withdraw(addresses[tokenId], "Withdraw " + token.symbol, tokenId)
        .then(() => {
          closeConfirmation();
          handleClose();
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
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Image
                  src={getToken(selectedToken).picture}
                  alt={getToken(selectedToken).symbol}
                  width="25"
                  height="25"
                />
                <Typography className={classes.inputSymbol}>
                  {getToken(selectedToken).symbol}
                </Typography>
              </Box>
              <Typography variant="h6">
                {deposited.toFixed(slectedToken.displayedDecimals)}
              </Typography>
            </Box>
            {isPendingWithdrawal ? (
              <Box display="flex" width="100%" justifyContent="center" mt={4}>
                <Typography
                  variant="body1"
                  style={{ textTransform: "uppercase", lineHeight: 1.7 }}
                >
                  Withdrawing
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
                variant="outlined"
                size="large"
                fullWidth
                type="submit"
                className={classes.submit}
                disabled={isPendingWithdrawal}
                onClick={() => withdraw(selectedToken)}
              >
                Withdraw
              </Button>
            )}
          </Box>
        </div>
      </Box>
    </Dialog>
  );
};

export default WithdrawForm;

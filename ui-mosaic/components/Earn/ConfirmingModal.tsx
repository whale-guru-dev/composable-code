import {
  Typography,
  CircularProgress,
  DialogProps,
  Box,
  Theme,
} from "@mui/material";
import Button from "../Button";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Modal from "../Modal";
import { Status } from "./Vaults/types";
import ApproveStepper from "./Vaults/ApproveStepper";
import { liquidity_rounded, withdraw_rounded } from "@/assets/icons/common";

type ConfirmingModalProps = {
  status: Status;
  setStatus: (status: Status) => any;
  title: string;
  msg: string;
  isWithdraw?: boolean;
} & DialogProps;

const ConfirmingModal = ({
  status,
  setStatus,
  open,
  onClose,
  msg,
  title,
  isWithdraw,
}: ConfirmingModalProps) => {
  const endLabel = () => {
    return isWithdraw
      ? "Withdraw"
      : status == Status.Approving
      ? "Deposit"
      : "Provide liquidity";
  };

  const handleAction = () => {
    setStatus(Status.Confirming);
  };

  const cancelAction = () => {
    setStatus(Status.NotStarted);
  };
  return (
    <Modal.Container open={open} onClose={onClose}>
      <Modal.Content sx={{ textAlign: "center" }}>
        {status == Status.Approving ? (
          <CheckCircleOutlinedIcon
            sx={{
              width: 80,
              height: 80,
              color: (theme: Theme) => theme.palette.text.secondary,
            }}
          />
        ) : (
          <CircularProgress size="6rem" />
        )}
        <Typography variant="h5" mt={4} mb={5}>
          {title}
        </Typography>
        <Typography variant="h6" mb={2} color="text.secondary">
          {msg}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Confirm this transaction in your wallet.
        </Typography>
        {status != Status.Confirming && (
          <ApproveStepper
            status={status}
            endLabel={endLabel()}
            endIcon={isWithdraw ? withdraw_rounded : liquidity_rounded}
            mt={6}
          />
        )}
        {status == Status.Approved && (
          <>
            <Box mt={6}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={handleAction}
              >
                {isWithdraw ? "Withdraw" : "Provide liquitidy"}
              </Button>
            </Box>

            <Box mt={2}>
              <Button
                variant="phantom"
                fullWidth
                size="small"
                sx={{
                  color: (theme: Theme) => theme.palette.primary.main,
                }}
                onClick={cancelAction}
              >
                Cancel
              </Button>
            </Box>
          </>
        )}
      </Modal.Content>
    </Modal.Container>
  );
};

ConfirmingModal.defaultProps = {
  msg: "Depositing liquidity.",
};

export default ConfirmingModal;

export const SimpleConfirmingModal = ({ open }: DialogProps) => {
  return (
    <Modal.Container open={open}>
      <Modal.Content sx={{ textAlign: "center" }}>
        <Typography variant="h5" mt={4} mb={5}>
          Confirming transaction
        </Typography>
        <CircularProgress size="6rem" />
      </Modal.Content>
    </Modal.Container>
  );
};

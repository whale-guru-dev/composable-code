import { MouseEvent } from "react";
import { Typography, DialogProps, Box, Theme } from "@mui/material";
import Image from "next/image";
import Modal from "../Modal";
import Button from "../Button";
import { useRouter } from "next/router";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { metamask } from "@/assets/wallets";
import CloseIcon from "@mui/icons-material/Close";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";

type CompleteModalProps = {
  token?: Token;
  portionEnabled?: boolean;
} & DialogProps;

const CompleteModal = ({
  token,
  portionEnabled,
  open,
  onClose,
}: CompleteModalProps) => {
  const router = useRouter();
  const goToEarnPage = () => {
    router.push("/earn");
  };

  const openTransactionDetails = (event: React.SyntheticEvent) => {
    if (onClose) onClose(event, "escapeKeyDown");
  };

  return (
    <Modal.Container open={open} onClose={onClose}>
      <Modal.Content
        sx={{
          textAlign: "center",
          width: 500,
          xs: {
            width: "100%",
          },
          padding: 0,
        }}
      >
        <CheckCircleOutlinedIcon
          sx={{
            width: 80,
            height: 80,
            color: (theme: Theme) => theme.palette.text.secondary,
          }}
        />

        <Typography variant="h5" mt={4}>
          Transaction submitted
        </Typography>

        <Box mt={8}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={openTransactionDetails}
          >
            Go to transaction detail
          </Button>
        </Box>

        {token && (
          <Box mt={2}>
            <Button variant="outlined" color="primary" fullWidth>
              <Image src={metamask} alt="Metamask" width={24} height={24} />
              &nbsp;&nbsp;Add {token.symbol}
              {portionEnabled && " and MATIC"} to Metamask
            </Button>
          </Box>
        )}

        <Box mt={4}>
          <Button
            variant="phantom"
            sx={{
              color: (theme: Theme) => theme.palette.primary.main,
            }}
            fullWidth
            onClick={goToEarnPage}
          >
            {portionEnabled ? "Back to Swap" : "Back to Earn"}
          </Button>
        </Box>
      </Modal.Content>
    </Modal.Container>
  );
};

export default CompleteModal;

export const SimpleCompleteModal = ({ open, onClose }: DialogProps) => {
  const router = useRouter();
  
  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (onClose) {
      onClose(e, "escapeKeyDown");
    }
  };

  return (
    <Modal.Container open={open}>
      <Modal.Content
        sx={{
          textAlign: "center",
          width: 500,
          xs: {
            width: "100%",
          },
          padding: 0,
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 45,
            right: 45,
            cursor: "pointer",
          }}
          component="div"
          onClick={handleClose}
        >
          <CloseIcon />
        </Box>
        <Typography variant="h5" mt={4}>
          Transaction confirmed
        </Typography>

        <Box mt={8}>
          <Button variant="contained" color="primary" fullWidth onClick={() => router.push("/earn")}>
            Go to Mosaic Phase 2
          </Button>
        </Box>
      </Modal.Content>
    </Modal.Container>
  );
};

import { MouseEvent, useMemo, useState } from "react";
import {
  Typography,
  DialogProps,
  Box,
  OutlinedInput,
  InputAdornment,
  Grid,
  Theme,
} from "@mui/material";
import { BigNumber } from "bignumber.js";
import Image from "next/image";
import Modal from "../Modal";
import Button from "../Button";
import { allowedToMigrateTokenSymbols, Token } from "@/defi/tokenInfo";
import CloseIcon from "@mui/icons-material/Close";

type StepTextProps = {
  value: number;
  active?: boolean;
};

export const StepText = ({ value, active }: StepTextProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? "primary.main" : "transparent",
        border: "1px solid",
        borderColor: active ? "primary.main" : "primary.main",
        borderRadius: "50%",
        width: 24,
        height: 24,
      }}
    >
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
};

type MigrateModalProps = {
  token: Token;
  handleWithdraw: () => void;
} & DialogProps;

const MigrateModal = ({
  token,
  open,
  onClose,
  handleWithdraw,
}: MigrateModalProps) => {
  const [value, setValue] = useState(new BigNumber(456));
  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (onClose) {
      onClose(e, "escapeKeyDown");
    }
  };

  const allowedToDeposit = useMemo(
    () => allowedToMigrateTokenSymbols.includes(token.symbol),
    [token.symbol]
  )

  return (
    <Modal.Container
      open={open}
      PaperProps={{
        sx: {
          maxWidth: 1000,
        },
      }}
    >
      <Modal.Content
        sx={{
          textAlign: "center",
          width: 800,
          maxWidth: "100%",
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
          {allowedToDeposit ? "Migrate liquidity to Mosaic Phase 2" : "Withdraw liqudity"}
        </Typography>
        <Box mt={8} />
        <OutlinedInput
          fullWidth
          startAdornment={
            <InputAdornment position="start">
              <Box display="flex">
                <Image
                  src={
                    token.picture
                      ? token.picture
                      : `/tokens/${token.symbol.toLowerCase()}.png`
                  }
                  alt={token.symbol}
                  width={24}
                  height={24}
                />
                <Typography ml={1}>{token?.symbol}</Typography>
              </Box>
            </InputAdornment>
          }
          value={value}
          onChange={(e) => setValue(new BigNumber(e.target.value))}
        />
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item md={allowedToDeposit ? 6 : 12} sm={allowedToDeposit ? 6 : 12} xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleWithdraw}
              >
                Withdraw
              </Button>
            </Grid>
            {allowedToDeposit &&
            <Grid item md={6} sm={6} xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={true}
              >
                Deposit
              </Button>
            </Grid>
            }
          </Grid>
        </Box>
        {allowedToDeposit &&
        <Box
          mt={4}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
            padding: (theme: Theme) => theme.spacing(2, 4),
            background: (theme: Theme) => theme.palette.other.background.n4,
            borderRadius: 1,
          }}
        >
          <StepText active={true} value={1} />
          <Box px={1}>
            <Typography variant="body2">
              Withdraw liquidity from Phase 1
            </Typography>
          </Box>
          <Box
            sx={{
              height: "1px",
              flexGrow: 1,
              mx: 1,
              backgroundColor: "#bdbdbd",
            }}
          />
          <StepText active={false} value={2} />
          <Box px={1}>
            <Typography variant="body2">
              Deposit liquidity to Phase 2
            </Typography>
          </Box>
        </Box>
        }
      </Modal.Content>
    </Modal.Container>
  );
};

export default MigrateModal;

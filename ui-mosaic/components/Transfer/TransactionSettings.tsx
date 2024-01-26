import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  Typography,
  useTheme,
} from "@mui/material";

import React, { useCallback, useEffect, useState } from "react";
import CustomizedTooltip from "./CustomizedTooltip";
import { Dialog } from "../PreReview/Dialog";
import { useAppDispatch } from "store";
import { setSlippage as storeSlippage, setDeadline as storeDeadline } from "@/store/transactionSettingsOptions/slice";
import { useTransactionSettingsOptions } from "store/transactionSettingsOptions/hooks";

const deadlineOptions = {
  5: {
    label: "5 Minutes",
    value: 5,
  },
  15: {
    label: "15 minutes",
    value: 15,
  },
  30: {
    label: "30 minutes",
    value: 30,
  },
  60: {
    label: "1 hour",
    value: 60,
  },
} as const;

const slippageNumberOptions = [0.5, 0.1, 1]
const toleranceOptions = [...slippageNumberOptions, "custom"]

const slippageToPreset = (slippage: number) => slippageNumberOptions.includes(slippage) ? slippage : "custom";

type DeadlineType = keyof typeof deadlineOptions;

const minSlippageLimit = 0.1;
const maxSlippageLimit = 3;
const minTransactionDeadlineLimit = 5;

export type TransactionSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
};

const CustomizedMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  textAlign: "center",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

type SlippageTolerancePreset = typeof toleranceOptions[number]

const TransactionSettings = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
}: TransactionSettingsProps) => {
  const theme = useTheme();
  const [validSlippage, setValidSlippage] = useState(true);
  const [validDeadline, setValidDeadline] = useState(true);

  const dispatch = useAppDispatch();

  const {
    slippage: storageSlippage,
    deadline: storageDeadline,
  } = useTransactionSettingsOptions();

  const [slippage, setSlippage] = useState<number>(storageSlippage);
  const [slippageTolerancePreset, setSlippageTolerancePreset] = useState<SlippageTolerancePreset>(slippageToPreset(storageSlippage));

  const [deadline, setDeadline] = useState<number>(storageDeadline);

  useEffect(() => {
    if (slippage < minSlippageLimit || slippage > maxSlippageLimit) {
      setValidSlippage(false);
    } else {
      setValidSlippage(true);
    }
  }, [slippage]);
  useEffect(() => {
    if (deadline < minTransactionDeadlineLimit) {
      setValidDeadline(false);
    } else {
      setValidDeadline(true);
    }
  }, [deadline]);

  const onSaveInternal = useCallback(
    () => {
      dispatch(storeSlippage(slippage))
      dispatch(storeDeadline(deadline))
      onSave();
    },
    [slippage, deadline, dispatch, onSave]
  );

  const onDiscardInternal = useCallback(
    () => {
      setSlippage(storageSlippage);
      setSlippageTolerancePreset(slippageToPreset(storageSlippage));
      setDeadline(storageDeadline);
      onDiscard();
    },
    [onDiscard, storageSlippage, storageDeadline]
  );

  const onCloseInternal = useCallback(
    () => {
      onDiscardInternal();
      onClose();
    },
    [onDiscardInternal, onClose]
  );

  const onBackToDefaultSlippage = useCallback(
    () => {
      setSlippage(0.5);
      setSlippageTolerancePreset(slippageToPreset(0.5));
    },
    []
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onCloseInternal}
      PaperProps={{
        sx: {
          maxWidth: 440,
        },
      }}
      sx={{
        backdropFilter: "blur(32px)",
        backgroundColor: "other.background.n6",
      }}
    >
      <Box>
        <Typography variant='h5' textAlign={"center"}>
          Transaction settings
        </Typography>
        <Box mb={5} />
        <Box mb={9} />
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
        >
          <Box display={"flex"} alignItems={"center"} gap={2.5}>
            <Typography mr={1}>Slippage tolerance</Typography>
            <CustomizedTooltip title='Slippage tolerance may vary depending on the token´s rarity. The rarest, the bigger will be the allowed slippage. Your transaction will revert if the price changes unfavorably by more than this percantage.' />
          </Box>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={onBackToDefaultSlippage}
          >
            <Typography
              sx={{
                color:
                  slippage === 0.5
                    ? "text.secondary"
                    : "primary.light",
              }}
            >
              Back to default
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            marginBottom: theme.spacing(1.5),
          }}
        >
          <FormControl fullWidth>
            <Select
              value={slippageTolerancePreset}
              label='Slippage tolerance'
              onChange={event => {
                setSlippageTolerancePreset(event.target.value as SlippageTolerancePreset)
                if (typeof event.target.value !== "string") {
                  setSlippage(event.target.value)
                }
              }}
              >
              {toleranceOptions.map((value, index) => {
                return <CustomizedMenuItem key={index} value={value}>{value}</CustomizedMenuItem>
              })}
            </Select>
          </FormControl>
        </Box>
        {slippageTolerancePreset === "custom" && (
          <>
            <OutlinedInput
              type='number'
              fullWidth
              disabled={slippageTolerancePreset !== "custom"}
              error={!validSlippage}
              sx={{
                borderColor: !validSlippage ? "error.main" : "",
                color: !validSlippage ? "error.main" : "",
              }}
              endAdornment={<InputAdornment position='end'>%</InputAdornment>}
              value={slippage}
              onChange={e => setSlippage(parseFloat(e.target.value))}
              placeholder={"Type percentage"}
            />
            {!validSlippage && slippage < minSlippageLimit && (
              <Typography mt={1} color='error.main'>
                Minimum slippage is {minSlippageLimit}%
              </Typography>
            )}
            {!validSlippage && slippage > maxSlippageLimit && (
              <Typography mt={1} color='error.main'>
                Maximum slippage is {maxSlippageLimit}%
              </Typography>
            )}
          </>
        )}
        <Box
          mt={8}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
        >
          <Box display={"flex"} alignItems={"center"} gap={2.5}>
            <Typography mr={1}>Transaction deadline</Typography>
            <CustomizedTooltip title='Your transaction will revert if it is pending more than this period of time.' />
          </Box>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => setDeadline(minTransactionDeadlineLimit)}
          >
            <Typography
              sx={{
                color:
                  deadline == minTransactionDeadlineLimit
                    ? "text.secondary"
                    : "primary.light",
              }}
            >
              Back to default
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            marginBottom: theme.spacing(1.5),
          }}
        >
          <FormControl fullWidth>
            <Select
              value={deadline}
              label='Transaction deadline'
              onChange={event => setDeadline(event.target.value as number)}
            >
              {Object.values(deadlineOptions).map(({ label, value }, index) => (
                <CustomizedMenuItem key={index} value={value}>
                  {label}
                </CustomizedMenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={4} />
        <Box marginBottom={4}>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            onClick={onSaveInternal}
            disabled={
              validSlippage &&
              ((slippage >= minSlippageLimit && slippage <= maxSlippageLimit) ||
                slippageTolerancePreset != "custom")
                ? false
                : true
            }
          >
            <Typography variant='body2'>Save changes</Typography>
          </Button>
        </Box>
        <Box>
          <Button fullWidth variant='text' color='primary' onClick={onDiscardInternal}>
            <Typography variant='body2' color='primary'>
              Cancel
            </Typography>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TransactionSettings;

import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  BoxProps,
  InputAdornment,
  Theme,
  Typography,
  alpha,
  CircularProgress,
} from "@mui/material";
import BigNumberInput from "@/components/BigNumberInput";
import BigNumber from "bignumber.js";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { Balance } from "@integrations-lib/interaction";

type Props = {
  token: Token;
  value: BigNumber;
  isValid: (value: boolean) => any;
  setter: (value: BigNumber) => any;
  label?: string;
  balanceLabel?: string;
  helperText?: string;
  maxDecimals?: number;
  balance: Balance;
  maxValue: BigNumber;
  minValue?: BigNumber;
  adornmentStart?: JSX.Element;
  adornmentEnd?: JSX.Element;
  disabled?: boolean;
  forceMaxWidth?: boolean;
  forceDisable?: boolean;
  placeholder?: string;
  tokenDecimals: number;
} & BoxProps;

const AmountInput = ({
  token,
  value,
  isValid,
  setter,
  label,
  balanceLabel,
  helperText,
  adornmentStart,
  adornmentEnd,
  maxDecimals,
  balance,
  maxValue,
  minValue,
  disabled,
  forceMaxWidth,
  forceDisable,
  placeholder,
  tokenDecimals,
  ...rest
}: Props) => {
  const handleMax = () => {
    setter(new BigNumber(maxValue));
  };

  const insufficientFunds = useCallback(
    () => balance?.value ? balance.value.toNumber() < value.toNumber() && value.toNumber() > 0 : true,
    [balance, value]
  );

  const lessThanMinimum = useCallback(
    () => minValue && minValue.toNumber() > value.toNumber() && value.toNumber() > 0,
    [minValue, value]
  );

  useEffect(() => {
    isValid && isValid(!insufficientFunds() && !lessThanMinimum());
  }, [isValid, insufficientFunds, lessThanMinimum]);

  return (
    <Box {...rest}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: (theme: Theme) => theme.spacing(2),
        }}
      >
        {label && <Typography component="div">{label}</Typography>}
        <Box>
          {balanceLabel && (
            <Typography
              component="span"
              sx={{
                marginLeft: (theme: Theme) => theme.spacing(0.5),
                color: (theme: Theme) => theme.palette.text.secondary,
                marginRight: (theme: Theme) => theme.spacing(0.5),
              }}
            >
              {balanceLabel}:
            </Typography>
          )}
          <Typography component="span">
            <span>
              {(balance?.isLoading && <CircularProgress size={16} />) ||
                balance?.value?.toFixed(tokenDecimals) ||
                "-"}
            </span>{" "}
            <span>{token.symbol}</span>
          </Typography>
        </Box>
      </Box>
      <Box>
        <BigNumberInput
          placeholder={placeholder}
          value={value}
          setter={setter}
          isValid={isValid}
          maxValue={maxValue}
          forceMaxWidth
          maxDecimals={token.decimals}
          error={insufficientFunds() || lessThanMinimum()}
          adornmentStart={
            <InputAdornment position="start">
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    display: "flex",
                    marginRight: (theme: Theme) => theme.spacing(2),
                    width: 24,
                  }}
                >
                  <Image
                    src={token.image}
                    alt={token.symbol}
                    width={24}
                    height={24}
                  />
                </Box>
                <Box>
                  <Typography variant="body2">{token.symbol}</Typography>
                </Box>
              </Box>
            </InputAdornment>
          }
          adornmentEnd={
            <InputAdornment position="end">
              <Box
                sx={{
                  color: (theme: Theme) => theme.palette.primary.main,
                  fontSize: "1rem",
                  lineHeight: "150%",
                  cursor: "pointer",
                  padding: (theme: Theme) => theme.spacing(1, 2),
                  "&:hover": {
                    borderRadius: 1,
                    background: (theme: Theme) =>
                      alpha(theme.palette.primary.main, 0.07),
                  },
                }}
                onClick={handleMax}
              >
                MAX
              </Box>
            </InputAdornment>
          }
        />
      </Box>
      {helperText && !insufficientFunds() && !lessThanMinimum() && (
        <Typography mt={2} color="text.secondary" textAlign="right">
          {helperText}
        </Typography>
      )}

      {insufficientFunds() && (
        <Typography color="error.main" mt={2}>
          Insufficient funds
        </Typography>
      )}
      {lessThanMinimum() && (
        <Typography color="error.main" mt={2}>
          The minimum amount is {minValue?.toFixed()} {token.symbol}
        </Typography>
      )}
    </Box>
  );
};

export default AmountInput;

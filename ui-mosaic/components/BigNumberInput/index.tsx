import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import {
  InputAdornment,
  InputBaseComponentProps,
  OutlinedInput,
  Theme,
  Typography,
} from "@mui/material";

const FLOAT_NUMBER: RegExp = /^\d+(\.\d+)?$/;
const NUMBERS_ONE_DOT: RegExp = /^\d+\.$/;

type BigNumberInputProps = {
  value: BigNumber;
  isValid: (value: boolean, err?: string) => any;
  setter: (value: BigNumber) => any;
  label?: string;
  maxDecimals?: number;
  minValue?: BigNumber;
  maxValue?: BigNumber;
  adornmentStart?: JSX.Element;
  adornmentEnd?: JSX.Element;
  disabled?: boolean;
  forceMaxWidth?: boolean;
  forceDisable?: boolean;
  error?: boolean;
} & InputBaseComponentProps;

function handleValidation(
  maxDec: number,
  maxValue: BigNumber | undefined,
  setStringValue: (value: ((prevState: string) => string) | string) => void,
  setter: (value: BigNumber) => any,
  minValue: BigNumber | undefined,
  isValid: (value: boolean, optionalMessage?: string) => any
) {
  function validate(value: string): [boolean, string] {
    if (value.match(FLOAT_NUMBER)) {
      const bigNumberValue = new BigNumber(value);
      // has more decimals than allowed
      const hasMoreDecimals = bigNumberValue.decimalPlaces() > maxDec;
      const isBiggerThanMax =
        (maxValue && bigNumberValue.isGreaterThan(maxValue)) || false;
      const isSmallerThanMin =
        (minValue && bigNumberValue.isLessThan(minValue)) || false;
      const isZero = bigNumberValue.isEqualTo(0);

      if (hasMoreDecimals) {
        return [false, `Maximum allowed decimals is ${maxDec}`];
      } else if (isBiggerThanMax) {
        return [false, `Maximum value is ${maxValue?.toFixed()}`];
      } else if (isSmallerThanMin) {
        return [false, `Value should be more than ${minValue?.toFixed()}`];
      } else if (isZero) {
        return [false, "Value is required"];
      } else {
        return [true, ""];
      }
    }

    return [false, "Invalid value"];
  }

  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    const [isNumberValid, errorMessage] = validate(newValue);
    if (!isNaN(Number(newValue))) {
      setStringValue(newValue);
    }

    if (isNumberValid) {
      setter(new BigNumber(newValue));
    }

    isValid?.(isNumberValid, errorMessage);
  };
}

export const BigNumberInput = ({
  value,
  isValid,
  setter,
  label,
  adornmentStart,
  adornmentEnd,
  maxDecimals,
  minValue,
  maxValue,
  disabled,
  forceMaxWidth,
  forceDisable,
  error,
  placeholder,
  sx,
  ...restInputBaseProps
}: BigNumberInputProps) => {
  const maxDec = maxDecimals ? maxDecimals : 18;

  const [stringValue, setStringValue] = useState(value.toFixed());
  useEffect(() => {
    setStringValue(value.toFixed());
    isValid?.(true, "");
  }, [value]);

  return (
    <>
      {label && (
        <Typography
          sx={{
            paddingLeft: (theme: Theme) => theme.spacing(1),
            paddingBottom: (theme: Theme) => theme.spacing(0.5),
          }}
        >
          {label}
        </Typography>
      )}
      <OutlinedInput
        placeholder={placeholder}
        sx={{
          maxWidth: !forceMaxWidth ? 420 : undefined,
          borderColor: (theme: Theme) =>
            error ? theme.palette.error.main : undefined,
          "&:hover": {
            borderColor: "primary.main",
          },

          ...sx,
        }}
        type="text"
        fullWidth
        value={stringValue}
        color={error ? "error" : "primary"}
        startAdornment={
          adornmentStart ? (
            <InputAdornment position="end">{adornmentStart}</InputAdornment>
          ) : (
            adornmentStart
          )
        }
        endAdornment={
          adornmentEnd ? (
            <InputAdornment position="end">{adornmentEnd}</InputAdornment>
          ) : (
            adornmentEnd
          )
        }
        onChange={handleValidation(
          maxDec,
          maxValue,
          setStringValue,
          setter,
          minValue,
          isValid
        )}
        disabled={disabled}
        inputProps={{
          disabled: forceDisable,
          error,
          sx: {
            color: (theme: Theme) =>
              error ? theme.palette.error.main : theme.palette.text.secondary,
            borderColor: (theme: Theme) =>
              error ? theme.palette.error.main : undefined,
          },
          ...restInputBaseProps,
        }}
      />
    </>
  );
};

export default BigNumberInput;

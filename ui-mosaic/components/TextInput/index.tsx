import React from "react";
import { OutlinedInput, Typography, OutlinedInputProps } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  input: {
    // fontSize: "24px",
    // lineHeight: "24px",
    // color: theme.palette.text.secondary,
  },
}));

export const TextInput = ({
  label,
  value,
  setValue,
  ...rest
}: { value: string; setValue: (s: string) => any; label: string } & Omit<
  OutlinedInputProps,
  "type" | "fullWidth" | "value" | "onChange" | "inputProps"
>) => {
  const classes = useStyles();

  return (
    <>
      {label ? (
        <Typography className={classes.label}>{label}</Typography>
      ) : null}
      <OutlinedInput
        type="text"
        fullWidth
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputProps={{
          className: classes.input,
        }}
        {...rest}
      />
    </>
  );
};

export default TextInput;

import * as React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@/components/Button";
import {
  alpha,
  ButtonProps as MuiButtonProps,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";

interface SelectButtonProps extends MuiButtonProps {
  picture: string;
  text: string;
  open: boolean;
  extraStyle?: object;
}

const SelectButton = ({
  picture = "",
  text = "",
  open = false,
  extraStyle,
  ...rest
}: SelectButtonProps) => {
  const theme = useTheme();
  return (
    <Button
      variant="outlined"
      color="primary"
      transparent
      sx={{
        minWidth: "unset",
        width: "100%",
        height: 52,
        px: 3,
        borderColor: alpha(
          theme.palette.background.default,
          theme.opacity.lighter
        ),
        justifyContent: "space-between",
        ...extraStyle,
      }}
      {...rest}
    >
      <Image src={picture} alt={"image"} width={24} height={24} />
      <Typography>{text}</Typography>
      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </Button>
  );
};

export default SelectButton;

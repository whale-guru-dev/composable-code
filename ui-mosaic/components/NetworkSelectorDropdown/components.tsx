import * as React from "react";
import { styled } from "@mui/material/styles";
import Popper from "@mui/material/Popper";
import { autocompleteClasses } from "@mui/material/Autocomplete";
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

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

const StyledAutocompletePopper = styled("div")(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: "none",
    margin: 0,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    maxHeight: 300,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    maxHeight: "unset",
    [`& .${autocompleteClasses.option}`]: {
      [`&.${autocompleteClasses.focused}`]: {
        backgroundColor: theme.palette.primary.dark,
      },
      minHeight: "auto",
      alignItems: "flex-start",
      padding: theme.spacing(1.5, 3),
      '&[aria-selected="true"]': {
        backgroundColor: theme.palette.primary.main,
      },
      '&[data-focus="true"], &[data-focus="true"][aria-selected="true"]': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    // position: "relative",
  },
}));

export const PopperComponent = (props: PopperComponentProps) => {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <StyledAutocompletePopper {...other} />;
};

export const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${theme.palette.other.border.d1}`,
  borderRadius: 8,
}));

interface SelectButtonProps extends MuiButtonProps {
  picture: string;
  text: string;
  open: boolean;
}

const SelectButtonCom = ({
  picture = "",
  text = "",
  open = false,
  ref,
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
      }}
      ref={ref}
      {...rest}
    >
      <Image src={picture} alt={"image"} width={24} height={24} />
      <Typography>{text}</Typography>
      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </Button>
  );
};

export const SelectButton = SelectButtonCom;

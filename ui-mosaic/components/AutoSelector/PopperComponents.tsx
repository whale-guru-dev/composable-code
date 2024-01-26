import * as React from "react";
import { styled } from "@mui/material/styles";
import Popper from "@mui/material/Popper";
import { autocompleteClasses } from "@mui/material/Autocomplete";

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

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

export const PopperComponent = (props: PopperComponentProps) => {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <StyledAutocompletePopper {...other} />;
};

export const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${theme.palette.other.border.d1}`,
  borderRadius: 8,
}));

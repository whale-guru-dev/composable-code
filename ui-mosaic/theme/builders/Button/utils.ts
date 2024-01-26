import { alpha } from "@mui/material/styles";
import { Theme } from "@mui/material";
import { ColorType } from "@/types/types";

export const containedButtonStyleWithColorProps = (
  theme: Theme,
  color: ColorType = "primary"
) => {
  return {
    backgroundColor: theme.palette[color].light,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette[color].dark,
      color: theme.palette.text.primary,
    },
    "&.Mui-disabled": {
      background: alpha(theme.palette[color].main, theme.opacity.light),
      color: theme.palette.text.secondary,
    },
  };
};

export const outlinedButtonStyleWithColorProps = (
  theme: Theme,
  color: ColorType = "primary"
) => {
  return {
    borderColor: theme.palette[color].main,
    color: theme.palette.text.primary,
    "&:hover": {
      borderColor: theme.palette[color].main,
      color: theme.palette.text.primary,
      background: alpha(theme.palette[color].main, theme.opacity.main),
    },
    "&.Mui-disabled": {
      borderColor: theme.palette[color].main,
      color: theme.palette.text.primary,
      opacity: theme.opacity.light,
    },
  };
};

export const textButtonStyleWithColorProps = (
  theme: Theme,
  color: ColorType = "primary"
) => {
  return {
    color: theme.palette.text.primary,
    "&:hover": {
      background: alpha(theme.palette[color].main, theme.opacity.main),
      color: theme.palette.text.primary,
    },
    "&.Mui-disabled": {
      color: theme.palette.text.secondary,
    },
  };
};

export const phantomButtonStyleWithColorProps = (
  theme: Theme,
  color: ColorType = "primary"
) => {
  return {
    color: theme.palette.text.primary,
    "&:hover": {
      background: alpha(theme.palette[color].main, theme.opacity.main),
      color: theme.palette.text.primary,
    },
    "&.Mui-disabled": {
      color: theme.palette.text.secondary,
    },
  };
};

export const buttonStyleWithSizeProps = (
  theme: Theme,
  fontSize: string,
  fontSizeMobile: string,
  padding: string,
  paddingMobile: string
) => {
  return {
    fontSize: fontSize,
    padding: padding,
    [theme.breakpoints.down("sm")]: {
      fontSize: fontSizeMobile,
      padding: paddingMobile,
    },
  };
};

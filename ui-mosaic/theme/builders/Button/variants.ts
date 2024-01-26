import { Theme } from "@mui/material";
import {
  buttonStyleWithSizeProps,
  containedButtonStyleWithColorProps,
  outlinedButtonStyleWithColorProps,
  phantomButtonStyleWithColorProps,
  textButtonStyleWithColorProps,
} from "./utils";

const buttonVariants = (baseTheme: Theme) => {
  return [
    // start of customizing the outlined variant
    {
      props: { variant: "outlined" },
      style: outlinedButtonStyleWithColorProps(baseTheme),
    },
    {
      props: { variant: "outlined", color: "secondary" },
      style: outlinedButtonStyleWithColorProps(baseTheme, "secondary"),
    },
    {
      props: { variant: "outlined", color: "success" },
      style: outlinedButtonStyleWithColorProps(baseTheme, "success"),
    },
    {
      props: { variant: "outlined", color: "info" },
      style: outlinedButtonStyleWithColorProps(baseTheme, "info"),
    },
    {
      props: { variant: "outlined", color: "warning" },
      style: outlinedButtonStyleWithColorProps(baseTheme, "warning"),
    },
    {
      props: { variant: "outlined", color: "error" },
      style: outlinedButtonStyleWithColorProps(baseTheme, "error"),
    },
    // end of customizing the outlined variant

    // start of customizing the contained variant
    {
      props: { variant: "contained" },
      style: containedButtonStyleWithColorProps(baseTheme),
    },
    {
      props: { variant: "contained", color: "secondary" },
      style: containedButtonStyleWithColorProps(baseTheme, "secondary"),
    },
    {
      props: { variant: "contained", color: "success" },
      style: containedButtonStyleWithColorProps(baseTheme, "success"),
    },
    {
      props: { variant: "contained", color: "info" },
      style: containedButtonStyleWithColorProps(baseTheme, "info"),
    },
    {
      props: { variant: "contained", color: "warning" },
      style: containedButtonStyleWithColorProps(baseTheme, "warning"),
    },
    {
      props: { variant: "contained", color: "error" },
      style: containedButtonStyleWithColorProps(baseTheme, "error"),
    },
    // end of customizing the contained variant

    // start of customizing the text variant
    {
      props: { variant: "text" },
      style: textButtonStyleWithColorProps(baseTheme),
    },
    {
      props: { variant: "text", color: "secondary" },
      style: textButtonStyleWithColorProps(baseTheme, "secondary"),
    },
    {
      props: { variant: "text", color: "success" },
      style: textButtonStyleWithColorProps(baseTheme, "success"),
    },
    {
      props: { variant: "text", color: "info" },
      style: textButtonStyleWithColorProps(baseTheme, "info"),
    },
    {
      props: { variant: "text", color: "warning" },
      style: textButtonStyleWithColorProps(baseTheme, "warning"),
    },
    {
      props: { variant: "text", color: "error" },
      style: textButtonStyleWithColorProps(baseTheme, "error"),
    },
    // end of customizing the text variant

    // start of adding the phantom variant
    {
      props: { variant: "phantom" },
      style: phantomButtonStyleWithColorProps(baseTheme),
    },
    {
      props: { variant: "phantom", color: "secondary" },
      style: phantomButtonStyleWithColorProps(baseTheme, "secondary"),
    },
    {
      props: { variant: "phantom", color: "success" },
      style: phantomButtonStyleWithColorProps(baseTheme, "success"),
    },
    {
      props: { variant: "phantom", color: "info" },
      style: phantomButtonStyleWithColorProps(baseTheme, "info"),
    },
    {
      props: { variant: "phantom", color: "warning" },
      style: phantomButtonStyleWithColorProps(baseTheme, "warning"),
    },
    {
      props: { variant: "phantom", color: "error" },
      style: phantomButtonStyleWithColorProps(baseTheme, "error"),
    },
    // end of adding the phantom variant

    // start of customizing size variant
    {
      props: { size: "large" },
      style: buttonStyleWithSizeProps(
        baseTheme,
        "1.25rem",
        "1rem",
        baseTheme.spacing(2.25, 8),
        baseTheme.spacing(2.125, 7)
      ),
    },
    {
      props: { size: "medium" },
      style: buttonStyleWithSizeProps(
        baseTheme,
        "1rem",
        "0.875rem",
        baseTheme.spacing(1.875, 6.5),
        baseTheme.spacing(1.75, 6)
      ),
    },
    {
      props: { size: "small" },
      style: buttonStyleWithSizeProps(
        baseTheme,
        "1rem",
        "0.875rem",
        baseTheme.spacing(1.125, 5),
        baseTheme.spacing(1.25, 5)
      ),
    },
    // end of customizing size variant
  ];
};

export default buttonVariants;

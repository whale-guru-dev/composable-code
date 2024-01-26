import { Theme } from "@mui/material";

export const baseTypograhpy = (baseTheme: Theme) => {
  return {
    transform: "sentence",
    textTransform: "unset",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    hero: {
      fontSize: "9rem",
      lineHeight: baseTheme.lineHeight.small,
      fontFamily: baseTheme.fontFamily.secondary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "6rem",
      },
    },
    h1: {
      fontSize: "6rem",
      lineHeight: baseTheme.lineHeight.small,
      fontFamily: baseTheme.fontFamily.secondary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "4.5rem",
      },
    },
    h2: {
      fontSize: "4.5rem",
      lineHeight: baseTheme.lineHeight.small,
      fontFamily: baseTheme.fontFamily.secondary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "4rem",
      },
    },
    h3: {
      fontSize: "4rem",
      lineHeight: baseTheme.lineHeight.small,
      fontFamily: baseTheme.fontFamily.secondary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "3rem",
      },
    },
    h4: {
      fontSize: "3rem",
      lineHeight: baseTheme.lineHeight.medium,
      fontFamily: baseTheme.fontFamily.secondary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "2rem",
      },
    },
    h5: {
      fontSize: "2rem",
      lineHeight: baseTheme.lineHeight.medium,
      fontFamily: baseTheme.fontFamily.primary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "1.5rem",
      },
    },
    h6: {
      fontSize: "1.5rem",
      lineHeight: baseTheme.lineHeight.large,
      fontFamily: baseTheme.fontFamily.primary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "1.25rem",
      },
    },
    subtitle1: {
      fontSize: "1.25rem",
      lineHeight: baseTheme.lineHeight.large,
      fontFamily: baseTheme.fontFamily.primary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "1.125rem",
      },
    },
    body1: {
      fontSize: "1.25rem",
      lineHeight: baseTheme.lineHeight.large,
      fontFamily: baseTheme.fontFamily.primary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: baseTheme.fontFamily.primary,
      },
    },
    body2: {
      fontSize: "1rem",
      lineHeight: "25.6px",
      fontFamily: baseTheme.fontFamily.primary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "0.875rem",
      },
    },
    button: {
      fontSize: "1rem",
      lineHeight: baseTheme.lineHeight.large,
      fontFamily: baseTheme.fontFamily.primary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "0.875rem",
      },
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: baseTheme.lineHeight.large,
      fontFamily: baseTheme.fontFamily.primary,
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "0.75rem",
      },
    },
  };
};

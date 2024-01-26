import { alpha, Box, BoxProps, Theme, Typography } from "@mui/material";
import React from "react";

type HeadingProps = {
  title: string;
  subTitle?: JSX.Element | string;
} & BoxProps;

const Heading = ({ title, subTitle, children, ...rest }: HeadingProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
      {...rest}
    >
      <Typography
        variant="h4"
        sx={{
          lineHeight: 1.33,
          fontWeight: "normal",
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
          textAlign: "center",
          color: (theme: Theme) => theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: (theme: Theme) => theme.palette.text.secondary,
          fontFamily: (theme: Theme) => theme.fontFamily.primary,
          fontWeight: 500,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: 1.5,
          flexGrow: 0,
          letterSpacing: "normal",
        }}
      >
        {subTitle}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "50vw",
          borderRadius: (theme: Theme) => theme.spacing(1),
          background: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export { Heading };

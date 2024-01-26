import Link from "next/link";
import { Typography, Theme, Box, BoxProps } from "@mui/material";

type CrosslayerProps = {
  label: string;
  linkPath: string;
  linkText: string;
} & BoxProps;

const Crosslayer = ({
  label,
  linkPath,
  linkText,
  ...rest
}: CrosslayerProps) => {
  return (
    <Box {...rest}>
      <Typography
        sx={{
          textAlign: "center",
          marginBottom: (theme: Theme) => theme.spacing(5),
          "& a": {
            color: (theme: Theme) => theme.palette.primary.main,
            textDecoration: "none",
            marginRight: (theme: Theme) => theme.spacing(0.5),
            "&:hover": {
              textDecoration: "none",
              opacity: "0.7",
            },
          },
        }}
      >
        {`${label} `}
        <Link href={linkPath}>{linkText}</Link>
      </Typography>
    </Box>
  );
};

export default Crosslayer;

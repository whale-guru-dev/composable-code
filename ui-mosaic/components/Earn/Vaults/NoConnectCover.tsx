import { Box, BoxProps, Typography } from "@mui/material";

const NoConnectCover = ({ ...rest }: BoxProps) => {
  return (
    <Box {...rest}>
      <Box
        textAlign="center"
        mb={3}
        height={200}
        sx={{
          background: "url(/images/connect.png) no-repeat center",
          mixBlendMode: "luminosity",
          backgroundSize: "contain",
        }}
      />
      <Typography variant="h6" color="text.secondary" textAlign="center">
        Connect to start earning.
      </Typography>
    </Box>
  );
};

export default NoConnectCover;

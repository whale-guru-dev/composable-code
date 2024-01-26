import {
  Box,
  BoxProps,
  Theme,
} from "@mui/material";

const InfoBox = ({
  children,
  ...rest
}: BoxProps) => {
  return (
    <Box padding={4}
          sx={{
              backgroundColor: (theme: Theme) => theme.palette.other.background.n4,
              borderRadius: 1,
            }}
          {...rest}
    >
      {children}
    </Box>
  );
};

export default InfoBox;

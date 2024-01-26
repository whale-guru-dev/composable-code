import {
  Box,
  BoxProps,
} from "@mui/material";

const TransactionRow = ({
  children,
  ...rest
}: BoxProps) => {
  return (
    <Box pt={2}
          display="flex"
          alignItems="center"
          sx={{
            flexWrap: {
              xs: "wrap",
              md: "nowrap",
            }
          }}
          {...rest}
    >
      {children}
    </Box>
  )
}

export default TransactionRow;

import {
  BoxProps,
  Typography,
  Box
} from "@mui/material";

type TransactionCellProps = {
  label: string,
} & BoxProps;

const TransactionCell = ({
  label,
  children,
  ...rest
}: TransactionCellProps) => {
  return (
    <Box  sx={{
                marginBottom: {
                  xs: '24px',
                  sm: 0,
                }
              }}
          {...rest}
    >
      <Typography variant="caption"
                  color="text.secondary"
                  component="div"
                  mb={0.5}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default TransactionCell;

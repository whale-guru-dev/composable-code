import { TransactionStatus, TransactionStatusLabels } from "@/submodules/contracts-operations/src/api";
import {
  BoxProps,
  Typography,
  Box
} from "@mui/material";
import Badge from "../Badge";

type ActionCellProps = {
  status?: TransactionStatus,
} & BoxProps;

const ActionCell = ({
  status,
  children,
  ...rest
}: ActionCellProps) => {
  return (
    <Box  display="flex"
          alignItems="center"
          justifyContent="right"
          sx={{
                marginBottom: {
                  xs: '24px',
                  sm: 0,
                }
              }}
          {...rest}
    >
      {status && <Box sx={{
            mr: {
              xs: 1,
              md: 3,
            }
          }}
      >
        <Badge type={status}
                minWidth={96}
                textAlign="center"
        >
          <Typography variant="caption" color={`${status}.main`}>
            {TransactionStatusLabels[status]}
          </Typography>
        </Badge>
      </Box>}
      {children}
    </Box>
  );
}

export default ActionCell;

import { Box, BoxProps, Typography } from "@mui/material";
import Badge from "../Badge";
import { humanizeTime } from "../Transaction/utils";

type TransactionHeaderProps = {
  label: string;
  timestamp?: string;
} & BoxProps;

const TransactionHeader = ({
  label,
  timestamp,
  ...rest
}: TransactionHeaderProps) => {
  return (
    <Box pb={2} display="flex" alignItems="center" {...rest}>
      <Badge mr={1.25}>
        <Typography variant="caption">{label}</Typography>
      </Badge>
      <Typography variant="body2" mr={1.25}>
        {timestamp && new Date(timestamp).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {timestamp && `${humanizeTime(new Date(timestamp).getTime())} ago`}
      </Typography>
    </Box>
  );
};

export default TransactionHeader;

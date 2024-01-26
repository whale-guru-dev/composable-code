import {
  Box,
  Typography,
  BoxProps,
} from "@mui/material";

type TextItemProps = {
  label?: string,
  amountText: string,
} & BoxProps;

const TextItem = ({
  label,
  amountText,
  ...rest
}: TextItemProps) => {
  return (
    <Box textAlign="center" {...rest}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" mt={0.5}>
        {amountText}
      </Typography>
    </Box>
  );
}


export default TextItem;

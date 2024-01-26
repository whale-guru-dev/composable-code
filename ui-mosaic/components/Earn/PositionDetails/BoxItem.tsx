import {
  Box,
  Typography,
  BoxProps,
} from "@mui/material";
import InfoBox from "@/components/InfoBox";

type BoxItemProps = {
  label?: string,
  amountText: any,
  amountIntro?: string,
  icon?: JSX.Element,
} & BoxProps;

const BoxItem = ({
  label,
  amountText,
  amountIntro,
  icon,
  ...rest
}: BoxItemProps) => {
  return (
    <InfoBox textAlign="center" {...rest}>
      {label &&
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>}
      {icon &&
      <Box mt={2}>
        {icon}
      </Box>}
      <Typography variant="h6" mt={2}>
        {amountText}
      </Typography>
      {amountIntro &&
      <Typography variant="caption" color="text.secondary" mt={0.5}>
        {amountIntro}
      </Typography>}
    </InfoBox>
  );
}


export default BoxItem;

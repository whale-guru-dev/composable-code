import {
  Box,
  BoxProps,
  Typography
} from "@mui/material";

type DetailItemProps = {
  label: string,
  isMobile?: boolean
} & BoxProps;

const DetailItem = ({
  label,
  children,
  isMobile,
  ...rest
}: DetailItemProps) => {
  return (
    <Box display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
          sx={{
            px: {sm: 3},
            flexDirection: {
              xs: isMobile ? 'column' : 'row',
              sm: 'row',
            }
          }}
          py={1.625}
          {...rest}
    >
      <Typography variant="body2">
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default DetailItem;

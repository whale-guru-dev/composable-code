import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  value: any;
}

const InfoBox = ({ title, value }: Props) => {
  return (
    <Box
      textAlign="center"
      sx={{ padding: 4, bgcolor: "other.background.n4", borderRadius: 1 }}
    >
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h5">{value}</Typography>
    </Box>
  );
};

export default InfoBox;

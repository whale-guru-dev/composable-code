import {
  Box,
  BoxProps,
  Typography
} from "@mui/material";

const NoActivePositionCover = ({...rest}: BoxProps) => {
  return (
    <Box {...rest}>
      <Box textAlign="center" mb={3}
            height={200}
            sx={{
              background: 'url(/images/empty.png) no-repeat center',
              mixBlendMode: 'luminosity',
              backgroundSize: 'contain',
            }} />
      <Typography variant="h6" color="text.secondary" textAlign="center">
        You don’t have any positions to withdraw yet.
      </Typography>
    </Box>
  )
}

export default NoActivePositionCover;

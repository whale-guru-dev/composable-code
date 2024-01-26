import {
  Box,
  BoxProps,
  Theme,
} from "@mui/material";
import LayersIcon from '@mui/icons-material/Layers';

type RoundedLayersIconProps = {
  size?: number,
  customColor?: string,
  customBackgroundColor?: string,
} & BoxProps;

const RoundedLayersIcon = ({
  size,
  customColor,
  customBackgroundColor,
  ...rest
}: RoundedLayersIconProps) => {
  return (
    <Box sx={{
      width: (size || 24),
      height: (size || 24),
      borderRadius: 2,
      background: (theme: Theme) => customBackgroundColor ? customBackgroundColor : theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} {...rest}>
      <LayersIcon sx={{
        width: (size || 24)/3*2,
        height: (size || 24)/3*2,
        color: customColor,
      }}/>
    </Box>
  )
}

export default RoundedLayersIcon;

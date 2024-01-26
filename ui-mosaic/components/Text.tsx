import { Typography, TypographyProps } from '@mui/material'

import theme from 'theme'
import { AllColorType } from '@/types/types'

interface TextProps extends TypographyProps {
  type: AllColorType
}

const Text = ({ children, type, ...props }: TextProps) => {
  let color = theme.palette.text.primary

  if (type) {
    color = (type !== 'black' && type !== 'white')
      ? theme.palette[type].main
      : theme.palette.common[type]
  }

  const colorStyle = {
    color,
  }

  return (
    <Typography {...props} style={colorStyle}>
      {children}
    </Typography>
  )
}

Text.defaultProps = {
  type: ''
}

export default Text

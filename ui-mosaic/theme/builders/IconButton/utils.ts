import { alpha } from '@mui/material/styles';
import { Theme } from '@mui/material'
import { ColorType } from '@/types/types'

type propColorType = ColorType | 'inherit' | 'default'

const getColor = (color: propColorType) => {
  if (color && color != 'inherit' && color != 'default' ){
    return color
  }
  return 'primary';
}
export const outlinedIconButtonStyleWithColorProps = (theme: Theme, color: propColorType = 'primary', customColor?: string) => {

  return {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: customColor || theme.palette[getColor(color)].main,
      color: theme.palette.text.primary,
      '&:hover': {
        borderColor: customColor || theme.palette[getColor(color)].main,
        color: theme.palette.text.primary,
        background: alpha(customColor || theme.palette[getColor(color)].main, theme.opacity.main),
      },
      '&.Mui-disabled': {
        borderColor: customColor || theme.palette[getColor(color)].main,
        color: theme.palette.text.primary,
        opacity: theme.opacity.light,
      }
  }
}

export const containedIconButtonStyleWithColorProps = (theme: Theme, color: propColorType = 'primary', customColor?: string) => {

  return {
      borderWidth: 0,
      backgroundColor: customColor || theme.palette[getColor(color)].light,
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: customColor || theme.palette[getColor(color)].dark,
        color: theme.palette.text.primary,
      },
      '&.Mui-disabled': {
        background: alpha(customColor || theme.palette[getColor(color)].main, theme.opacity.light),
        color: theme.palette.text.secondary,
      }
  }
}

export const textIconButtonStyleWithColorProps = (theme: Theme, color: propColorType = 'primary', customColor?: string) => {

  return {
      borderWidth: 0,
      color: theme.palette.text.primary,
      '&:hover': {
        background: alpha(customColor || theme.palette[getColor(color)].main, theme.opacity.main),
        color: theme.palette.text.primary,
      },
      '&.Mui-disabled': {
        color: theme.palette.text.secondary,
      }
  }
}

export const phantomIconButtonStyleWithColorProps = (theme: Theme, color: propColorType = 'primary', customColor?: string) => {

  return {
      borderWidth: 0,
      color: theme.palette.text.primary,
      '&:hover': {
        background: alpha(customColor || theme.palette[getColor(color)].main, theme.opacity.main),
        color: theme.palette.text.primary,
      },
      '&.Mui-disabled': {
        color: theme.palette.text.secondary,
      }
  }
}

export const iconButtonStyleWithSizeProps = (theme: Theme, fontSize: string, fontSizeMobile: string, size: number) => {

  return {
    fontSize: fontSize,
    width: size,
    height: size,
    [theme.breakpoints.down('sm')]: {
      fontSize: fontSizeMobile,
      width: size,
      height: size,
    },
  }
}

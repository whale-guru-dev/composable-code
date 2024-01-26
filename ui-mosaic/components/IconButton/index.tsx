import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, Theme } from '@mui/material'
import { makeStyles, createStyles } from "@mui/styles";
import {  containedIconButtonStyleWithColorProps, 
          outlinedIconButtonStyleWithColorProps, 
          phantomIconButtonStyleWithColorProps, 
          textIconButtonStyleWithColorProps } from '@/theme/builders/IconButton/utils';

type CustomColor = string | undefined
type VariantType = 
  | "outlined"
  | "contained"
  | "text"
  | "phantom"
interface IconButtonProps extends MuiIconButtonProps {
  variant?: VariantType
  customColor?: CustomColor
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outlined: (props: IconButtonProps) => outlinedIconButtonStyleWithColorProps(theme, props.color, props.customColor),
    contained: (props: IconButtonProps) => containedIconButtonStyleWithColorProps(theme, props.color, props.customColor),
    text: (props: IconButtonProps) => textIconButtonStyleWithColorProps(theme, props.color, props.customColor),
    phantom: (props: IconButtonProps) => phantomIconButtonStyleWithColorProps(theme, props.color, props.customColor),
  })
);

const IconButton = (props: IconButtonProps) => {
  const { customColor, variant, children, ...rest } = props
  const classes = useStyles(props)

  return (
      <MuiIconButton {...rest} className={classes[variant || 'outlined']}>{children}</MuiIconButton>
  )
}

IconButton.defaultProps = {
  variant: 'outlined'
}

export default IconButton

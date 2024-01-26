import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { alpha } from "@mui/material/styles";

type CustomColor = string | undefined;

interface ButtonProps extends MuiButtonProps {
  customColor?: CustomColor;
  transparent?: boolean;
  active?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outlined: {
      borderColor: (props: ButtonProps) => props.customColor,
      backgroundColor: (props: ButtonProps) =>
        props.active ? props.customColor : "transparent",
      "&:hover": {
        borderColor: (props: ButtonProps) => props.customColor,
        backgroundColor: (props: ButtonProps) =>
          props.transparent
            ? "transparent"
            : alpha(
                props.customColor || theme.palette.primary.dark,
                theme.opacity.main
              ),
      },
      "&.Mui-disabled": {
        borderColor: (props: ButtonProps) => props.customColor,
        opacity: theme.opacity.light,
      },
    },
    contained: {
      backgroundColor: (props: ButtonProps) =>
        props.customColor ? props.customColor : theme.palette.primary.main,
      "&:hover": {
        backgroundColor: (props: ButtonProps) =>
          props.customColor ? props.customColor : theme.palette.primary.dark,
      },
      "&.Mui-disabled": {
        background: (props: ButtonProps) =>
          alpha(
            props.customColor || theme.palette.primary.dark,
            theme.opacity.light
          ),
        color: alpha(theme.palette.text.primary, 0.4),
      },
    },
    text: {
      "&:hover": {
        background: (props: ButtonProps) =>
          alpha(
            props.customColor || theme.palette.primary.main,
            theme.opacity.main
          ),
      },
    },
    phantom: {
      "&:hover": {
        background: (props: ButtonProps) =>
          alpha(
            props.customColor || theme.palette.primary.main,
            theme.opacity.main
          ),
      },
    },
  })
);

const Button = (props: ButtonProps) => {
  const { customColor, active, transparent, ...rest } = props;
  const classes = useStyles(props);

  return <MuiButton {...rest} classes={classes}></MuiButton>;
};

export default Button;

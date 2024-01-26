import Image from "next/image";
import { ColorType } from "@/types/types";
import { alpha, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import IconButton from "../IconButton";
import { link as linkIcon } from "@/assets/icons/common";
import { useRouter } from "next/router";

export type StatusLabelProps = {
  color?: ColorType;
  text: string;
  link?: string;
  customColor?: string;
  size?: "small" | "medium" | "large";
};

const getColor = (props: StatusLabelProps, theme: Theme) => {
    return props.customColor ? props.customColor : (props.color ? theme.palette[props.color].main : theme.palette.text.primary) 
}

const getBgColor = (props: StatusLabelProps, theme: Theme) => {
    return props.customColor ? props.customColor : (props.color ? theme.palette[props.color].main : theme.palette.primary.main) 
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: "center",
        },
        label: { 
            color: (props: StatusLabelProps) => getColor(props, theme),
            backgroundColor: (props: StatusLabelProps) => alpha(getBgColor(props, theme), 0.1),
            textAlign: 'center',
            borderRadius: theme.spacing(0.5),
            lineHeight: '160%',
            height: 'fit-content',
        },
        small: {
            fontSize: 12,
            padding: theme.spacing(0.5, 1),
        },
        medium: {
            fontSize: 16,
            padding: theme.spacing(0.5, 1),
        },
        large: {
            fontSize: 20,
            padding: theme.spacing(0.5, 1),
        },
        link: {
            marginLeft: theme.spacing(1),
            [theme.breakpoints.down('sm')]: {
                marginLeft: theme.spacing(0.5),
            },
        }
    })
)    
const StatusLabel = (props: StatusLabelProps) => {
    const classes = useStyles(props);
    const router = useRouter();

    const goLink = (link?: string) => {
        router.push(link || "/");
    }

    return (
      <div className={classes.root}>
        <div
          className={`${classes.label} ${
            props.size ? classes[props.size] : classes.medium
          }`}
        >
          {props.text}
        </div>
        {props.link && (
          <div className={classes.link}>
            <IconButton
              variant="phantom"
              size={props.size}
              onClick={() => goLink(props.link)}
            >
              <Image src={linkIcon} width={24} height="24" alt={props.link} />
            </IconButton>
          </div>
        )}
      </div>
    );
}

export default StatusLabel

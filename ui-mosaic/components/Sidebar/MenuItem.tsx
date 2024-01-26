import Link from "next/link";
import Image from "next/image";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { ListItem, ListItemText, ListItemIcon, alpha } from "@mui/material";

import useMobile from "hooks/useMobile";
import { lock } from "assets/icons/common";
import { MenuItemProps } from "./types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: "10px",
      height: 58,
      opacity: (props: MenuItemProps) =>
        props.active ? theme.opacity.active : theme.opacity.inactive,
      color: (props: MenuItemProps) =>
        props.active
          ? theme.palette.text.primary
          : theme.palette.text.secondary,
      backgroundColor: (props: MenuItemProps) =>
        props.active ? `${theme.palette.other.background.n7} !important` : "",
      marginBottom: theme.spacing(3),
      "&:hover": {
        backgroundColor: (props: MenuItemProps) =>
          props.locked
            ? "transparent"
            : `${alpha(theme.palette.primary.main, 0.07)} !important`,
        color: (props: MenuItemProps) =>
          props.locked ? "" : theme.palette.text.primary,
        opacity: theme.opacity.active,
      },
      [theme.breakpoints.down("md")]: {
        marginBottom: theme.spacing(2),
        flexDirection: "column",
        textAlign: "center",
        padding: theme.spacing(2),
        height: 90,
      },
      [theme.breakpoints.down("sm")]: {
        margin: theme.spacing(0, 1),
        padding: theme.spacing(1),
        minWidth: "72px",
        height: 70,
      },
    },
    icon: {
      [theme.breakpoints.down("md")]: {
        minWidth: "auto",
        marginBottom: theme.spacing(1),
      },
    },
  })
);

const MenuItem = (props: MenuItemProps) => {
  const isMobile = useMobile("sm");
  const { icon, text, locked, active, path, mobileText } = props;
  const classes = useStyles(props);

  const itemContent = (
    <ListItem
      button={true}
      className={classes.root}
      selected={active}
      disabled={locked}
    >
      <ListItemIcon className={classes.icon}>
        <Image src={icon} alt={text} width="21" height="21" />
      </ListItemIcon>
      <ListItemText
        primary={isMobile ? mobileText || text : text}
        primaryTypographyProps={{
          variant: isMobile ? "caption" : "body2",
        }}
      />
      {locked && !active && !isMobile && (
        <Image src={lock} alt="lock" width="18" height="18" />
      )}
    </ListItem>
  );

  if (locked) {
    return itemContent;
  }

  return (
    <Link href={path || "/"} passHref>
      {itemContent}
    </Link>
  );
};

export default MenuItem;

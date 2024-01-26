import { makeStyles, createStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      padding: theme.spacing(3),
      boxShadow: "0 0 96px 0 rgba(7, 1, 5, 0.8)",
      backgroundColor: theme.palette.other.background.n4,
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(2),
      },
    },
    toolbar: {
      padding: theme.spacing(7, 2),
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(3, 1),
      },
    },
    menu: {
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        padding: 0,
      },
    },
  })
);

export default useStyles;

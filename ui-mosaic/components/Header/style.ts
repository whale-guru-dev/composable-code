import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
      },
      backdropFilter: " blur(32px)",
    },
    account: {
      display: "flex",
    },
    toolbar: {
      [theme.breakpoints.down("sm")]: {
        justifyContent: "space-between",
      },
    },
    logo: {
      minWidth: "32px",
    },
  })
);

export default useStyles;

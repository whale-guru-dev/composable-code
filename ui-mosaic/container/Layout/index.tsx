import { FC } from "react";
import { CssBaseline } from "@mui/material";

//import Restriction from "components/Restriction";
import Sidebar from "components/Sidebar";
import Header from "components/Header";
//import Disclaimer from "components/Disclaimer";
import useStyles from "./style";

type LayoutProps = {};

const Layout: FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Sidebar />
      <main className={classes.main}>
        <Header />
        <div className={classes.content}>
          {/*<Disclaimer />*/}
          {children}
          {/*<Restriction />*/}
        </div>
      </main>
    </div>
  );
};

export default Layout;

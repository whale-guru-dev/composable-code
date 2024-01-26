import Image from "next/image";
import { Drawer, List } from "@mui/material";

import useMobile from "hooks/useMobile";
import { getDrawerWidth } from "utils";
import MenuItem from "./MenuItem";
import { MENU_ITEMS } from "./types";
import useStyles from "./style";
import { useSidebar } from "@/contexts/SidebarProvider";

const Sidebar = () => {
  const { activeItem } = useSidebar();
  const classes = useStyles();
  const isMobile = useMobile("sm");
  const isPad = useMobile("md") && !isMobile;
  const anchor = isMobile ? "bottom" : "left";
  const width = getDrawerWidth(isMobile, isPad);

  return (
    <Drawer
      sx={{
        width,
        "& .MuiDrawer-paper": {
          width,
          minWidth: width,
        },
      }}
      variant="permanent"
      anchor={anchor}
      PaperProps={{
        elevation: 1,
      }}
      classes={{
        root: classes.drawer,
        paper: classes.drawerPaper,
      }}
    >
      {!isMobile && (
        <div className={classes.toolbar}>
          <Image
            src="/logo.svg"
            alt="Mosaic"
            width="100%"
            height="22"
            layout="responsive"
            objectFit="contain"
          />
        </div>
      )}
      <List className={classes.menu}>
        {MENU_ITEMS.map((item) => (
          <MenuItem
            key={item.text}
            {...item}
            active={activeItem === item.name}
          />
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

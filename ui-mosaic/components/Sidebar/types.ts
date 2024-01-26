import { SidebarItem } from "@/contexts/SidebarProvider";
import { home, earn, explorer, swap, layers } from "assets/icons/menu";

export type MenuItemProps = {
  icon: string;
  text: string;
  mobileText?: string;
  locked?: boolean;
  active?: boolean;
  path?: string;
  name?: string;
};

export const MENU_ITEMS: MenuItemProps[] = [
  {
    icon: home,
    text: "Overview",
    locked: false,
    name: SidebarItem.Overview,
    path: "/",
  },
  {
    icon: earn,
    text: "Earn",
    locked: false,
    name: SidebarItem.Earn,
    path: "/earn",
  },
  {
    icon: swap,
    text: "Swap",
    locked: false,
    name: SidebarItem.Swap,
    path: "/swap",
  },
  {
    icon: layers,
    text: "Mural",
    mobileText: "Mural",
    locked: false,
    name: SidebarItem.Mural,
    path: "/mural",
  },
  {
    icon: explorer,
    text: "Explorer",
    locked: false,
    name: SidebarItem.Explorer,
    path: "/explorer",
  },
];

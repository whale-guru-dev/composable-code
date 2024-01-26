import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";

export enum SidebarItem {
  Overview = "overview",
  Earn = "earn",
  Swap = "swap",
  Explorer = "explorer",
  Mural = "mural",
}

export type SidebarContextState = {
  activeItem: SidebarItem | null;
  subPage: string | null;
  setSubPage: (item: string | null) => void;
  setActiveItem: (item: SidebarItem) => void;
};

export const SidebarContext = createContext<SidebarContextState>({
  activeItem: null,
  subPage: null,
  setSubPage: () => {},
  setActiveItem: () => {},
});

export const useSidebar = () => {
  const router = useRouter();
  const { setSubPage, setActiveItem, ...rest } = useContext(SidebarContext);
  router.events?.on("routeChangeStart", () => {
    setActiveItem(router.pathname.split("/")[1] as SidebarItem);
    setSubPage(null);
  });

  return {
    setSubPage,
    setActiveItem,
    ...rest,
  };
};

const SidebarProvider: React.FC = ({ children }) => {
  const [activeItem, setActiveItem] = useState<SidebarItem | null>(null);
  const [subPage, setSubPage] = useState<string | null>(null);

  return (
    <SidebarContext.Provider
      value={{ activeItem, setActiveItem, subPage, setSubPage }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;

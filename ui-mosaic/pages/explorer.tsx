import ExplorerContainer from "container/Explorer";
import { useEffect } from "react";
import { useSidebar, SidebarItem } from "@/contexts/SidebarProvider";

const ExplorerPage = () => {
  const { setActiveItem } = useSidebar();
  useEffect(() => {
    setActiveItem(SidebarItem.Explorer);
  }, [setActiveItem]);
  return <ExplorerContainer />;
};
export default ExplorerPage;

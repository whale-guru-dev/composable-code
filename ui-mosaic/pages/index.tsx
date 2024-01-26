import Overview from "container/Overview";
import { useEffect } from "react";
import { useSidebar, SidebarItem } from "@/contexts/SidebarProvider";

const OverviewContainer = () => {
  const { setActiveItem } = useSidebar();
  useEffect(() => {
    setActiveItem(SidebarItem.Overview);
  }, [setActiveItem]);
  return <Overview />;
};
export default OverviewContainer;

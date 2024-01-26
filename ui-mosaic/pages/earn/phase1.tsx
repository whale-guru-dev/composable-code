import Earn from "container/Earn/phase1";
import { useEffect } from "react";
import { useSidebar, SidebarItem } from "@/contexts/SidebarProvider";

const EarnContainer = () => {
  const { setActiveItem } = useSidebar();
  useEffect(() => {
    setActiveItem(SidebarItem.Earn);
  }, [setActiveItem]);
  return <Earn />;
};
export default EarnContainer;

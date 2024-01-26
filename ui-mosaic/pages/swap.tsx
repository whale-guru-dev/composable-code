import Transfer from "container/Transfer";
import { useEffect } from "react";
import { useSidebar, SidebarItem } from "@/contexts/SidebarProvider";

const TransferContainer = () => {
  const { setActiveItem } = useSidebar();
  useEffect(() => {
    setActiveItem(SidebarItem.Swap);
  }, [setActiveItem]);
  return <Transfer />;
};
export default TransferContainer;

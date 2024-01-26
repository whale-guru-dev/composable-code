import Nfts from "container/Nfts";
import { useEffect } from "react";
import { useSidebar, SidebarItem } from "@/contexts/SidebarProvider";

const NftPage = () => {
  const { setActiveItem } = useSidebar();
  useEffect(() => {
    setActiveItem(SidebarItem.Mural);
  }, [setActiveItem]);
  return <Nfts />;
};
export default NftPage;

import { Container } from "@mui/material";
import DepositWithdraw from "@/components/Earn/Vaults/DepositWithdraw";
import { useSidebar, SidebarItem } from "@/contexts/SidebarProvider";

import { useRouter } from "next/router";
import { useContext, useEffect, useMemo } from "react";
import { CrossChainToken, selectCrossChainTokens } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { useAppSelector } from "@/store";
import { FormType } from "@/components/Earn/Vaults/DepositWithdraw";
import { CrossChainTokensDetailsProvider } from "@/phase2/components/CrossChainTokenDetails";

const DepositWithdrawContainer = () => {
  const router = useRouter();
  const { setActiveItem, setSubPage } = useSidebar();

  const crossChainId = router.query.crossChainId as string;

  const formType = router.query.formType as FormType;
  
  const crossChainTokens: Array<CrossChainToken> = useAppSelector(
    selectCrossChainTokens
  );

  const token = useMemo(
    () => crossChainTokens.find((token: CrossChainToken) => token.crossChainId === crossChainId),
    [crossChainId, crossChainTokens]
  );

  useEffect(() => {
    if (token) {
      setActiveItem(SidebarItem.Earn);
      setSubPage(`${token.symbol} Vault`);
    }
  }, [setActiveItem, setSubPage, token]);

  return (
    <CrossChainTokensDetailsProvider>
      <Container>
        {token && crossChainId &&
        <DepositWithdraw type={formType} crossChainId={crossChainId} />
        }
      </Container>
    </CrossChainTokensDetailsProvider>
  );
};

export default DepositWithdrawContainer;

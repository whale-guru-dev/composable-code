import { useDispatch } from "react-redux";

import { createContractsContext, createContractsProvider } from '../../submodules/bi-lib-submodule/packages/interaction/src/contracts';
import holdingAbi from "../abis/raw/holding.json";
import { Holding } from '../abis/types/holding';
import { HoldingContractWrapper } from '../contracts/wrappers/HoldingContractWrapper';

export const HoldingContractsContext = createContractsContext<Holding>();
const HoldingConctractsProvider = createContractsProvider<Holding>();

export interface HoldingContractsProviderProps {
  children: any;
}

export const HoldingContractsProvider = (props: HoldingContractsProviderProps) => {
  const dispatch = useDispatch();

  return (
    <HoldingConctractsProvider
      abi={holdingAbi}
      ContractsContext={HoldingContractsContext}
      ContractsWrapperImplementation={HoldingContractWrapper}
      dispatch={dispatch}
    >
      {props.children}
    </HoldingConctractsProvider>
  );
}
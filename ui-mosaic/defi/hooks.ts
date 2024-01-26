import { useContext } from "react";

import { ContractsContext } from "./ContractsContext";
import { getNetworkUrl } from "defi";
import { getAddressesByChainId } from "./addresses";
import { SupportedNetworks } from "./types";

export function useNetworkUrl() {
  const { chainId } = useContext(ContractsContext);

  return getNetworkUrl(chainId ?? 1);
}

export function useAddresses() {
  const { chainId } = useContext(ContractsContext);

  return getAddressesByChainId(
    chainId ? (chainId as SupportedNetworks) : 1
  );
}

//import { RELAYER_SUPPORTED_NETWORKS } from "../constants";
import { ContractAddresses } from "./addresses";
import { TokenId } from "./tokenInfo";
import { SupportedNetworks } from "./types";

const allowances: {
  [key in TokenId]: {
    contract: ContractAddresses;
    chainIds: SupportedNetworks[];
  }[];
} = {
  usdc: [
    { contract: "liquidityprovidervault", chainIds: [1] },
    { contract: "relayervault", chainIds: [1, 137, 42161, 43114, 1285, 250] },
  ],
  weth: [
    { contract: "liquidityprovidervault", chainIds: [1] },
    { contract: "relayervault", chainIds: [1, 137, 42161, 43114, 1285, 250] },
  ],
  polkadot: [],
  eth: [],
  layr: [],
  "crvTricrypto-usd-btc-eth": [
    { contract: "liquidityprovidervault", chainIds: [1] },
  ],
  "sushi-weth-usdc": [{ contract: "liquidityprovidervault", chainIds: [1] }],
  "sushi-weth-usdt": [{ contract: "liquidityprovidervault", chainIds: [1] }],
  aDai: [{ contract: "liquidityprovidervault", chainIds: [1] }],
  aUsdc: [{ contract: "liquidityprovidervault", chainIds: [1] }],
  aUsdt: [{ contract: "liquidityprovidervault", chainIds: [1] }],
  mim: [
    { contract: "liquidityprovidervault", chainIds: [1] },
    { contract: "relayervault", chainIds: [1, 42161, 43114, 1285, 250] },
  ],
  avax: [],
  ftm: [],
  matic: [],
  movr: []
};

export const getAllowances = (
  tokenId: TokenId,
  chainId: SupportedNetworks
): ContractAddresses[] =>
  allowances[tokenId]
    .filter((x) => x.chainIds.includes(chainId))
    .map((x) => x.contract);

import { toTokenUnitsBN } from "@integrations-lib/interaction";
import BigNumber from "bignumber.js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAppSelector } from "@/store";
import {
  ChainSupportedTokens,
  CrossChainId,
  CrossChainToken,
  LiquidityToken,
  selectCrossChainTokens,
  selectSupportedTokens,
  SupportedTokens,
  Token,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { SupportedNetworkId } from "@/submodules/contracts-operations/src/defi/constants";
import { getTokenPrice } from "@/submodules/contracts-operations/src/api";

type CrossChainTokensList = {
  [crossChainId: string]: Array<ChainIdTokenPair>;
}

type ChainIdTokenPair = {
  chainId: SupportedNetworkId;
  token: Token;
}

export type TokenInfo = {
  deposited: BigNumber;
  liquidity: BigNumber;
  price: number;
}

export type TokenInfoPerChains = {
  [chainId: number]: TokenInfo;
}

export type CrossChainTokensInfo = {
  [crossChainId: string]: TokenInfoPerChains;
}

type CrossChainTokensDetailsValues = {
  tokensInfo: CrossChainTokensInfo;
}

export const CrossChainTokensDetailsContext = createContext<CrossChainTokensDetailsValues>({
  tokensInfo: {}
});

interface CrossChainTokensDetailsProviderProps {
  children: any;
}

export const CrossChainTokensDetailsProvider = (props: CrossChainTokensDetailsProviderProps) => {
  const {
    setToken,
    getLiquidity,
    getDeposited,
  } = useContext(NetworkTokenOperationsContext);
  
  const supportedTokens: SupportedTokens = useAppSelector(selectSupportedTokens);
  const crossChainTokens: Array<CrossChainToken> = useAppSelector(selectCrossChainTokens);

  const crossChainTokenDetails: CrossChainTokensList = useMemo(
    () => Array.from(crossChainTokens).reduce((result: CrossChainTokensList, token: CrossChainToken) => {
        const chainIdTokenPairs : Array<ChainIdTokenPair> = Object.entries(supportedTokens).reduce(
          (result: Array<ChainIdTokenPair>, chainTokens: [string, ChainSupportedTokens]) => {
            return chainTokens[1].liquidityTokens.reduce(
              (chainResult: Array<ChainIdTokenPair>, liquidityToken: LiquidityToken) => {
                if (liquidityToken.token.crossChainId === token.crossChainId) {
                  chainResult.push({
                    chainId: parseInt(chainTokens[0]) as SupportedNetworkId,
                    token: liquidityToken.token,
                  })
                }

                return chainResult;
              },
              result
            )
          },
          []
        );

        result[token.crossChainId] = chainIdTokenPairs;

        return result;
      },
      {}
    ),
    [crossChainTokens, supportedTokens]
  );

  const [tokensInfo, setTokensInfo] = useState<CrossChainTokensInfo>({});

  useEffect(
    () => {
      Object.values(crossChainTokenDetails).forEach((chainIdTokenPairs: Array<ChainIdTokenPair>) => 
        chainIdTokenPairs.forEach((pair: ChainIdTokenPair) => setToken(pair.token))
      );
    },
    [crossChainTokenDetails, setToken]
  )

  useEffect(
    () => {
      Object.entries(crossChainTokenDetails).forEach(([crossChainId, chainIdTokenPairs] : [CrossChainId, Array<ChainIdTokenPair>]) => 
        chainIdTokenPairs.forEach((pair: ChainIdTokenPair) => {
          const {
            chainId,
            token,
          } = pair;

          const liquidity = getLiquidity(token);

          if (liquidity) {
            setTokensInfo(tokensInfo => ({
              ...tokensInfo,
              [crossChainId]: {
                ...tokensInfo[crossChainId],
                [chainId]: {
                  ...tokensInfo[crossChainId]?.[chainId],
                  liquidity: toTokenUnitsBN(liquidity.toString(), token.decimals),
                },
              }
            }));
          }
        })
      );
    },
    [crossChainTokenDetails, getLiquidity]
  );

  useEffect(
    () => {
      Object.entries(crossChainTokenDetails).forEach(([crossChainId, chainIdTokenPairs] : [CrossChainId, Array<ChainIdTokenPair>]) => 
        chainIdTokenPairs.forEach((pair: ChainIdTokenPair) => {
          const {
            chainId,
            token,
          } = pair;

          const deposited = getDeposited(token);

          if (deposited) {
            setTokensInfo(tokensInfo => ({
              ...tokensInfo,
              [crossChainId]: {
                ...tokensInfo[crossChainId],
                [chainId]: {
                  ...tokensInfo[crossChainId]?.[chainId],
                  deposited: deposited?.value || new BigNumber(0),
                },
              }
            }));
          }
        })
      );
    },
    [crossChainTokenDetails, getDeposited]
  );
  
  useEffect(
    () => {
      Object.entries(crossChainTokenDetails).forEach(([crossChainId, chainIdTokenPairs] : [CrossChainId, Array<ChainIdTokenPair>]) => 
        chainIdTokenPairs.forEach((pair: ChainIdTokenPair) => {
          const {
            chainId,
            token,
          } = pair;

          getTokenPrice(chainId, token.address).then((value: string) => { // TODO(Marko): Use getTokenPrice from NetworkTokenOperationsContext
            setTokensInfo(tokensInfo => ({
              ...tokensInfo,
              [crossChainId]: {
                ...tokensInfo[crossChainId],
                [chainId]: {
                  ...tokensInfo[crossChainId]?.[chainId],
                  price: parseFloat(value),
                },
              }
            }));
          });
        })
      )
    },
    [crossChainTokenDetails, getTokenPrice]
  );

  return (
    <CrossChainTokensDetailsContext.Provider
      value={{ tokensInfo }}
    >
      {props.children}
    </CrossChainTokensDetailsContext.Provider>
  );
};
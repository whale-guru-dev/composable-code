import { useConnector } from "@integrations-lib/core";
import BigNumber from "bignumber.js";
import React, { createContext, useCallback, useContext, useState } from "react";

import { Token } from "../types";
import { toTokenUnitsBN } from "../utils";
import { ERC20ContractWrapper } from "../wrappers";
import { ERC20ContractsContext } from "./TokenInfoWrapper";

export type ChainIdTokenPair = {
  chainId: number;
  token: Token;
}

export interface Balance {
  value: BigNumber | undefined;
  isLoading: boolean;
}

interface TokenInfo {
  balance?: Balance;
  allowances?: Set<string>;
}

type TokenAddressToInfoMapping = {
  [key: string]: TokenInfo;
}

type TokenInfoPerChain = Partial<{
  [key: number]: TokenAddressToInfoMapping
}>

type TokenInfoPerAccount = {
  [key: string]: TokenInfoPerChain
}

export interface TokenInfoValues {
  getBalances: (...pairs: Array<ChainIdTokenPair>) => Array<Balance>;
  hasAllowance: (pair: ChainIdTokenPair, spender: string) => boolean;
}

export const TokenInfoContext = createContext<TokenInfoValues>({
  getBalances: () => [],
  hasAllowance: () => false,
});

export interface TokenInfoProps {
  children: any;
}

export const TokenInfo = (props: TokenInfoProps) => {
  const [info, setInfo] = useState<TokenInfoPerAccount>({});

  const { getContract } = useContext(ERC20ContractsContext);

  const { account } = useConnector("metamask");

  const updateAllowance = useCallback(
    async (
      pair: ChainIdTokenPair, spender: string
    ) => {
      const {
        chainId,
        token,
      } = pair;

      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      let contract = getContract(
        chainId,
        token.address
      ) as ERC20ContractWrapper;

      if (!contract) {
        throw Error("Token Info - Contract undefined")
      }

      try {
        const hasAllowance = await contract.hasEnoughAllowance(
          account,
          spender
        );

        setInfo(info => {
          const allowances = info[account]?.[chainId]?.[token.address]?.allowances || new Set();
          const hadAllowance = allowances.has(spender);

          if (hadAllowance && !hasAllowance) {
            allowances.delete(spender);

            console.log(
              "Token Info - Allowance updated - Disallowed",
              {
                ...pair,
                hadAllowance,
                hasAllowance,
                spender,
              }
            )
          } else if (!hadAllowance && hasAllowance) {
            allowances.add(spender);

            console.log(
              "Token Info - Allowance updated - Allowed",
              {
                ...pair,
                hadAllowance,
                hasAllowance,
                spender,
              }
            )
          }

          return {
            ...info,
            [account]: {
              ...info[account],
              [chainId]: {
                ...info[account]?.[chainId],
                [token.address]: {
                  ...info[account]?.[chainId]?.[token.address],
                  allowances,
                }
              }
            }
          }
        });
      } catch {
        console.log(
          "Token Info - Could not update allowance",
          pair
        );
      }
    },
    [account, getContract]
  )

  const updateBalance = useCallback(
    async (pair: ChainIdTokenPair) => {
      const {
        chainId,
        token,
      } = pair;

      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      let contract = getContract(
        chainId,
        token.address
      );

      if (!contract) {
        throw Error("Token Info - Contract undefined")
      }

      try {
        const balance = await contract.readerContract.balanceOf(account);

        const balanceBN = toTokenUnitsBN(
          balance.toString(),
          token.decimals
        );

        setInfo(info => ({
          ...info,
          [account]: {
            ...info[account],
            [chainId]: {
              ...info[account]?.[chainId],
              [token.address]: {
                ...info[account]?.[chainId]?.[token.address],
                balance: {
                  value: balanceBN,
                  isLoading: false,
                }
              }
            }
          }
        }));

        console.log(
          "Token Info - Balance updated",
          {
            ...pair,
            balanceBN,
          }
        )
      } catch {
        console.log(
          "Token Info - Could not update balance",
          pair
        );
      }
    },
    [account, getContract]
  )

  const addAllowanceListeners = useCallback(
    (
      pair: ChainIdTokenPair, spender: string
    ) => {
      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      const {
        chainId,
        token,
      } = pair;

      let contract = getContract(
        chainId,
        token.address
      ) as ERC20ContractWrapper;

      if (!contract) {
        throw Error("Token Info - Contract undefined")
      }

      const approvalEvent = contract.readerContract.filters.Approval(
        account,
        spender
      );

      contract.on(
        approvalEvent,
        () => {
          console.log(
            "Token Info - Listener executing - Tokens approved",
            {
              chainId,
              token,
            }
          )

          updateAllowance(
            pair,
            spender
          );
        }
      );

      console.log(
        "Token Info - Added allowance listener",
        {
          chainId,
          token,
        }
      )
    },
    [account, getContract, updateAllowance]
  );

  const addBalanceListeners = useCallback(
    (pair: ChainIdTokenPair) => {
      if (!account) {
        throw Error("Token Info - Account undefined")
      }

      const {
        chainId,
        token,
      } = pair;

      let contract = getContract(
        chainId,
        token.address
      ) as ERC20ContractWrapper;

      if (!contract) {
        throw Error("Token Info - Contract undefined")
      }

      const fromEvent = contract.readerContract.filters.Transfer(account);

      contract.on(
        fromEvent,
        () => {
          console.log(
            "Token Info - Listener executing - Tokens sent",
            {
              chainId,
              token,
            }
          )

          updateBalance(pair);
        }
      );

      const toEvent = contract.readerContract.filters.Transfer(
        null,
        account
      );

      contract.on(
        toEvent,
        () => {
          console.log(
            "Token Info - Listener executing - Tokens received",
            {
              chainId,
              token,
            }
          )

          updateBalance(pair);
        }
      );

      console.log(
        "Token Info - Added balance listener",
        {
          chainId,
          token,
        }
      )
    },
    [account, getContract, updateBalance]
  );

  const getBalances = useCallback(
    (...pairs: Array<ChainIdTokenPair>) : Array<Balance> => {
      const result = pairs.map((pair: ChainIdTokenPair) => {
        const {
          chainId,
          token,
        } = pair;

        let balance = account && info[account]?.[chainId]?.[token.address]?.balance || undefined;

        if (balance === undefined) {
          if (account) {
            addBalanceListeners(pair);
            updateBalance(pair);
          }

          balance = {
            value: undefined,
            isLoading: !!account,
          }
        }

        return balance;
      });

      console.log(
        "Token Info - Get Balances",
        info
      );

      return result;
    },
    [account, addBalanceListeners, info, updateBalance]
  )

  const hasAllowance = useCallback(
    (
      pair: ChainIdTokenPair, spender: string
    ) : boolean => {
      const {
        chainId,
        token,
      } = pair;

      let allowances = account && info[account]?.[chainId]?.[token.address]?.allowances || undefined;

      if (allowances === undefined) {
        if (account) {
          addAllowanceListeners(
            pair,
            spender
          );
          updateAllowance(
            pair,
            spender
          );
        }

        allowances = new Set();
      }

      const value = allowances.has(spender);

      console.log(
        "Token Info - Get Allowance",
        {
          ...pair,
          spender,
          value,
        }
      );

      return value;
    },
    [account, addAllowanceListeners, info, updateAllowance]
  )

  return (
    <TokenInfoContext.Provider
      value={{
        getBalances,
        hasAllowance,
      }}
    >
      {props.children}
    </TokenInfoContext.Provider>
  );
};
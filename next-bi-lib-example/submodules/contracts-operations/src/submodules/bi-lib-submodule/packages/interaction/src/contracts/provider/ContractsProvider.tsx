import { useSupportedProviders } from "@integrations-lib/core";
import { ContractInterface } from "ethers";
import React, { Context, createContext, Dispatch, useCallback, useEffect, useState } from "react";
import { AnyAction } from "redux";

import { ContractsWrapper, ContractsWrapperConstructor } from "./ContractsWrapper";

type ContractsPerAddresses<Type> = Partial<{
  [key: string]: ContractsWrapper<Type>;
}>

type ContractsPerChains<Type> = Partial<{
  [key: number]: ContractsPerAddresses<Type>;
}>

export type ContractsContextValues<Type> = {
  getContract: (chainId: number, address: string) => ContractsWrapper<Type> | undefined;
}

export function createContractsContext<Type>() {
  return createContext<ContractsContextValues<Type>>({ getContract: () => undefined });
}

export interface ContractsProviderProps<Type> {
  abi: ContractInterface;
  children: any;
  ContractsContext: Context<ContractsContextValues<Type>>;
  ContractsWrapperImplementation: ContractsWrapperConstructor<Type>;
  dispatch: Dispatch<AnyAction>;
}

export function createContractsProvider<Type>() {
  return (props: ContractsProviderProps<Type>) => {
    const {
      abi,
      ContractsContext,
      ContractsWrapperImplementation,
      dispatch,
    } = props;

    const [contracts, setContracts] = useState<ContractsPerChains<Type>>({});

    const providers = useSupportedProviders();

    const createContract = useCallback(
      (
        chainId: number, address: string
      ) : ContractsWrapper<Type> | undefined => {
        if (!providers[chainId]) {
          return undefined;
        }

        const {
          provider,
          signer,
        } = providers[chainId];

        if (!provider) {
          return undefined;
        }

        const contract = new ContractsWrapperImplementation(
          address,
          abi,
          chainId,
          provider,
          signer,
          dispatch
        ) as ContractsWrapper<Type>;

        console.log(
          'Contracts Provider - Contract created',
          {
            address,
            provider,
            signer,
            contract,
          }
        )

        setContracts(contracts => ({
          ...contracts,
          [chainId]: {
            ...contracts[chainId],
            [address]: contract,
          }
        }))

        return contract;
      },
      [abi, ContractsWrapperImplementation, dispatch, providers]
    )

    const getContract = useCallback(
      (
        chainId: number, address: string
      ) : ContractsWrapper<Type> | undefined => {
        let contract : ContractsWrapper<Type> | undefined = contracts[chainId]?.[address] || undefined;

        if (contract === undefined) {
          contract = createContract(
            chainId,
            address
          )
        }

        return contract;
      },
      [contracts, createContract]
    )

    useEffect(
      () => {
        Object.keys(providers).map(Number).forEach((chainId: number) => {
          const {
            signer, provider
          } = providers[chainId];

          if (signer === undefined) {
            throw Error("Contracts Provider - Signer undefined");
          }

          if (provider === undefined) {
            throw Error("Contracts Provider - Provider undefined");
          }

          Object.keys(contracts[chainId] || {}).forEach((address: string) => {
            let contract : ContractsWrapper<Type> | undefined = contracts[chainId]?.[address] || undefined;

            const newSignerType = signer?.provider?.constructor.name;
            const oldSignerType = contract?.writerContract?.signer?.provider?.constructor.name;

            if (contract && newSignerType !== oldSignerType) {
              contract.update(
                chainId,
                signer,
                provider
              );

              console.log(
                "Contracts Provider - Updated contract",
                {
                  chainId,
                  address,
                  contract,
                  reason: {
                    newSignerType,
                    oldSignerType,
                  },
                }
              )
            }
          });
        });
      },
      [contracts, providers]
    );

    return (
      <ContractsContext.Provider
        value={{ getContract }}
      >
        {props.children}
      </ContractsContext.Provider>
    );
  }
}
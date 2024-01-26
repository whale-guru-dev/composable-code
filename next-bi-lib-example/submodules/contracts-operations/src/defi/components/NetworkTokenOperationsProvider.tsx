import { useConnector, useSupportedProviders } from "@integrations-lib/core";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { getNativeTokenPrice as getNativeTokenPriceAPI, getTokenPrice as getTokenPriceAPI } from "../../api";
import { TokenInfo } from "../../defi/components/TokenInfo";
import { addNotification } from "../../store/notifications/slice";
import { Token } from "../../store/supportedTokens/slice";
import { ERC20ContractsContext, ERC20ContractWrapper, TokenInfoContext } from "../../submodules/bi-lib-submodule/packages/interaction/src/tokens";
import { Balance } from "../../submodules/bi-lib-submodule/packages/interaction/src/tokens/balances/TokenInfo";
import { toTokenUnitsBN } from "../../submodules/bi-lib-submodule/packages/interaction/src/tokens/utils";
import { contractAddresses, SwapAmmID, TestSupportedNetworkId } from "../constants";
import { HoldingContractWrapper } from "../contracts/wrappers/HoldingContractWrapper";
import { VaultContractWrapper } from "../contracts/wrappers/VaultContractWrapper";
import { HoldingContractsContext, HoldingContractsProvider } from "./HoldingContractsProvider";
import { VaultContractsContext, VaultContractsProvider } from "./VaultContractsProvider";

export interface NetworkTokenKeyPair {
  networkKey: string;
  tokenKey: string;
}

export interface NetworkTokenOperations {
  setNetwork: (networkKey: string, chainId: TestSupportedNetworkId | undefined) => void;
  setToken: (tokenKey: string, token: Token | undefined) => void;

  getNetwork: (networkKey: string) => TestSupportedNetworkId | undefined;
  getToken: (tokenKey: string) => Token | undefined;

  getEthBalance: (networkKey: string) => BigNumber | undefined;
  getNativeTokenPrice: (networkKey: string) => number | undefined;
  getNativeTokenAmountDecimals: (networkKey: string) => number;

  approveFunds: (networkKey: string, tokenKey: string) => void;
  canApproveFunds: (networkKey: string, tokenKey: string) => boolean;
  canDepositFunds: (networkKey: string, tokenKey: string, value: BigNumber) => boolean;
  canSwapFunds: (sourceNetworkKey: string, sourceTokenKey: string, destinationNetworkKey: string, destinationTokenKey: string, amount: BigNumber, destinationAddress: string | undefined, deadlineMinutes: number, amm: SwapAmmID | undefined, amountOutMin: BigNumber) => boolean;
  depositFunds: (networkKey: string, tokenKey: string, value: BigNumber) => void;
  getBalance: (networkKey: string, tokenKey: string) => Balance;
  getLiquidity: (networkKey: string, tokenKey: string) => BigNumber | undefined;
  getTokenPrice: (networkKey: string, tokenKey: string) => number | undefined;
  getTokenAmountDecimals: (networkKey: string, tokenKey: string) => number;
  hasApprovedFunds: (networkKey: string, tokenKey: string) => boolean;
  swapFunds: (sourceNetworkKey: string, sourceTokenKey: string, destinationNetworkKey: string, destinationTokenKey: string, amount: BigNumber, destinationAddress: string, deadlineMinutes: number, amm: SwapAmmID, amountOutMin: BigNumber, swapToNative: boolean) => void;

  getBalanceSum: (keys: Array<NetworkTokenKeyPair>) => Balance;
}

const defaultEmptyFunction = () => console.warn("Empty function")

const defaultOperations: NetworkTokenOperations = {
  getNetwork: () => undefined,
  getToken: () => undefined,
  getTokenPrice: () => undefined,
  getTokenAmountDecimals: () => 2,
  getEthBalance: () => undefined,
  getNativeTokenPrice: () => undefined,
  getNativeTokenAmountDecimals: () => 2,
  setNetwork: defaultEmptyFunction,
  setToken: defaultEmptyFunction,
  getBalanceSum: () => ({
    value: undefined,
    isLoading: false,
  }),
  getBalance: () => ({
    value: undefined,
    isLoading: false,
  }),
  getLiquidity: () => undefined,
  hasApprovedFunds: () => false,
  canApproveFunds: () => false,
  approveFunds: defaultEmptyFunction,
  canDepositFunds: () => false,
  canSwapFunds: () => false,
  depositFunds: defaultEmptyFunction,
  swapFunds: defaultEmptyFunction,
} as const;

export const NetworkTokenOperationsContext = createContext<NetworkTokenOperations>(defaultOperations);

export interface NetworkTokenOperationsProviderProps {
  children: any;
  openConfirmation: () => void;
  closeConfirmation: () => void;
}

const NetworkTokenOperationsProvider = ({
  closeConfirmation,
  openConfirmation,
  children,
}: NetworkTokenOperationsProviderProps) => {
  const [networks, setNetworks] = useState<Map<string, TestSupportedNetworkId | undefined>>(new Map());
  const [tokens, setTokens] = useState<Map<string, Token | undefined>>(new Map());

  const setNetwork = useCallback(
    (
      networkKey: string, chainId: TestSupportedNetworkId | undefined
    ) => setNetworks(networks => new Map(networks.set(
      networkKey,
      chainId
    ))),
    []
  )

  const setToken = useCallback(
    (
      tokenKey: string, token: Token | undefined
    ) => setTokens(tokens => new Map(tokens.set(
      tokenKey,
      token
    ))),
    []
  )

  const getNetwork = useCallback(
    (networkKey: string) => networks.get(networkKey),
    [networks]
  )

  const getToken = useCallback(
    (tokenKey: string) => tokens.get(tokenKey),
    [tokens]
  )

  const {
    hasAllowance, getBalances
  } = useContext(TokenInfoContext);

  const balanceRequests = useCallback(
    (
      network: TestSupportedNetworkId, token: Token
    ) => network && token && [{
      chainId: network,
      token,
    }] || [],
    []
  );

  const getBalance = useCallback(
    (
      networkKey: string, tokenKey: string
    ) => {
      const network = networks.get(networkKey);
      const token = tokens.get(tokenKey);

      if (network && token) {
        return getBalances(...balanceRequests(
          network,
          token
        ))[0];
      }

      return {
        value: undefined,
        isLoading: false,
      }
    },
    [balanceRequests, getBalances, networks, tokens]
  );

  const getBalanceSum = useCallback(
    (keys: Array<NetworkTokenKeyPair>) => {
      let balanceOnAllNetworks = {
        value: undefined,
        isLoading: false,
      } as Balance;

      keys.forEach(({
        networkKey,
        tokenKey,
      }: NetworkTokenKeyPair) => {
        const balance = getBalance(
          networkKey,
          tokenKey
        );

        balanceOnAllNetworks.isLoading ||= balance.isLoading;

        if (balance.value) {
          balanceOnAllNetworks.value = balanceOnAllNetworks.value ? balanceOnAllNetworks.value.plus(balance.value) : balance.value;
        }
      });

      return balanceOnAllNetworks;
    },
    [getBalance]
  );

  const vaultContractAddress = useCallback(
    (network: TestSupportedNetworkId | undefined) => network && contractAddresses[network]?.vault,
    []
  );

  const hasApprovedFunds = useCallback(
    (
      networkKey: string, tokenKey: string
    ) => {
      const network = networks.get(networkKey);
      const token = tokens.get(tokenKey);
      const contractAddress = vaultContractAddress(network);

      if (!network || !token || !contractAddress) {
        return false;
      }

      return hasAllowance(
        {
          chainId: network,
          token,
        },
        contractAddress
      );
    },
    [networks, tokens, hasAllowance, vaultContractAddress]
  );

  const { getContract: getERC20Contract } = useContext(ERC20ContractsContext);

  const erc20Contract = useCallback(
    (
      network: TestSupportedNetworkId, token: Token
    ) => {
      const contractAddress = token.address;

      if (!contractAddress) {
        return undefined;
      }

      return getERC20Contract(
        network,
        contractAddress
      ) as ERC20ContractWrapper || undefined;
    },
    [getERC20Contract]
  );

  const dispatch = useDispatch();

  const { account } = useConnector('metamask');
  const providers = useSupportedProviders();

  const canApproveFunds = useCallback(
    (
      networkKey: string, tokenKey: string
    ) => {
      const network = networks.get(networkKey);
      const token = tokens.get(tokenKey);

      return (
        !!network &&
        !!token &&
        !!account &&
        !!erc20Contract(
          network,
          token
        ) &&
        !!vaultContractAddress(network) &&
        providers[network]?.connectorType === "metamask"
      );
    },
    [account, erc20Contract, networks, providers, tokens, vaultContractAddress]
  );

  const approveFunds = useCallback(
    (
      networkKey: string, tokenKey: string
    ) => {
      if (!canApproveFunds(
        networkKey,
        tokenKey
      )) {
        return;
      }

      const network = networks.get(networkKey);
      const token = tokens.get(tokenKey);

      if (!network || !token) {
        return;
      }

      const contract = erc20Contract(
        network,
        token
      );
      const spender = vaultContractAddress(network);

      if (!contract || !spender) {
        return;
      }

      openConfirmation();
      contract
        .approve(spender)
        .then(closeConfirmation)
        .catch(() => {
          dispatch(addNotification({
            message: "Could not submit transaction.",
            type: "error",
          }));
          closeConfirmation();
        });
    },
    [
      canApproveFunds,
      closeConfirmation,
      dispatch,
      erc20Contract,
      networks,
      openConfirmation,
      tokens,
      vaultContractAddress,
    ]
  );

  const { getContract: getVaultContract } = useContext(VaultContractsContext);

  const vaultContract = useCallback(
    (network: TestSupportedNetworkId) => {
      const contractAddress = vaultContractAddress(network);

      if (!contractAddress) {
        return undefined;
      }

      return getVaultContract(
        network,
        contractAddress
      ) as VaultContractWrapper || undefined;
    },
    [getVaultContract, vaultContractAddress]
  );

  const canDepositFunds = useCallback(
    (
      networkKey: string, tokenKey: string, value: BigNumber
    ) => {
      const network = networks.get(networkKey);
      const token = tokens.get(tokenKey);

      return (
        !!network &&
        !!token &&
        !!account &&
        !!vaultContract(network) &&
        !value.isZero() &&
        providers[network]?.connectorType === "metamask"
      );
    },
    [
      account,
      networks,
      providers,
      tokens,
      vaultContract,
    ]
  );

  const depositFunds = useCallback(
    (
      networkKey: string, tokenKey: string, value: BigNumber
    ) => {
      if (!canDepositFunds(
        networkKey,
        tokenKey,
        value
      )) {
        return;
      }

      const network = networks.get(networkKey);
      const token = tokens.get(tokenKey);

      if (!network || !token) {
        return;
      }

      const contract = vaultContract(network);

      if (!contract) {
        return;
      }

      openConfirmation();
      contract
        .providePassiveLiquidity(
          value,
          token.address,
        )
        .then(closeConfirmation)
        .catch(() => {
          dispatch(addNotification({
            message: "Could not submit transaction.",
            type: "error",
          }));
          closeConfirmation();
        });
    },
    [
      closeConfirmation,
      canDepositFunds,
      dispatch,
      networks,
      openConfirmation,
      tokens,
      vaultContract,
    ]
  );

  const [tokenPrices, setTokenPrices] = useState<Map<string, number | undefined>>(new Map());
  const [nativeTokenPrices, setNativeTokenPrices] = useState<Map<string, number | undefined>>(new Map());

  const [tokenAmountDecimals, setTokenAmountDecimals] = useState<Map<string, number | undefined>>(new Map());
  const [nativeTokenAmountDecimals, setNativeTokenAmountDecimals] = useState<Map<string, number | undefined>>(new Map());

  useEffect(
    () => {
      networks.forEach((
        network: TestSupportedNetworkId | undefined, networkKey: string
      ) => {
        if (network) {
          getNativeTokenPriceAPI(network).then((value: number) => {
            setNativeTokenPrices(tokenPrices => new Map(tokenPrices.set(
              networkKey,
              value
            )));
            setNativeTokenAmountDecimals(tokenAmountDecimals => new Map(tokenAmountDecimals.set(
              networkKey,
              Math.max(
                value?.toString().split(".")?.[0]?.length || 0,
                defaultOperations.getNativeTokenAmountDecimals(networkKey)
              )
            )));
          });

          tokens.forEach((
            token: Token | undefined, tokenKey: string
          ) => {
            if (token) {
              getTokenPriceAPI(
                network,
                token.address
              ).then((value: number) => {
                setTokenPrices(tokenPrices => new Map(tokenPrices.set(
                  networkKey + '-' + tokenKey,
                  value
                )));
                setTokenAmountDecimals(tokenAmountDecimals => new Map(tokenAmountDecimals.set(
                  networkKey + '-' + tokenKey,
                  Math.max(
                    value?.toString().split(".")?.[0]?.length || 0,
                    defaultOperations.getTokenAmountDecimals(
                      networkKey,
                      tokenKey
                    )
                  )
                )));
              });
            }
          })
        }
      })
    },
    [networks, tokens]
  );

  const getTokenPrice = useCallback(
    (
      networkKey: string, tokenKey: string
    ) => tokenPrices.get(networkKey + '-' + tokenKey),
    [tokenPrices]
  )

  const getNativeTokenPrice = useCallback(
    (networkKey: string) => nativeTokenPrices.get(networkKey),
    [nativeTokenPrices]
  )

  const getTokenAmountDecimals = useCallback(
    (
      networkKey: string, tokenKey: string
    ) => tokenAmountDecimals.get(networkKey + '-' + tokenKey) || defaultOperations.getTokenAmountDecimals(
      networkKey,
      tokenKey
    ),
    [tokenAmountDecimals]
  )

  const getNativeTokenAmountDecimals = useCallback(
    (networkKey: string) => nativeTokenAmountDecimals.get(networkKey) || defaultOperations.getNativeTokenAmountDecimals(networkKey),
    [nativeTokenAmountDecimals]
  )

  const [ethBalances, setEthBalances] = useState<Map<string, BigNumber | undefined>>(new Map());

  const getEthBalance = useCallback(
    (networkKey: string) => ethBalances.get(networkKey),
    [ethBalances]
  )

  useEffect(
    () => {
      networks.forEach((
        network: TestSupportedNetworkId | undefined, networkKey: string
      ) => {
        if (network) {
          const blockchainProvider = providers[network];
          if (blockchainProvider) {
            const { provider } = blockchainProvider;

            if (account && provider) {
              provider
                ?.getBalance(account)
                .then((value: ethers.BigNumber) =>
                  setEthBalances(ethBalances => new Map(ethBalances.set(
                    networkKey,
                    toTokenUnitsBN(
                      value.toString(),
                      18
                    )
                  ))));
            }
          }
        }
      });
    },
    [account, networks, providers]
  );

  const [liquidities, setLiquidities] = useState<Map<string, BigNumber | undefined>>(new Map());

  const getLiquidity = useCallback(
    (
      networkKey: string, tokenKey: string
    ) => liquidities.get(networkKey + '-' + tokenKey),
    [liquidities]
  )

  const { getContract: getHoldingContract } = useContext(HoldingContractsContext);

  const holdingContractAddress = useCallback(
    (network: TestSupportedNetworkId | undefined) => network && contractAddresses[network]?.holding,
    []
  );

  const holdingContract = useCallback(
    (network: TestSupportedNetworkId) => {
      const contractAddress = holdingContractAddress(network);

      if (!contractAddress) {
        return undefined;
      }

      return getHoldingContract(
        network,
        contractAddress
      ) as HoldingContractWrapper || undefined;
    },
    [
      getHoldingContract,
      holdingContractAddress,
    ]
  );

  useEffect(
    () => {
      networks.forEach((
        network: TestSupportedNetworkId | undefined, networkKey: string
      ) => {
        if (network) {
          tokens.forEach((
            token: Token | undefined, tokenKey: string
          ) => {
            if (token) {
              holdingContract(network)
                ?.getTokenLiquidity(token.address)
                .then((value: ethers.BigNumber) => {
                  setLiquidities(liquidities => new Map(liquidities.set(
                    networkKey + '-' + tokenKey,
                    new BigNumber(value.toString())
                  )));
                });
            }
          })
        }
      });
    },
    [holdingContract, networks, tokens]
  );

  const canSwapFunds = useCallback(
    (
      sourceNetworkKey: string, sourceTokenKey: string, destinationNetworkKey: string, destinationTokenKey: string, amount: BigNumber, destinationAddress: string | undefined, deadlineMinutes: number, amm: SwapAmmID | undefined, amountOutMin: BigNumber
    ) => {
      const sourceNetwork = networks.get(sourceNetworkKey);
      const sourceToken = tokens.get(sourceTokenKey);
      const destinationNetwork = networks.get(destinationNetworkKey);
      const destinationToken = tokens.get(destinationTokenKey);

      return (
        !amountOutMin.isLessThanOrEqualTo(0) &&
        !!deadlineMinutes &&
        !!destinationAddress &&
        !!account &&
        !!sourceNetwork &&
        !!destinationNetwork &&
        !!sourceToken &&
        !!destinationToken &&
        !!vaultContract(sourceNetwork) &&
        !amount.isLessThanOrEqualTo(0) &&
        !!destinationToken &&
        !!amm &&
        providers[sourceNetwork]?.connectorType === "metamask"
      );
    },
    [
      account,
      networks,
      providers,
      tokens,
      vaultContract,
    ]
  );

  const swapFunds = useCallback(
    (
      sourceNetworkKey: string, sourceTokenKey: string, destinationNetworkKey: string, destinationTokenKey: string, amount: BigNumber, destinationAddress: string, deadlineMinutes: number, amm: SwapAmmID, amountOutMin: BigNumber, swapToNative: boolean
    ) => {
      if (!canSwapFunds(
        sourceNetworkKey,
        sourceTokenKey,
        destinationNetworkKey,
        destinationTokenKey,
        amount,
        destinationAddress,
        deadlineMinutes,
        amm,
        amountOutMin
      )) {
        return;
      }

      const sourceNetwork = networks.get(sourceNetworkKey);
      const sourceToken = tokens.get(sourceTokenKey);
      const destinationNetwork = networks.get(destinationNetworkKey);
      const destinationToken = tokens.get(destinationTokenKey);

      if (!sourceNetwork || !destinationNetwork || !sourceToken || !destinationToken) {
        return;
      }

      const contract = vaultContract(sourceNetwork);

      if (!contract) {
        return;
      }

      openConfirmation();
      contract
        .transferERC20ToLayer(
          amount,
          sourceToken.address,
          destinationAddress,
          destinationNetwork,
          deadlineMinutes,
          destinationToken.address,
          amm,
          amountOutMin.toNumber(),
          swapToNative
        )
        .then(closeConfirmation)
        .catch(() => {
          dispatch(addNotification({
            message: "Could not submit transaction.",
            type: "error",
          }));
          closeConfirmation();
        });
    },
    [
      closeConfirmation,
      canSwapFunds,
      dispatch,
      networks,
      openConfirmation,
      tokens,
      vaultContract,
    ]
  );


  return (
    <NetworkTokenOperationsContext.Provider
      value={{
        getLiquidity,
        getNativeTokenPrice,
        getNativeTokenAmountDecimals,
        getNetwork,
        getToken,
        getTokenPrice,
        getTokenAmountDecimals,
        getEthBalance,
        setNetwork,
        setToken,
        getBalanceSum,
        getBalance,
        hasApprovedFunds,
        canApproveFunds,
        approveFunds,
        canDepositFunds,
        depositFunds,
        canSwapFunds,
        swapFunds,
      }}
    >
      {children}
    </NetworkTokenOperationsContext.Provider>
  );
}

const NetworkTokenOperationsProviderWrapper = (props: NetworkTokenOperationsProviderProps) =>
  <TokenInfo>
    <HoldingContractsProvider>
      <VaultContractsProvider>
        <NetworkTokenOperationsProvider {...props} />
      </VaultContractsProvider>
    </HoldingContractsProvider>
  </TokenInfo>

export { NetworkTokenOperationsProviderWrapper as NetworkTokenOperationsProvider };
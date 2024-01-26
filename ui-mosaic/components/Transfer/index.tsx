/** @format */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { Autorenew, GppGood, Repeat } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Grid,
  Hidden,
  InputAdornment,
  Theme,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import BigNumber from "bignumber.js";
import { useAppDispatch, useAppSelector } from "store";

import { Heading } from "@/components/Heading";
import BigNumberInput from "../BigNumberInput";
import { TokenSelector } from "../MegaSelector/TokenSelector";
import { NetworkSelector } from "../MegaSelector/NetworkSelector";
import Button from "components/Button";
import { swap as Swap_Icon } from "assets/icons/menu";
import {
  CrossChainId,
  PartialTokenWithAmms,
  selectCustomTokens,
  selectMosaicTokens,
  selectSupportedTokens,
  SupportedAmm,
  SupportedTokens,
  Token,
  TransferPair,
  updateCustomToken,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import Timer from "tiny-timer";
import ExchangeButton from "../ExchangeButton";
import DestinationAddress from "./DestinationAddress";
import Details from "./Details";
import Warning from "./Warning";
import AMMSelector from "../AMMSelector";
import {
  SupportedNetworkId,
  ETHERIUM_MAINNET_NETWORK,
  liquidityFeePercentage,
  mosaicFeePercentage,
  SUPPORTED_NETWORKS,
  SupportedNetwork,
  SwapAmmID,
  TEST_SUPPORTED_NETWORKS,
  TestSupportedNetworkId,
  toNativeDisabledThreshold,
  supportedAMMs as allSupportedAMMs,
} from "@/submodules/contracts-operations/src/defi/constants";
import { getTokenId, TokenCompositeKey, TokenId, TokenMetaResult, useConnector, useTokenMetadata } from "@integrations-lib/core";
import { APIFees, getFees } from "@/submodules/contracts-operations/src/api";
import EnablePortionBox from "@/components/Earn/Vaults/DepositWithdraw/EnablePortionBox";
import {
  composeApproval,
  composeSwap,
  composeSwitchNetwork,
} from "@/components/Transfer/utils";
import {
  ConfirmationModal,
  Step,
} from "@/components/PreReview/ConfirmationModal";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { edgeStyleOverrides } from "@/components/MegaSelector/shared/utils";
import { useTransactionSettingsOptions } from "store/transactionSettingsOptions/hooks";
import { toBaseUnitBN, toTokenUnitsBN } from "@integrations-lib/interaction";
import { contractAddresses } from "@/phase2/constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      marginBottom: theme.spacing(3),
    },
    networks: {},
    max: {
      color: theme.palette.primary.main,
      fontSize: "16px",
      lineHeight: "24px",
      cursor: "pointer",
    },
    label: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(1),
    },
    symbol: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.text.primary,
      fontSize: "14px",
    },
  })
);

type ValidationState = {
  fromValid: boolean;
  toValid: boolean;
};

const Transfer = () => {
  const classes = useStyles();
  const minEthWalletGasRemaining = 0.05 as const;
  const tokensLoadingStep = 75;

  const {
    getNativeTokenAmountDecimals,
    getNativeTokenPrice,
    getTokenPrice,
    getTokenAmountDecimals,
    getEthBalance,
    setNetwork,
    setToken,
    getBalance,
    getLiquidity,
    hasApprovedFunds: _hasApprovedFunds,
    approveFunds: _approveFunds,
    swapFunds: _swapFunds,
    canSwapFunds,
  } = useContext(NetworkTokenOperationsContext);

  const [from, _setFrom] = useState<SupportedNetwork | undefined>(undefined);
  const [to, _setTo] = useState<SupportedNetwork | undefined>(undefined);

  const [fromTokenInitSample, setFromTokenInitSample] = useState<CrossChainId | undefined>(undefined);
  const [fromTokenInit, setFromTokenInit] = useState<boolean>(false);
  const [fromTokenId, setFromTokenId] = useState<TokenId | undefined>(undefined);

  const supportedTokens: SupportedTokens = useAppSelector(selectSupportedTokens);
  const mosaicNativeTokens = useAppSelector(selectMosaicTokens);
  const customTokens = useAppSelector(selectCustomTokens);

  const [supportedFromTokens, setSupportedFromTokens] = useState<Array<Token>>([]);

  useEffect(
    () => {
      setSupportedFromTokens(from ? [{
        ...from.nativeToken,
        amms: [...from.nativeToken.amms],
      }] : []);
    },
    [from]
  )

  useEffect(
    () => {
      setSupportedFromTokens(supportedFromTokens => {
        if (!from) {
          return supportedFromTokens;
        }

        const result = supportedFromTokens
          .filter((token: Token) => !mosaicNativeTokens.find((nativeToken: Token) => getTokenId(nativeToken) === getTokenId(token)))
          .concat(mosaicNativeTokens.filter((token: Token) => token.chainId === from.chainId))
          .sort((a: Token, b: Token) => a.image !== undefined && b.image === undefined ? -1 : 1)

        return result;
      });
    },
    [mosaicNativeTokens, from]
  )

  useEffect(
    () => {
      setSupportedFromTokens(supportedFromTokens => {
        if (!from) {
          return supportedFromTokens;
        }

        const result = supportedFromTokens
          .filter((token: Token) => !customTokens.find((customToken: Token) => getTokenId(customToken) === getTokenId(token)))
          .concat(customTokens.filter((token: Token) => token.chainId === from.chainId))
          .sort((a: Token, b: Token) => a.image !== undefined && b.image === undefined ? -1 : 1)

        return result;
      });
    },
    [customTokens, from]
  )

  const from_token = useMemo(
    () => {
      return supportedFromTokens.find((token: Token) => getTokenId(token) === fromTokenId)
    },
    [fromTokenId, supportedFromTokens]
  )

  const mosaicTransferPairs: Array<TransferPair> = useMemo(
    () =>
      (from !== undefined &&
        to !== undefined &&
        supportedTokens[from.chainId]?.mosaicTransferPairs.filter(
          (pair: TransferPair) => pair.destinationChainId === to.chainId
        )) ||
      [],
    [from, supportedTokens, to]
  );

  const availableTokenPairs: Array<TransferPair> = useMemo(
    () =>
      mosaicTransferPairs.filter(
        (pair: TransferPair) => pair.sourceToken.address === from_token?.address
      ),
    [from_token, mosaicTransferPairs]
  );

  const toNonNativeTokenIds = useMemo(
    () => {
      const toSupportedTokens = to && supportedTokens[to.chainId];

      return to && toSupportedTokens !== undefined && (toSupportedTokens.tokens as Array<TokenCompositeKey>)
        .map((token: TokenCompositeKey) => getTokenId(token))
      || []
    },
    [supportedTokens, to]
  )

  const [toTokensToLoad, setToTokensToLoad] = useState<number>(tokensLoadingStep);

  useEffect(
    () => {
      const h = setInterval(
        () => {
          setToTokensToLoad(toTokensToLoad => toTokensToLoad + tokensLoadingStep >= toNonNativeTokenIds.length ? toNonNativeTokenIds.length : toTokensToLoad + tokensLoadingStep);
        }
      , 1000)

      return () => clearInterval(h);
    }
  )

  const toNonNativeTokens: Array<TokenMetaResult> = useTokenMetadata(toNonNativeTokenIds.slice(0, toTokensToLoad));

  const [supportedToTokens, setSupportedToTokens] = useState<Array<Token>>([]);
  
  useEffect(
    () => {
      setSupportedToTokens(to && to.chainId !== ETHERIUM_MAINNET_NETWORK.chainId ? [{
        ...to.nativeToken,
        amms: [...to.nativeToken.amms],
      }] : []);
    },
    [from, to]
  )

  useEffect(
    () => {
      const newSupportedToTokens = to && toNonNativeTokens
        .filter((metadata: TokenMetaResult) => metadata.tokenMeta && !supportedToTokens.find((supportedToken: Token) => metadata.tokenMeta && getTokenId(supportedToken) === getTokenId(metadata.tokenMeta)))
        .map((metadata: TokenMetaResult, index: number) => {
          const storeToken = supportedTokens[to.chainId]?.tokens.find((currentStoreToken: PartialTokenWithAmms) => metadata.tokenMeta && getTokenId(currentStoreToken) === getTokenId(metadata.tokenMeta));
          return {
            ...storeToken,
            ...metadata.tokenMeta,
            image: metadata.tokenMeta?.image ? metadata.tokenMeta?.image : undefined,
            decimals: parseInt(metadata.tokenMeta?.decimals as unknown as string || ""), // TODO(Marko): Fix decimals type in tokenMeta to be string as it is
            crossChainId: metadata.tokenMeta?.symbol,
            amms: storeToken?.amms ? storeToken.amms : [],
            provider: storeToken?.provider ? storeToken.provider : 'custom',
          } as Token
        }) || [];
      
      if (newSupportedToTokens.length > 0) {
        setSupportedToTokens(supportedToTokens => supportedToTokens.concat(newSupportedToTokens).sort((a: Token, b: Token) => a.image !== undefined && b.image === undefined ? -1 : 1));
      }
    },
    [supportedToTokens, supportedTokens, to, toNonNativeTokens]
  )

  useEffect(
    () => {
      setSupportedToTokens(supportedToTokens => {
        if (!to) {
          return supportedToTokens;
        }

        const nativeTokensToUse = (!from_token || from_token.provider === 'native')
          ? availableTokenPairs
              .filter((pair: TransferPair) => pair.destinationChainId === to.chainId)
              .map((pair: TransferPair) => ({ ...pair.destinationToken }))
          : mosaicNativeTokens.filter((token: Token) => token.chainId === to.chainId);

        const result = supportedToTokens
          .filter((token: Token) => !nativeTokensToUse.find((nativeToken: Token) => getTokenId(nativeToken) === getTokenId(token)))
          .concat(nativeTokensToUse)
          .sort((a: Token, b: Token) => a.image !== undefined && b.image === undefined ? -1 : 1)

        return result;
      });
    },
    [availableTokenPairs, mosaicNativeTokens, to, from_token]
  )

  useEffect(
    () => {
      setSupportedToTokens(supportedToTokens => {
        if (!to) {
          return supportedToTokens;
        }

        const result = supportedToTokens
          .filter((token: Token) => !customTokens.find((customToken: Token) => getTokenId(customToken) === getTokenId(token)))
          .concat(customTokens.filter((token: Token) => token.chainId === to.chainId))
          .sort((a: Token, b: Token) => a.image !== undefined && b.image === undefined ? -1 : 1)

        return result;
      });
    },
    [customTokens, to]
  )

  const [toTokenInitSample, setToTokenInitSample] = useState<CrossChainId | undefined>(undefined);
  const [toTokenInit, setToTokenInit] = useState<boolean>(false);
  const [toTokenId, setToTokenId] = useState<TokenId | undefined>(undefined);

  const to_token = useMemo(
    () => {
      return supportedToTokens.find((token: Token) => getTokenId(token) === toTokenId)
    },
    [toTokenId, supportedToTokens]
  )

  const [amountValidation, setFromValidation] = useState<[boolean, string]>([
    true,
    "",
  ]);

  const [isAmountValid, amountValidationMessage] = amountValidation;

  const setFrom = useCallback(
    (value: SupportedNetwork | undefined) => {
      _setFrom(value);
      setNetwork(value?.chainId);
    },
    [setNetwork]
  );

  const setFromToken = useCallback(
    (value: Token | undefined) => {
      setFromTokenId(value ? getTokenId(value) : undefined);
      setToken(value);
    },
    [setToken]
  );

  const setTo = useCallback(
    (value: SupportedNetwork | undefined) => {
      _setTo(value);
      setNetwork(value?.chainId);
    },
    [setNetwork]
  );

  const setToToken = useCallback(
    (value: Token | undefined) => {
      setToTokenId(value ? getTokenId(value) : undefined);
      setToken(value);
    },
    [setToken]
  );

  const liquidity = useMemo(
    () => getLiquidity(to_token),
    [getLiquidity, to_token]
  );

  const fromTokenPrice = useMemo(
    () => getTokenPrice(from_token),
    [getTokenPrice, from_token]
  );

  const fromDecimals = useMemo(
    () => getTokenAmountDecimals(from_token),
    [getTokenAmountDecimals, from_token]
  );

  const toTokenPrice = useMemo(
    () => getTokenPrice(to_token),
    [getTokenPrice, to_token]
  );

  const toDecimals = useMemo(
    () => getTokenAmountDecimals(to_token),
    [getTokenAmountDecimals, to_token]
  );

  const toNativeTokenPrice = useMemo(
    () => getNativeTokenPrice(to?.chainId),
    [getNativeTokenPrice, to]
  );

  const toNativeDecimals = useMemo(
    () => getNativeTokenAmountDecimals(to?.chainId),
    [getNativeTokenAmountDecimals, to]
  );

  const ethBalance = useMemo(
    () => getEthBalance(from?.chainId),
    [getEthBalance, from]
  );

  const isFromTokenNative = useMemo(
    () => from && from_token && getTokenId(from_token) === getTokenId(from.nativeToken),
    [from, from_token]
  )

  const isToTokenNative = useMemo(
    () => to && to_token && getTokenId(to_token) === getTokenId(to.nativeToken),
    [to, to_token]
  )

  const {
    account,
    activate,
    chainId: connectedChainId,
  } = useConnector("metamask");

  const balance = useMemo(
    () => isFromTokenNative ? {
      value: ethBalance,
      isLoading: !!account && ethBalance === undefined,
    } : getBalance(from_token),
    [account, ethBalance, getBalance, from_token, isFromTokenNative]
  );

  const spenderVaultAddress = useMemo(
    () => from ? contractAddresses[from.chainId]?.vault : undefined,
    [from]
  )

  const hasApprovedFunds = useMemo(
    () => spenderVaultAddress ? _hasApprovedFunds(from_token, spenderVaultAddress) : false,
    [_hasApprovedFunds, spenderVaultAddress, from_token]
  );

  const approveFunds = useCallback(
    () => {
      if (!spenderVaultAddress) {
        return Promise.reject("Spender vault address not defined");
      }

      return _approveFunds(from_token, spenderVaultAddress)
    },
    [_approveFunds, spenderVaultAddress, from_token]
  );

  useEffect(() => {
    if (!from && TEST_SUPPORTED_NETWORKS[4]) {
      setFrom(TEST_SUPPORTED_NETWORKS[4]);
    }
  }, [from, setFrom]);

  useEffect(() => {
    if (!to && TEST_SUPPORTED_NETWORKS[42]) {
      setTo(TEST_SUPPORTED_NETWORKS[42]);
    }
  }, [to, setTo]);

  const [agreedSwap, setAgreedSwap] = useState<boolean>(false);

  const [ammUsed, setAmmUsed] = useState<boolean>(false);
  
  /* TODO(Marko): Fetch properly
  const allTransfers = useAppSelector(selectAllRelayerTransfers);
  const general = useAppSelector(selectRelayerVaultGeneral);
  */

  const [selectedAMM, setSelectedAMM] = useState<SupportedAmm | undefined>(
    undefined
  );

  useEffect(() => {
    if (to !== undefined) {
      const firstAmm = supportedTokens[to.chainId]?.supportedAmms?.[0];
      setSelectedAMM(firstAmm);
    }
  }, [to, supportedTokens]);

  const supportedAMMs: Array<SupportedAmm> = useMemo(
    () =>
      (from_token !== undefined && to_token !== undefined && from_token.amms.filter(
        (amm: SupportedAmm) => to_token.amms.find(
          (currentAmm: SupportedAmm) => currentAmm.ammId === amm.ammId)
        )
      ) || [],
    [from_token, to_token]
  );

  const [dest_address, setDestAddress] = useState<string>("");
  const [fees, setFees] = useState<APIFees | undefined>(undefined);

  const [searchForToken, setSearchForToken] = useState<TokenId | undefined>(undefined);

  const customTokensMetadata: Array<TokenMetaResult> = useTokenMetadata(searchForToken ? [searchForToken] : []);

  const dispatch = useAppDispatch();

  useEffect(
    () => {
      if (customTokensMetadata.length > 0) {
        const token = customTokensMetadata[0];
        if (!token.isLoading && token.tokenMeta) {
          dispatch(updateCustomToken({
            ...token.tokenMeta,
            amms: [],
            provider: 'custom',
            crossChainId: token.tokenMeta.symbol,
            chainId: token.tokenMeta.chainId as SupportedNetworkId,
          }));
          setSearchForToken(undefined);
        }
      }
    },
    [customTokensMetadata, dispatch]
  )

  const [from_value, setFromValue] = useState<BigNumber>(new BigNumber(0));
  const [lockTimer, _] = useState(new Timer());
  const [_t, /*timeLeft,*/ setTimeLeft] = useState(0);
  const { slippage, deadline } = useTransactionSettingsOptions();

  const toValueFromValuePriceRation = useMemo(
    () =>
      (fromTokenPrice && toTokenPrice && toTokenPrice / fromTokenPrice) || 1,
    [fromTokenPrice, toTokenPrice]
  );

  const fromValueToValuePriceRatio = useMemo(
    () => 1 / toValueFromValuePriceRation,
    [toValueFromValuePriceRation]
  )

  /*
  const latestTimestamp = useCallback(() => {
    if (!account) {
      return 0;
    }

    const v = Object.values(allTransfers)
      .filter(
        (x) =>
          x.fromChainId === from?.chainId &&
          x.fromAddress.toLowerCase() === account.toLowerCase()
      )
      .sort((a, b) => b.toTimestamp - a.toTimestamp);

    return v.length ? v[0].toTimestamp : 0;
  }, [account, allTransfers, from]);
  */

  const handleChangeToToken = useCallback(
    (value: Token | undefined) => {
      setToToken(value);
      setAmmUsed(value?.symbol !== from_token?.symbol);
    },
    [from_token, setToToken]
  );

  useEffect(
    () => {
      if (to && !toTokenId && !toTokenInit && supportedToTokens[0]?.chainId === to.chainId) {
        const analogToken = toTokenInitSample ? supportedToTokens.find((token: Token) => token.crossChainId === toTokenInitSample) : undefined;
        handleChangeToToken(analogToken || supportedToTokens[0]);
        setToTokenInit(true);
      }
    },
    [handleChangeToToken, toTokenInit, toTokenId, supportedToTokens, to, toTokenInitSample]
  )

  const handleChangeFromToken = useCallback(
    (value: Token | undefined) => {
      setFromToken(value);
    },
    [setFromToken]
  );

  useEffect(
    () => {
      if (from && !fromTokenId && !fromTokenInit && supportedFromTokens[0]?.chainId === from.chainId) {
        const analogToken = fromTokenInitSample ? supportedFromTokens.find((token: Token) => token.crossChainId === fromTokenInitSample) : undefined;
        handleChangeFromToken(analogToken || supportedFromTokens[0]);
        setFromTokenInit(true);
      }
    },
    [fromTokenInit, fromTokenId, handleChangeFromToken, supportedFromTokens, from, fromTokenInitSample]
  )

  useEffect(
    () => {
      setAmmUsed(from_token?.symbol !== to_token?.symbol);
    },
    [from_token, to_token]
  )

  const fromValid =
    !!from_token &&
    supportedFromTokens.some(
      (token: Token) => token.address === from_token.address
    );

  /*
  useEffect(() => {
    const depositTimeout =
      (fromValid &&
        from_token !== undefined &&
        from !== undefined &&
        general[from_token.symbol]?.[from.chainId].depositTimeout * 1000) ||
      0;

    if (latestTimestamp() && depositTimeout && account) {
      const now = new Date().getTime();

      if (latestTimestamp() + depositTimeout > now) {
        lockTimer.on("tick", (ms: number) => setTimeLeft(ms));
        lockTimer.start(latestTimestamp() + depositTimeout - now);
      }
    }

    return () => {
      lockTimer.stop();
    };
  }, [
    account,
    from,
    from_token,
    fromValid,
    general,
    latestTimestamp,
    lockTimer,
  ]);
  */

  const handleChangeFrom = useCallback(
    (network: SupportedNetwork | undefined) => {
      setFrom(network);

      if (to?.chainId === network?.chainId) {
        setTo(from)
      }

      setFromTokenInitSample(from_token?.crossChainId)
      setFromTokenId(undefined);
      setFromTokenInit(false);
    },
    [from, from_token, setFrom, setTo, to]
  );

  const handleChangeTo = useCallback(
    (network: SupportedNetwork | undefined) => {
      setTo(network);

      if (from?.chainId === network?.chainId) {
        setFrom(to)
      }

      if (network?.chainId === ETHERIUM_MAINNET_NETWORK.chainId) {
        setAgreedSwap(false);
      }

      setToTokenInitSample(to_token?.crossChainId)
      setToTokenId(undefined);
      setToTokenInit(false);
    },
    [from, setFrom, setTo, to_token, to]
  );

  const handleExchangeNetwork = useCallback(() => {
    handleChangeFrom(to);
    handleChangeTo(from);

    if (!from_token || !to_token) {
      return;
    }

    const newToToken = supportedFromTokens.find((t: Token) => t.crossChainId === to_token.crossChainId);
    handleChangeToToken(newToToken);

    const newFromToken = supportedToTokens.find((t: Token) => t.crossChainId === from_token.crossChainId);
    handleChangeFromToken(newFromToken);
  }, [handleChangeFrom, handleChangeFromToken, handleChangeTo, handleChangeToToken, from, from_token, supportedFromTokens, supportedToTokens, to, to_token]);

  const disableExchangeTokenButton = useMemo(
    () => {
      if (!from_token || !to_token) {
        return true;
      }

      const newToToken = supportedToTokens.find((t: Token) => t.crossChainId === from_token.crossChainId);
      const newFromToken = supportedFromTokens.find((t: Token) => t.crossChainId === to_token.crossChainId);

      return !newToToken || !newFromToken;
    },
    [from_token, supportedToTokens, supportedFromTokens, to_token]
  )

  const handleExchangeToken = useCallback(() => {
    if (!from_token || !to_token) {
      return;
    }
    
    const newToToken = supportedToTokens.find((t: Token) => t.crossChainId === from_token.crossChainId);
    handleChangeToToken(newToToken);

    const newFromToken = supportedFromTokens.find((t: Token) => t.crossChainId === to_token.crossChainId);
    handleChangeFromToken(newFromToken);
  }, [from_token, handleChangeFromToken, handleChangeToToken, supportedFromTokens, supportedToTokens, to_token]);

  const minFromValue = useMemo(
    () => from_token?.minTransferAmount ? toTokenUnitsBN(from_token?.minTransferAmount, from_token.decimals) : new BigNumber(Number.EPSILON),
    [from_token]
  );

  const maxFromValue = useMemo(() => {
    const balanceValue = balance?.value || new BigNumber(0);
    const maxTransferAmount = from_token?.maxTransferAmount ? toTokenUnitsBN(from_token.maxTransferAmount, from_token.decimals) : new BigNumber(Infinity);
    return balanceValue.isLessThan(maxTransferAmount)
      ? balanceValue
      : maxTransferAmount;
  }, [balance, from_token]);

  const handleMax = useCallback(() => {
    setFromValue(maxFromValue);
  }, [maxFromValue]);

  const swapAmmParameter: SwapAmmID | undefined = useMemo(
    () => (ammUsed ? selectedAMM?.ammId : "0"),
    [ammUsed, selectedAMM]
  );

  const swapDestinationAddress = useMemo(
    () => dest_address || account,
    [account, dest_address]
  );

  const grossToValue = useMemo(
    () => from_value.times(toValueFromValuePriceRation),
    [from_value, toValueFromValuePriceRation]
  );

  const liquidityFee = useMemo(
    () =>
      fees?.mosaicFeePercentage
        ? grossToValue.times(
            (fees.mosaicFeePercentage / 100) * liquidityFeePercentage
          )
        : new BigNumber(0),
    [fees, grossToValue]
  );

  const toTokenPriceToNativeTokenPriceRatio = useMemo(
    () =>
      (toTokenPrice &&
        toNativeTokenPrice &&
        toTokenPrice / toNativeTokenPrice) ||
      1,
    [toTokenPrice, toNativeTokenPrice]
  );

  const transactionFee = useMemo(
    () =>
      fees?.baseFee
        ? fees.baseFee.times(toTokenPriceToNativeTokenPriceRatio)
        : new BigNumber(0),
    [fees, toTokenPriceToNativeTokenPriceRatio]
  );

  const mosaicFee = useMemo(
    () =>
      fees?.mosaicFeePercentage
        ? grossToValue.times(
            (fees.mosaicFeePercentage / 100) * mosaicFeePercentage
          )
        : new BigNumber(0),
    [fees, grossToValue]
  );

  const totalToValue = useMemo(
    () =>
      grossToValue.minus(liquidityFee).minus(mosaicFee).minus(transactionFee),
    [grossToValue, liquidityFee, mosaicFee, transactionFee]
  );

  const minimumReceived = useMemo(
    () => ammUsed ? totalToValue.times(1 - slippage / 100) : totalToValue,
    [ammUsed, slippage, totalToValue]
  );

  const minimumReceivedUSD = useMemo(
    () =>
      (toTokenPrice && minimumReceived?.times(toTokenPrice).toNumber()) || 0,
    [minimumReceived, toTokenPrice]
  );

  const toNativeValueUSD = 10;

  const to_value = useMemo(
    () =>
      agreedSwap && toTokenPrice
        ? new BigNumber((minimumReceivedUSD - toNativeValueUSD) / toTokenPrice)
        : minimumReceived,
    [
      agreedSwap,
      minimumReceived,
      minimumReceivedUSD,
      toNativeValueUSD,
      toTokenPrice,
    ]
  );

  const toNativeValue = useMemo(
    () =>
      agreedSwap && toNativeTokenPrice
        ? new BigNumber(toNativeValueUSD / toNativeTokenPrice)
        : new BigNumber(0),
    [agreedSwap, toNativeValueUSD, toNativeTokenPrice]
  );

  const toValueValid = to_value > new BigNumber(0);
  const toValid =
    !!to_token &&
    supportedToTokens.some(
      (token: Token) => token.address === to_token.address
    );

  const swapFunds = useCallback(
    () =>
      _swapFunds(
        from_token,
        to_token,
        from_value,
        swapDestinationAddress || "",
        deadline,
        swapAmmParameter || ("1" as SwapAmmID),
        minimumReceived,
        agreedSwap
      ),
    [
      _swapFunds,
      from_value,
      swapDestinationAddress,
      deadline,
      swapAmmParameter,
      minimumReceived,
      agreedSwap,
      to_token,
      from_token,
    ]
  );

  const shouldShowEthWarning = useMemo(
    () => isAmountValid && (isFromTokenNative
      ? (ethBalance?.minus(from_value))?.isLessThan(minEthWalletGasRemaining)
      : ethBalance?.isLessThan(minEthWalletGasRemaining)
    ),
    [isAmountValid, isFromTokenNative, ethBalance, from_value]
  )

  const buttonDisabled = useMemo(
    () =>
      !from_token ||
      minFromValue.isLessThanOrEqualTo(0) ||
      from_value.isLessThan(minFromValue) ||
      from_value.isGreaterThan(maxFromValue) ||
      !to_token ||
      minimumReceived.isLessThanOrEqualTo(0) ||
      !deadline ||
      !swapDestinationAddress ||
      !account ||
      !swapAmmParameter ||
      shouldShowEthWarning ||
      !isAmountValid ||
      !canSwapFunds(from_token,
        to_token,
        from_value,
        swapDestinationAddress,
        deadline,
        swapAmmParameter,
        minimumReceived
      ),
    [
      account,
      canSwapFunds,
      from_token,
      from_value,
      to_token,
      maxFromValue,
      minFromValue,
      minimumReceived,
      deadline,
      swapAmmParameter,
      swapDestinationAddress,
      isAmountValid,
      shouldShowEthWarning,
    ]
  );

  useEffect(() => {
    if (fromValid && toValid && from && from_token && swapAmmParameter) {
      getFees(
        "transfer_fee",
        swapAmmParameter,
        toBaseUnitBN(from_value.toString(), from_token.decimals),
        from_token.address,
        from.chainId
      ).then((value: APIFees) => {
        setFees(value);
      });
    }
  }, [from, from_token, from_value, fromValid, swapAmmParameter, toValid]);

  const networkSwitchDisabled = from && from.chainId === connectedChainId;
  const canHaveSwitchNetworkStep = to && !networkSwitchDisabled;
  const isFundsSufficient =
    Number(from_value.toString()) > Number(maxFromValue.toString());
  const switchNetworkStep: Step = useMemo(
    () => ({
      ...composeSwitchNetwork(connectedChainId as TestSupportedNetworkId, from?.chainId),
      action: () => {
        return new Promise<void>((resolve, reject) => {
          const result: Promise<void> = activate(from) as Promise<void>;
          result.then(() => resolve()).catch(() => reject());
        });
      },
      icon: <Repeat />,
    }),
    [activate, from, connectedChainId]
  );

  const approveFundsStep: Step = useMemo(
    () => ({
      ...composeApproval(),
      action: approveFunds,
      icon: <GppGood />,
    }),
    [approveFunds]
  );

  const swapFundsStep: Step = useMemo(
    () => ({
      ...composeSwap(from_token, to_token, from_value, to_value),
      action: swapFunds,
      icon: <Autorenew />,
    }),
    [from_token, to_token, from_value, swapFunds, to_value]
  );

  const allPossibleModalSteps: Array<Step> = useMemo(
    () => [switchNetworkStep, approveFundsStep, swapFundsStep],
    [switchNetworkStep, approveFundsStep, swapFundsStep]
  );

  const executingStepsIndices: Array<number> = useMemo(
    () => [
      ...(canHaveSwitchNetworkStep ? [0] : []), // TODO(Marko): Dynamically get indices
      ...(!hasApprovedFunds ? [1] : []),
      2,
    ],
    [canHaveSwitchNetworkStep, hasApprovedFunds]
  );

  useEffect(() => {
    if (minimumReceivedUSD < toNativeDisabledThreshold) {
      setAgreedSwap(false);
    }
  }, [minimumReceivedUSD]);

  const [isConfirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

  return (
    <>
      <Heading
        title="Swap"
        subTitle="You will be able to swap and move assets on any available EVM L1 & L2 chains and Picasso."
      />
      <Box mb={6} />
      <div className={classes.form}>
        {!account && (
          <Box my={6}>
            <Box p={4} borderRadius={1} bgcolor={"other.background.n4"}>
              <Typography
                textAlign={"center"}
                mb={2}
                sx={{ color: "text.primary" }}
              >
                Connect wallet
              </Typography>
              <Typography textAlign={"center"} sx={{ color: "text.secondary" }}>
                To start cross-chain swapping wallet needs to be connected.
              </Typography>
            </Box>
          </Box>
        )}
        {account && (
          <Grid container spacing={3} className={classes.networks}>
            <Grid item xs={12} md={5}>
              <Typography variant="body2">From network</Typography>
              <NetworkSelector
                networks={Object.values(TEST_SUPPORTED_NETWORKS)}
                value={from}
                onChange={handleChangeFrom}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={2}
              justifyContent={"center"}
              alignItems={"flex-end"}
              sx={{ display: "flex" }}
            >
              <Hidden mdUp>
                <ExchangeButton
                  onClick={handleExchangeNetwork}
                  vertical={true}
                  disabled={!!(from && to)}
                />
              </Hidden>
              <Hidden mdDown>
                <ExchangeButton onClick={handleExchangeNetwork} />
              </Hidden>
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
              <Typography variant="body2">To network</Typography>
              <NetworkSelector
                networks={Object.values(TEST_SUPPORTED_NETWORKS)}
                value={to}
                onChange={handleChangeTo}
              />
            </Grid>
          </Grid>
        )}
        <Box mb={6} />
        <Box mb={2} />
        <Box position="relative">
          <div className={classes.label}>
            <Typography sx={{ color: "text.primary" }}>Swap from</Typography>
            <Box display="flex">
              <Typography sx={{ color: "text.secondary", mr: 1 }}>
                Balance:
              </Typography>
              <Typography sx={{ color: "text.primary" }}>
                <span>
                  {(balance?.isLoading && <CircularProgress size={16} />) ||
                    balance?.value?.toFixed(fromDecimals) ||
                    "-"}
                </span>{" "}
                <span>{from_token?.symbol}</span>
              </Typography>
            </Box>
          </div>
          <Grid container>
            <Grid item xs={5}>
              <TokenSelector
                ammList={allSupportedAMMs}
                tokens={supportedFromTokens}
                value={from_token}
                onChange={handleChangeFromToken}
                edge='end'
                getTokens={(tokenAddress: string) => {
                  if (from) {
                    setSearchForToken(getTokenId({
                      address: tokenAddress.toLowerCase(),
                      chainId: from.chainId,
                    }))
                  }
                  return Promise.resolve([])
                }}
              />
            </Grid>
            <Grid item xs={7}>
              <BigNumberInput
                value={from_value}
                setter={setFromValue}
                isValid={(v, optionalMessage) => {
                  setFromValidation([v, optionalMessage || ""]);
                }}
                error={!isAmountValid}
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  height: 52,
                }}
                forceDisable={!account}
                adornmentEnd={
                  <InputAdornment position="end">
                    <div className={classes.max} onClick={handleMax}>
                      MAX
                    </div>
                  </InputAdornment>
                }
                forceMaxWidth
                minValue={minFromValue}
                maxValue={maxFromValue}
                maxDecimals={from_token?.decimals || 0}
                placeholder={from_value.toString()}
              />
            </Grid>
          </Grid>

          <Grid
            mt={1}
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
            }}
          >
            {/*Just make sure Balance is the first element, and we can remove unnecessary layout conditions in JS*/}
            <Typography color={"textSecondary"}>
              {fromTokenPrice
                ? `~ ${from_value?.times(fromTokenPrice).toFixed(2)} USD`
                : "-"}
            </Typography>
            {!isAmountValid && (
              <Typography variant="body2" color="error">
                {amountValidationMessage}
              </Typography>
            )}
            {shouldShowEthWarning && (
              <Typography color="other.alert.primary" width="65%">
                To ensure the transaction, at least {minEthWalletGasRemaining}{" "}
                ETH must be left on your wallet to pay for gas fees.
              </Typography>
            )}
            {isFundsSufficient && (
              <Typography color="error.main">Insufficient funds.</Typography>
            )}
          </Grid>
          <Box mb={2} />
          <Grid
            item
            xs={12}
            justifyContent={"center"}
            alignItems={"flex-end"}
            sx={{ display: "flex" }}
          >
            <ExchangeButton
              disabled={disableExchangeTokenButton}
              onClick={handleExchangeToken}
              vertical={true}
            />
          </Grid>
          <Box mb={2} />
          <div className={classes.label}>
            <Typography sx={{ color: "text.primary" }}>Swap to</Typography>
          </div>
          <Grid container>
            <Grid item xs={5}>
              <TokenSelector
                ammList={allSupportedAMMs}
                tokens={supportedToTokens}
                value={to_token}
                onChange={handleChangeToToken}
                edge='end'
                getTokens={(tokenAddress: string) => {
                  if (to) {
                    setSearchForToken(getTokenId({
                      address: tokenAddress.toLowerCase(),
                      chainId: to.chainId,
                    }))
                  }
                  return Promise.resolve([])
                }}
              />
            </Grid>
            <Grid item xs={7}>
              <BigNumberInput
                value={toValueValid ? to_value : new BigNumber(0)}
                setter={() => {}}
                isValid={() => {}}
                sx={{
                  ...edgeStyleOverrides("start"),
                  height: 52,
                  padding: 0,
                }}
                forceDisable={true}
                adornmentEnd={
                  <InputAdornment position="end">
                    <Box ml={3.2} />
                  </InputAdornment>
                }
                forceMaxWidth
                maxValue={new BigNumber(100)}
                maxDecimals={to_token?.decimals || 0}
                placeholder={toValueValid ? to_value.toString() : "0"}
              />
            </Grid>
          </Grid>
          <Box mt={1} textAlign="right">
            <Typography color={"textSecondary"}>
              {(from_token?.symbol &&
                to_token?.symbol &&
                `1 ${from_token.symbol} = ${fromValueToValuePriceRatio} ${to_token.symbol}`) ||
                "-"}
            </Typography>
          </Box>
          {account && (
            <>
              {ammUsed && (
                <Box mt={1}>
                  <AMMSelector
                    label="Select AMM"
                    amms={supportedAMMs}
                    selected={selectedAMM}
                    onChange={setSelectedAMM}
                  />
                </Box>
              )}
              {to && to.chainId !== ETHERIUM_MAINNET_NETWORK.chainId && !isToTokenNative && (
                <Box mb={6}>
                  <EnablePortionBox
                    disabled={minimumReceivedUSD < toNativeDisabledThreshold}
                    mt={6}
                    checked={agreedSwap}
                    setChecked={setAgreedSwap}
                    network={to}
                    operation="swap"
                  />
                </Box>
              )}
              <DestinationAddress
                address={dest_address}
                onChange={setDestAddress}
              />
              <Box mb={6} />
              {fromValid &&
                isAmountValid &&
                to &&
                to_token &&
                fromTokenPrice &&
                toTokenPrice &&
                (!ammUsed || selectedAMM) &&
                toNativeTokenPrice && (
                  <Details
                    liquidityFee={liquidityFee}
                    mosaicFee={mosaicFee}
                    toToken={to_token}
                    minimumReceived={to_value}
                    // @ts-ignore
                    outToken={SUPPORTED_NETWORKS[to.chainId].nativeToken}
                    outAmount={toNativeValue}
                    slippage={slippage}
                    amm={(ammUsed && selectedAMM) || undefined}
                    transactionFee={transactionFee}
                    fromTokenPrice={fromTokenPrice}
                    toTokenPrice={toTokenPrice}
                    toNativeTokenPrice={toNativeTokenPrice}
                    fromDecimals={fromDecimals}
                    toDecimals={toDecimals}
                    toNativeDecimals={toNativeDecimals}
                    transactionDeadline={deadline}
                    ammUsed={ammUsed}
                  />
                )}
              <Box mb={3} />
              {from_token && (
                <Box>
                  <Typography color="text.secondary">
                    Output is estimated. You will receive at least{" "}
                    {minimumReceived.toFixed(toDecimals)} {from_token.symbol} or
                    the transaction will revert.
                  </Typography>
                  <Typography color="text.secondary" fontSize={12} mt={1}>
                    Note: In the event that the transaction fails, the funds
                    will be returned to the deposit address with the transaction
                    costs applied. Transaction cost will be approximately{" "}
                    {transactionFee.toFixed(fromDecimals * 3)} {from_token?.symbol}
                  </Typography>
                </Box>
              )}
              {liquidity?.isLessThan(to_value) && (
                <React.Fragment>
                  <Box mb={4} />
                  <Warning
                    caution={true}
                    title="There is not enough liquidity on the destination network to proceed. Please increase transaction deadline to 1 hour to avoid a failed transaction."
                  />
                </React.Fragment>
              )}
              {/* slippage condition needed  */}
              {ammUsed && slippage < 1 && (
                <React.Fragment>
                  <Box mb={4}>
                    <Warning
                      caution={true}
                      title="There is not enough slippage to swap this asset. Please increase slippage tolerance to at least 1% to avoid a failed transaction."
                    />
                  </Box>
                </React.Fragment>
              )}
            </>
          )}
          <Box mb={4} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ px: 3, py: 2 }}
            onClick={() => setConfirmationModalOpen(true)}
            disabled={buttonDisabled}
          >
            <Box display="flex" sx={{ opacity: buttonDisabled ? "0.6" : "1" }}>
              <Image src={Swap_Icon} alt={"Swap"} width="22" height="22" />
            </Box>
            Swap
          </Button>
        </Box>
      </div>
      <ConfirmationModal
        backButtonText="Back to swap"
        isOpen={isConfirmationModalOpen}
        closeConfirmation={() => setConfirmationModalOpen(false)}
        allPossibleSteps={allPossibleModalSteps}
        executingStepsIndices={executingStepsIndices}
        transactionsChainId={from?.chainId}
        tokens={[from_token]}
      />
    </>
  );
};

export default Transfer;

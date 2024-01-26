import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Heading } from "@/components/Heading";
import FeaturedBox from "@/components/FeaturedBox";
import {
  Autorenew,
  CheckCircleOutlined,
  Close,
  GppGood,
  Repeat,
} from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import Image from "next/image";
import {
  alpha,
  Box,
  BoxProps,
  Grid,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import BigNumber from "bignumber.js";
import Switcher from "./Switcher";
import Button from "@/components/Button";
import { liquidity, withdraw } from "@/assets/icons/common";
import AlertBox from "@/components/AlertBox";
import {
  ETHERIUM_MAINNET_NETWORK,
  SUPPORTED_NETWORKS,
  SupportedNetwork,
  SwapAmmID,
  TEST_SUPPORTED_NETWORKS,
  TestSupportedNetworkId,
} from "@/submodules/contracts-operations/src/defi/constants";
import { NetworkSelector } from "@/components/MegaSelector/NetworkSelector";
import {
  CrossChainId,
  CrossChainToken,
  selectCrossChainTokens,
  selectSupportedTokens,
  SupportedAmm,
  SupportedTokens,
  Token,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import AmountInput from "../AmountInput";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import NoActivePositionCover from "./NoActivePositionCover";
import EnablePortionBox from "./EnablePortionBox";
import AccordionInput from "@/components/AccordionInput";
import { Balance, toBaseUnitBN } from "@integrations-lib/interaction";
import {
  APIFees,
  APIRewards,
  getFees,
  getRewards,
} from "@/submodules/contracts-operations/src/api";
import { defaultPromiseFunction, useConnector } from "@integrations-lib/core";
import { useAppDispatch, useAppSelector } from "@/store";
import AMMSelector from "@/components/AMMSelector";
import {
  composeApproval,
  composeDepositWithdraw,
  composeSwitchNetwork,
} from "@/components/Transfer/utils";
import {
  ConfirmationModal,
  Step,
} from "@/components/PreReview/ConfirmationModal";
import Details from "@/components/Transfer/Details";
import ExchangeButton from "@/components/ExchangeButton";
import IconButton from "@/components/IconButton";
import PositionDetails from "../../PositionDetails";
import NoConnectCover from "../NoConnectCover";
import {
  Notification,
  removeNotification,
  selectNotifications,
} from "@/submodules/contracts-operations/src/store/notifications/slice";
import { useTransactionSettingsOptions } from "store/transactionSettingsOptions/hooks";
import { contractAddresses } from "@/phase2/constants";
import { CrossChainTokensDetailsContext } from "@/phase2/components/CrossChainTokenDetails";

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

type NotificationMessages = {
  [key: string]: string;
};

export type FormType = "deposit" | "withdraw";

interface FormTypeValues {
  max: Balance;
  modalBackButtonText: string;
  otherTab: FormType;
  buttonDisabled: boolean;
  buttonImage: any;
  buttonText: string;
  buttonAction: () => Promise<any>;
  sourceNetworkLabel: string;
  destinationNetworkLabel: string;
  amountInputLabel: string;
  selectedTab: number;
}

type DepositWithdrawFormProps = {
  crossChainId: CrossChainId;
  type: FormType;
} & BoxProps;

const DepositWithdrawForm = ({
  crossChainId,
  type,
  ...rest
}: DepositWithdrawFormProps) => {
  const crossChainTokens: Array<CrossChainToken> = useAppSelector(selectCrossChainTokens);
  
  const crossChainToken = useMemo(
    () => crossChainTokens.find((token: CrossChainToken) => token.crossChainId === crossChainId),
    [crossChainId, crossChainTokens]
  )

  const { tokensInfo } = useContext(CrossChainTokensDetailsContext);

  console.log('IKO parent', tokensInfo)

  const tokenInfo = useMemo(
    () => tokensInfo[crossChainId],
    [tokensInfo, crossChainId]
  )

  const {
    getTokenPrice,
    getTokenAmountDecimals,
    getEthBalance,
    getNativeTokenPrice,
    getNativeTokenAmountDecimals,
    setNetwork: _setNetwork,
    setToken: _setToken,
    getBalance,
    getDeposited,
    hasApprovedFunds: _hasApprovedFunds,
    approveFunds: _approveFunds,
    depositFunds: _depositFunds,
    withdrawFunds: _withdrawFunds,
    canDepositFunds,
    canWithdrawFunds,
  } = useContext(NetworkTokenOperationsContext);

  const [formType, setFormType] = useState<FormType>(type);
  const [sourceNetwork, _setSourceNetwork] = useState<
    SupportedNetwork | undefined
  >(undefined);
  const [destinationNetwork, _setDestinationNetwork] = useState<
    SupportedNetwork | undefined
  >(undefined);
  const [sourceToken, _setSourceToken] = useState<Token | undefined>(undefined);
  const [portionEnabled, setPortionEnabled] = useState<boolean>(false);
  
  const availableNetworks = useMemo(
    () => Object.values(TEST_SUPPORTED_NETWORKS).filter((network: SupportedNetwork) => crossChainToken?.addresses[network.chainId]),
    [crossChainToken]
  )

  const [firstDefaultNetwork, secondDefaultNetwork] = Object.values(
    availableNetworks
  );

  const setSourceNetwork = useCallback(
    (value: SupportedNetwork | undefined) => {
      _setSourceNetwork(value);
      _setNetwork(value?.chainId);
    },
    [_setNetwork]
  );

  const setDestinationNetwork = useCallback(
    value => {
      _setDestinationNetwork(value);
      _setNetwork(value?.chainId);

      if (value?.chainId === ETHERIUM_MAINNET_NETWORK.chainId) {
        setPortionEnabled(false);
      }
    },
    [_setNetwork]
  );

  const setSourceToken = useCallback(
    (value: Token | undefined) => {
      _setSourceToken(value);
      _setToken(value);
    },
    [_setToken]
  );

  const sourceTokenPrice = useMemo(
    () => getTokenPrice(sourceToken),
    [getTokenPrice, sourceToken]
  );

  const destinationNativeTokenPrice = useMemo(
    () => getNativeTokenPrice(destinationNetwork?.chainId),
    [getNativeTokenPrice, destinationNetwork]
  );

  const sourceTokenAmountDecimals = useMemo(
    () => getTokenAmountDecimals(sourceToken),
    [getTokenAmountDecimals, sourceToken]
  );

  const destinationNativeTokenAmountDecimals = useMemo(
    () => getNativeTokenAmountDecimals(destinationNetwork?.chainId),
    [getNativeTokenAmountDecimals, destinationNetwork]
  );

  const sourceEthBalance = useMemo(
    () => getEthBalance(sourceNetwork?.chainId),
    [getEthBalance, sourceNetwork]
  );

  const spenderVaultAddress = useMemo(
    () => sourceNetwork ? contractAddresses[sourceNetwork.chainId]?.vault : undefined,
    [sourceNetwork]
  )

  const hasApprovedFunds = useMemo(
    () => spenderVaultAddress ? _hasApprovedFunds(sourceToken, spenderVaultAddress) : false,
    [_hasApprovedFunds, spenderVaultAddress, sourceToken]
  );

  const approveFunds = useCallback(
    () => {
      if (!spenderVaultAddress) {
        return Promise.reject("Spender vault address not defined");
      }

      return _approveFunds(sourceToken, spenderVaultAddress)
    },
    [_approveFunds, spenderVaultAddress, sourceToken]
  );

  useEffect(() => {
    if (!sourceNetwork && firstDefaultNetwork) {
      setSourceNetwork(firstDefaultNetwork);
    }
  }, [sourceNetwork, setSourceNetwork, firstDefaultNetwork]);

  useEffect(() => {
    if (!destinationNetwork && secondDefaultNetwork) {
      setDestinationNetwork(secondDefaultNetwork);
    }
  }, [destinationNetwork, setDestinationNetwork, secondDefaultNetwork]);

  useEffect(() => {
    if (crossChainToken && sourceNetwork) {
      setSourceToken({
        ...crossChainToken,
        chainId: sourceNetwork.chainId,
        address: crossChainToken.addresses[sourceNetwork.chainId] as string,
        decimals: crossChainToken.decimals[sourceNetwork.chainId] as number,
      });
    }
  }, [crossChainToken, sourceNetwork, setSourceToken]);

  const {
    account,
    activate,
    chainId: connectedChainId,
  } = useConnector("metamask");

  const [value, setValue] = useState<BigNumber>(new BigNumber(0));
  const [valid, setValid] = useState(false);

  const [destinationAddress, setDestinationAddress] = useState<string>();
  const [selectedAMM, setSelectedAMM] = useState<SupportedAmm | undefined>(
    undefined
  );
  const [ammUsed] = useState<boolean>(false); // TODO(Marko): What about this, can it change?
  const [expandedTargetAddress, setExpandedTargetAddress] =
    useState<boolean>(false);
  const { slippage, deadline } = useTransactionSettingsOptions();

  const depositFunds = useCallback(
    () => _depositFunds(sourceToken, value),
    [_depositFunds, value, sourceToken]
  );

  const withdrawDestinationAddress = useMemo(
    () => destinationAddress || account,
    [account, destinationAddress]
  );

  const withdrawAmmParameter: SwapAmmID | undefined = useMemo(
    () => (ammUsed ? selectedAMM?.ammId : "0"),
    [ammUsed, selectedAMM]
  );

  const [fees, setFees] = useState<APIFees | undefined>(undefined);

  useEffect(() => {
    if (sourceNetwork && sourceToken && withdrawAmmParameter) {
      getFees(
        'liquidity_withdrawal_fee',
        withdrawAmmParameter,
        toBaseUnitBN(value.toString(), sourceToken.decimals),
        sourceToken.address,
        sourceNetwork.chainId
      ).then((value: APIFees) => {
        setFees(value);
      });
    }
  }, [sourceNetwork, sourceToken, value, withdrawAmmParameter]);

  const sourceTokenPriceToDestinationNativeTokenPriceRatio = useMemo(
    () =>
      (sourceTokenPrice &&
        destinationNativeTokenPrice &&
        sourceTokenPrice / destinationNativeTokenPrice) ||
      1,
    [sourceTokenPrice, destinationNativeTokenPrice]
  );

  const transactionFee = useMemo(
    () =>
      fees?.baseFee
        ? fees.baseFee.times(sourceTokenPriceToDestinationNativeTokenPriceRatio)
        : new BigNumber(0),
    [fees, sourceTokenPriceToDestinationNativeTokenPriceRatio]
  );

  const totalToValue = useMemo(
    () => value.minus(transactionFee),
    [value, transactionFee]
  );

  const [rewards, setRewards] = useState<APIRewards | undefined>(undefined);

  useEffect(() => {
    if (account && crossChainToken) {
      getRewards(crossChainToken.crossChainId, account).then(setRewards);
    }
  }, [account, crossChainToken]);

  const earnedFees = rewards?.claimable || undefined;

  const minimumReceived = useMemo(
    () => new BigNumber(totalToValue)
      .plus(earnedFees || 0)
      .times(ammUsed ? 1 - slippage / 100 : 1)
    ,
    [ammUsed, earnedFees, slippage, totalToValue]
  );

  const withdrawFunds = useCallback(
    () =>
      _withdrawFunds(
        sourceToken,
        value,
        withdrawDestinationAddress as string,
        deadline,
        withdrawAmmParameter as SwapAmmID,
        destinationNetwork?.chainId || firstDefaultNetwork.chainId,
        minimumReceived as BigNumber,
        portionEnabled
      ),
    [
      _withdrawFunds,
      value,
      sourceToken,
      withdrawDestinationAddress,
      deadline,
      withdrawAmmParameter,
      minimumReceived,
      portionEnabled,
      destinationNetwork,
      firstDefaultNetwork.chainId,
    ]
  );

  const formTypeValues: FormTypeValues = useMemo(() => {
    switch (formType) {
      case "deposit": {
        const max = getBalance(sourceToken);

        return {
          max,
          modalBackButtonText: "Back to deposit",
          otherTab: "withdraw",
          buttonDisabled:
            !valid ||
            !sourceToken ||
            !sourceNetwork ||
            !max?.value ||
            value.isGreaterThan(max.value) ||
            value.isLessThanOrEqualTo(0) ||
            !deadline ||
            !account ||
            !canDepositFunds(sourceToken, value),
          buttonImage: liquidity,
          buttonText: "Provide Liquidity",
          buttonAction: depositFunds,
          sourceNetworkLabel: "Deposit Network",
          destinationNetworkLabel: "",
          amountInputLabel: "Asset to be deposited",
          selectedTab: 0,
        };
      }
      case "withdraw": {
        const max = getDeposited(sourceToken);

        return {
          max: getDeposited(sourceToken),
          modalBackButtonText: "Back to withdraw",
          otherTab: "deposit",
          buttonDisabled:
            !valid ||
            !sourceToken ||
            !sourceNetwork ||
            !destinationNetwork ||
            !max?.value ||
            value.isGreaterThan(max.value) ||
            value.isLessThanOrEqualTo(0) ||
            !minimumReceived ||
            minimumReceived.isLessThanOrEqualTo(0) ||
            !deadline ||
            !withdrawDestinationAddress ||
            !account ||
            !withdrawAmmParameter ||
            !canWithdrawFunds(
              sourceToken,
              value,
              withdrawDestinationAddress,
              deadline,
              withdrawAmmParameter,
              destinationNetwork?.chainId,
              minimumReceived,
            ),
          buttonImage: withdraw,
          buttonText: "Withdraw",
          buttonAction: withdrawFunds,
          sourceNetworkLabel: "From Network",
          destinationNetworkLabel: "To Network",
          amountInputLabel: "Asset to be withdrawn",
          selectedTab: 1,
        };
      }
      default:
        return {
          max: {
            value: undefined,
            isLoading: false,
          } as Balance,
          modalBackButtonText: "Back",
          otherTab: "deposit",
          buttonDisabled: false,
          buttonImage: "",
          buttonText: "",
          buttonAction: defaultPromiseFunction,
          sourceNetworkLabel: "",
          destinationNetworkLabel: "",
          amountInputLabel: "",
          selectedTab: 0,
        };
    }
  }, [
    canDepositFunds,
    canWithdrawFunds,
    depositFunds,
    formType,
    getBalance,
    getDeposited,
    sourceToken,
    valid,
    value,
    withdrawFunds,
    minimumReceived,
    deadline,
    withdrawDestinationAddress,
    account,
    withdrawAmmParameter,
    destinationNetwork,
    sourceNetwork,
  ]);

  const {
    max,
    modalBackButtonText,
    otherTab,
    buttonDisabled,
    buttonImage,
    buttonText,
    buttonAction,
    sourceNetworkLabel,
    destinationNetworkLabel,
    amountInputLabel,
    selectedTab,
  } = formTypeValues;

  const handleTabChange = useCallback(() => {
    setFormType(otherTab);
  }, [otherTab]);

  const desktopSize = formType === "withdraw" ? 5 : 12;

  const supportedTokens: SupportedTokens = useAppSelector(
    selectSupportedTokens
  );

  const supportedAMMs: Array<SupportedAmm> = useMemo(
    () => (destinationNetwork !== undefined && supportedTokens[destinationNetwork.chainId]?.supportedAmms) || [],
    [supportedTokens, destinationNetwork]
  );

  const canHaveSwitchNetworkStep =
    sourceNetwork && sourceNetwork.chainId !== connectedChainId;

  const switchNetworkStep: Step = useMemo(
    () => ({
      ...composeSwitchNetwork(
        connectedChainId as TestSupportedNetworkId,
        sourceNetwork?.chainId
      ),
      action: () => {
        return new Promise<void>((resolve, reject) => {
          const result: Promise<void> = activate(
            sourceNetwork
          ) as Promise<void>;
          result.then(() => resolve()).catch(() => reject());
        });
      },
      icon: <Repeat />,
    }),
    [activate, sourceNetwork, connectedChainId]
  );

  const approveFundsStep: Step = useMemo(
    () => ({
      ...composeApproval(),
      action: approveFunds,
      icon: <GppGood />,
    }),
    [approveFunds]
  );

  const depositWithdrawFundsStep: Step = useMemo(
    () => ({
      ...composeDepositWithdraw(formType, sourceToken, value),
      action: buttonAction,
      icon: <Autorenew />,
    }),
    [formType, sourceToken, buttonAction, value]
  );

  const allPossibleModalSteps: Array<Step> = useMemo(
    () => [switchNetworkStep, approveFundsStep, depositWithdrawFundsStep],
    [switchNetworkStep, approveFundsStep, depositWithdrawFundsStep]
  );

  const executingStepsIndices: Array<number> = useMemo(
    () => [
      ...(canHaveSwitchNetworkStep ? [0] : []), // TODO(Marko): Dynamically get indices
      ...(!hasApprovedFunds ? [1] : []),
      2,
    ],
    [canHaveSwitchNetworkStep, hasApprovedFunds]
  );

  const [isConfirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

  const destinationNativeTokenValueUSD = 10;

  const destinationNativeTokenValue = useMemo(
    () =>
      portionEnabled && destinationNativeTokenPrice
        ? new BigNumber(
            destinationNativeTokenValueUSD / destinationNativeTokenPrice
          )
        : new BigNumber(0),
    [
      portionEnabled,
      destinationNativeTokenValueUSD,
      destinationNativeTokenPrice,
    ]
  );

  const theme = useTheme();

  const notifications = Object.values(
    useAppSelector(selectNotifications)
  ) as Array<Notification>;
  const notification = useMemo(() => notifications[0], [notifications]);

  const dispatch = useAppDispatch();

  const notificationMessages: NotificationMessages = {
    depositFunds: `${sourceToken?.symbol} position applied successfully.`,
    withdrawFunds: `${
      sourceToken?.symbol
    } vault withdraw for ${value.toFixed()} ${
      sourceToken?.symbol
    } was completed successfully.`,
  };

  const isTargetNotification =
    notification?.type === "success" &&
    (notification?.message === "depositFunds" ||
      notification?.message === "withdrawFunds");

  const classes = useStyles();

  const handleExchangeNetwork = useCallback(() => {
    setDestinationNetwork(sourceNetwork);
    setSourceNetwork(destinationNetwork);
  }, [
    sourceNetwork,
    destinationNetwork,
    setDestinationNetwork,
    setSourceNetwork,
  ]);

  const nativeTokenOut = useMemo(
    () => {
      if (!destinationNetwork) {
        return undefined;
      }

      const token = SUPPORTED_NETWORKS[destinationNetwork.chainId].nativeToken;

      if (!token) {
        return undefined;
      }

      return {
        ...token,
        amms: [...token.amms],
      };
    },
    [destinationNetwork]
  );

  return (
    <Box {...rest} sx={{ position: "relative" }}>
      {sourceToken && isTargetNotification && notification?.message && (
        <AlertBox
          status='success'
          underlined
          icon={<CheckCircleOutlined color='success' />}
          link={
            <IconButton
              variant='phantom'
              sx={{
                width: 36,
                height: 36,
                "&:hover": {
                  background: (theme: Theme) =>
                    `${alpha(
                      theme.palette.other.featured.main,
                      theme.opacity.main
                    )} !important`,
                },
              }}
              onClick={() =>
                dispatch(removeNotification({ id: notification.id }))
              }
            >
              <Close
                sx={{
                  fontSize: 14,
                }}
                htmlColor={theme.palette.other.featured.main}
                width={24}
                height={24}
              />
            </IconButton>
          }
          sx={{ position: "absolute", width: "100%", mt: 1.5 }}
        >
          <Typography
            variant='body2'
            color='text.primary'
            textAlign='center'
            width='100%'
          >
            {notificationMessages[notification.message]}
          </Typography>
        </AlertBox>
      )}

      <Box
        sx={{
          maxWidth: 680,
          margin: "auto",
        }}
      >
        <Heading
          title={`${sourceToken ? sourceToken.symbol : ""} Vault`}
          subTitle='You will be able to deposit and withdraw your assets on any L1& L2 chains. Rewards added on your balance can be withdrawn any time.'
        />

        {!account ? (
          <FeaturedBox
            title="Connect Wallet"
            intro="To start earning rewards, wallet needs to be connected."
            mt={6}
          />
        ) : tokenInfo && (
          <PositionDetails crossChainId={crossChainId} tokenInfo={tokenInfo} mt={6} />
        )}

        {!account ? (
          <NoConnectCover mt={8} />
        ) : (
          <Box {...rest}>
            <Switcher
              selectedTab={selectedTab}
              handleTabChange={handleTabChange}
              mt={9}
            />

            <Box mb={6} />

            <Grid container spacing={3} className={classes.networks}>
              <Grid item xs={12} sm={12} md={desktopSize}>
                <Typography variant='body2'>{sourceNetworkLabel}</Typography>
                <NetworkSelector
                  value={sourceNetwork}
                  onChange={setSourceNetwork}
                  networks={availableNetworks}
                />
              </Grid>

              {formType === "withdraw" && (
                <React.Fragment>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    justifyContent={"center"}
                    alignItems={"flex-end"}
                    sx={{ display: "flex" }}
                  >
                    <ExchangeButton
                      sx={{
                        display: {
                          [theme.breakpoints.down("md")]: "none",
                        },
                      }}
                      onClick={handleExchangeNetwork}
                      disabled={!sourceNetwork || !destinationNetwork}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={5}>
                    <Typography variant='body2'>
                      {destinationNetworkLabel}
                    </Typography>
                    <NetworkSelector
                      networks={availableNetworks}
                      value={destinationNetwork}
                      onChange={setDestinationNetwork}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>

            <Box mb={6} />

            {sourceToken &&
              (formType === "deposit" || max?.isLoading || max?.value ? (
                <React.Fragment>
                  <AmountInput
                    token={sourceToken}
                    value={value}
                    setter={setValue}
                    isValid={setValid}
                    balance={max}
                    maxValue={max?.value || new BigNumber(0)}
                    minValue={new BigNumber(0)}
                    forceMaxWidth
                    tokenDecimals={sourceTokenAmountDecimals}
                    maxDecimals={sourceToken?.decimals || 0}
                    label={amountInputLabel}
                    balanceLabel='Available'
                    helperText={
                      sourceToken && sourceTokenPrice
                        ? `1 ${sourceToken.symbol} = ${sourceTokenPrice} USD`
                        : undefined
                    }
                    mt={6}
                  />

                  {formType === "withdraw" && (
                    <React.Fragment>
                      {ammUsed && (
                        <Box mt={1}>
                          <AMMSelector
                            label='Select AMM'
                            amms={supportedAMMs}
                            selected={selectedAMM}
                            onChange={setSelectedAMM}
                          />
                        </Box>
                      )}

                      {destinationNetwork &&
                        destinationNetwork.chainId !==
                          ETHERIUM_MAINNET_NETWORK.chainId && (
                          <EnablePortionBox
                            mt={6}
                            checked={portionEnabled}
                            setChecked={setPortionEnabled}
                            network={destinationNetwork}
                            operation='withdraw'
                          />
                        )}

                      <AccordionInput
                        value={destinationAddress}
                        setValue={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setDestinationAddress(event.target.value)}
                        expanded={expandedTargetAddress}
                        onChange={() =>
                          setExpandedTargetAddress(!expandedTargetAddress)
                        }
                        label='Change destination address (Optional)'
                        inputLabel='destination address'
                        showInputLabel={false}
                        valid={true}
                        mt={6}
                      />

                      <Box mb={6} />
                      {valid &&
                        sourceNetwork &&
                        destinationNetwork &&
                        sourceToken &&
                        value.isGreaterThan(0) &&
                        sourceTokenPrice &&
                        destinationNativeTokenPrice &&
                        minimumReceived && (
                          <Details
                            amount={value}
                            earnedFees={earnedFees}
                            toToken={sourceToken}
                            minimumReceived={minimumReceived}
                            outToken={nativeTokenOut}
                            outAmount={destinationNativeTokenValue}
                            slippage={slippage}
                            amm={(ammUsed && selectedAMM) || undefined}
                            transactionFee={transactionFee}
                            fromTokenPrice={sourceTokenPrice}
                            toTokenPrice={sourceTokenPrice}
                            toNativeTokenPrice={destinationNativeTokenPrice}
                            fromDecimals={sourceTokenAmountDecimals}
                            toDecimals={sourceTokenAmountDecimals}
                            toNativeDecimals={
                              destinationNativeTokenAmountDecimals
                            }
                            transactionDeadline={deadline}
                            ammUsed={ammUsed}
                          />
                        )}
                      <Box mb={3} />
                    </React.Fragment>
                  )}

                  {sourceEthBalance?.isZero() && (
                    <AlertBox
                      mt={6}
                      status='error'
                      icon={<ErrorOutlineOutlinedIcon color='error' />}
                    >
                      <Typography variant='body2' color='text.primary'>
                        You do not have enough ETH in your balance to pay for
                        gas fees. To continue please send some ETH to your
                        wallet.
                      </Typography>
                    </AlertBox>
                  )}

                  {formType === "deposit" && !hasApprovedFunds && (
                    <AlertBox
                      mt={6}
                      status='error'
                      icon={<ReportProblemOutlinedIcon color='info' />}
                    >
                      <Typography variant='body2' color='text.primary'>
                        To this asset to be deposited, wallet access needs to be
                        approved. This action will be only required for one time
                        for depositing new assets.
                      </Typography>
                    </AlertBox>
                  )}

                  <Box mt={6}>
                    <Button
                      fullWidth
                      variant='contained'
                      disabled={buttonDisabled}
                      onClick={() => setConfirmationModalOpen(true)}
                    >
                      <Box
                        sx={{ opacity: buttonDisabled ? 1 : 0.4 }}
                        display='flex'
                      >
                        <Image
                          src={buttonImage}
                          alt={buttonText}
                          width={24}
                          height={24}
                        />
                      </Box>

                      <Typography
                        ml={2}
                        variant='button'
                        sx={{ textTransform: "unset" }}
                      >
                        {buttonText}
                      </Typography>
                    </Button>
                  </Box>
                </React.Fragment>
              ) : (
                <NoActivePositionCover mt={9} />
              ))}

            <ConfirmationModal
              backButtonText={modalBackButtonText}
              isOpen={isConfirmationModalOpen}
              closeConfirmation={() => setConfirmationModalOpen(false)}
              allPossibleSteps={allPossibleModalSteps}
              executingStepsIndices={executingStepsIndices}
              transactionsChainId={sourceNetwork?.chainId}
              tokens={[sourceToken]}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DepositWithdrawForm;

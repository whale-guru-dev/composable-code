import { useEffect, useContext } from "react";
import { useAppDispatch, useAppSelector } from "..";
import { ContractsContext } from "defi/ContractsContext";
import {
  lpVaultResetUser,
  lpVaultUpdateGeneralCap,
  lpVaultUpdateGeneralEnable,
  lpVaultUpdateGeneralEnableWithdraw,
  lpVaultUpdateGeneralLoaded,
  lpVaultUpdateGeneralTvl,
  lpVaultUpdateUserFeeShare,
  lpVaultUpdateUserToken,
  selectLpVaultGeneral,
  selectLpVaultGeneralLoading,
} from "./slice";
import { ethers } from "ethers";
import { AnyAction, Dispatch } from "redux";
import { ADDRESSES } from "defi/addresses";
import { handleErr } from "defi/errorHandling";
import { toTokenUnitsBN } from "utils";
import { getRewardsInfo } from "store/apiService";
import {
  LIQUIDITY_PROVIDER_SUPPORTED_TOKEN,
  SupportedLpToken,
} from "@/constants";
import { getToken } from "@/defi/tokenInfo";

const abi = [
  "function deposit(address token, uint256 amount) external",
  "function getProviderBalance(address provider, address token) public view returns (uint256)",
  "function getTokenBalance(address token) public view returns (uint256)",
  "function maxAssetCap(address token) public view returns (uint256)",
  "function whitelistedTokens(address token) public view returns (bool)",
  "function paused() public view returns (bool)",
  "function allowToWithdraw(address token) public view returns (bool)",
];

const fetchGeneralData = async (dispatch: Dispatch<AnyAction>) => {
  const provider = new ethers.providers.AlchemyProvider(
    1,
    "_LS3GHbsERYSBAaJw5HECdKjRIIp8dPS"
  );

  const contract = new ethers.Contract(
    ADDRESSES.liquidityprovidervault[1],
    abi,
    provider
  );

  const rewards = await getRewardsInfo();
  const isPaused: boolean = await handleErr(() => contract.paused());

  for (let i = 0; i < LIQUIDITY_PROVIDER_SUPPORTED_TOKEN.length; i++) {
    const t = LIQUIDITY_PROVIDER_SUPPORTED_TOKEN[i];

    const isEnabled: boolean = await handleErr(() =>
      contract.whitelistedTokens(ADDRESSES[t.tokenId][1])
    );

    const isEnabledWithdraw: boolean = await handleErr(() =>
      contract.allowToWithdraw(ADDRESSES[t.tokenId][1])
    );

    if (isEnabled && !isPaused) {
      dispatch(
        lpVaultUpdateGeneralEnable({
          tokenId: t.tokenId,
        })
      );
    }

    if (isEnabledWithdraw) {
      dispatch(
        lpVaultUpdateGeneralEnableWithdraw({
          tokenId: t.tokenId,
        })
      );
    }

    

    handleErr(() => contract.maxAssetCap(ADDRESSES[t.tokenId][1])).then(
      (cap: ethers.BigNumber) => {
        dispatch(
          lpVaultUpdateGeneralCap({
            tokenId: t.tokenId,
            cap: toTokenUnitsBN(
              cap.toString(),
              getToken(t.tokenId).decimals
            ).toFixed(),
          })
        );
      }
    );

    dispatch(
      lpVaultUpdateGeneralTvl({
        tokenId: t.tokenId,
        tvl: rewards[t.tokenId].totalDeposited,
      })
    );
  }

  dispatch(lpVaultUpdateGeneralLoaded());
};

const updateUserFeeShare = async (
  address: string,
  dispatch: Dispatch<AnyAction>
) => {
  const rewardsInfo = await getRewardsInfo(address);

  Object.entries(rewardsInfo).forEach(([tokenId, info]) => {
    dispatch(
      lpVaultUpdateUserToken({
        tokenId: tokenId as SupportedLpToken,
        value: { deposited: info.depositedAmount },
      })
    );
    dispatch(
      lpVaultUpdateUserFeeShare({
        tokenId: tokenId as SupportedLpToken,
        value: { feeShare: info.feeShares },
      })
    );
  });
};

export default function Updater(): null {
  const { contracts, account, chainId } = useContext(ContractsContext);
  const dispatch = useAppDispatch();

  //const [getAddressInfo, { loading, data }] = useLazyQuery(RETRIEVE_ADDRESS_INFO);
  const generalLoading = useAppSelector(selectLpVaultGeneralLoading);
  const general = useAppSelector(selectLpVaultGeneral);

  const updateAddresses = async () => {
    if (!contracts) {
      return;
    }

    if (account) {
      updateUserFeeShare(account, dispatch);
    }

    if (account && chainId === 1 && !generalLoading) {
      LIQUIDITY_PROVIDER_SUPPORTED_TOKEN.forEach((t) => {
        if (!general[t.tokenId].isEnabled) {
          contracts.liquidityprovidervault
            .update()
            .lpVaultUpdateGeneralCap(t.tokenId);
        }
        contracts.liquidityprovidervault
          .update()
          .tokenDepositedBalance(t.tokenId);
      });
    } else {
      dispatch(lpVaultResetUser());
    }
  };

  useEffect(() => {
    updateAddresses();
  }, [contracts, account, chainId, generalLoading]);

  useEffect(() => {
    fetchGeneralData(dispatch);
  }, []);

  return null;
}

import { useEffect } from "react";
import { useAppDispatch } from "..";
import {
  relayerVaultUpdateAvailableLiquidityAndTotalFees,
  relayerVaultUpdateStataticGenenralData,
} from "./slice";
import { ethers } from "ethers";
import { AnyAction, Dispatch } from "redux";
import { ADDRESSES } from "defi/addresses";
import { handleErr } from "defi/errorHandling";
import { toTokenUnitsBN } from "utils";
import { getNetworkRpcUrl } from "defi";
import { getToken } from "defi/tokenInfo";
import { RELAYER_SUPPORTED_TOKENS } from "../../constants";
import { getRewardsInfo } from "store/apiService";

const abi = [
  "function getCurrentTokenLiquidity(address token) public view returns (uint256)",
  "function transferLockupTime() public view returns (uint256)",
  "function maxAssetTransferSize(address token) public view returns (uint256)",
  "function minAssetTransferSize(address token) public view returns (uint256)",
];

const fetchGeneralData = async (dispatch: Dispatch<AnyAction>) => {
  for (let i = 0; i < RELAYER_SUPPORTED_TOKENS.length; i++) {
    const relayerToken = RELAYER_SUPPORTED_TOKENS[i];
    const tokenId = relayerToken.tokenId;
    const token = getToken(tokenId);

    const fees = await getRewardsInfo();

    for (let j = 0; j < relayerToken.supportedNetworks.length; j++) {
      const chainId = relayerToken.supportedNetworks[j];
      dispatch(
        relayerVaultUpdateAvailableLiquidityAndTotalFees({
          tokenId,
          chainId,
          availableLiquidity: toTokenUnitsBN(
            "0",
            token.decimals
          ).toFixed(),
          totalFees: fees[tokenId].totalFees,
        })
      );
    }
  }
};

const fetchGeneralDataInitial = async (dispatch: Dispatch<AnyAction>) => {
  for (let i = 0; i < RELAYER_SUPPORTED_TOKENS.length; i++) {
    const relayerToken = RELAYER_SUPPORTED_TOKENS[i];
    const tokenId = relayerToken.tokenId;
    const token = getToken(tokenId);

    for (let j = 0; j < relayerToken.supportedNetworks.length; j++) {
      const chainId = relayerToken.supportedNetworks[j];
      const rpcUrl = getNetworkRpcUrl(chainId);
      const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl, chainId);
      const contract = new ethers.Contract(
        ADDRESSES.relayervault[chainId],
        abi,
        provider
      );

      Promise.all([
        handleErr(() => contract.transferLockupTime()),
        await handleErr(() =>
          contract.minAssetTransferSize(ADDRESSES[tokenId][chainId])
        ),
        handleErr(() =>
          contract.maxAssetTransferSize(ADDRESSES[tokenId][chainId])
        ),
      ]).then(([transferTime, min, max]) => {
        dispatch(
          relayerVaultUpdateStataticGenenralData({
            tokenId: tokenId,
            chainId,
            data: {
              minDeposit: toTokenUnitsBN(
                min.toString(),
                token.decimals
              ).toFixed(),
              maxDeposit: toTokenUnitsBN(
                max.toString(),
                token.decimals
              ).toFixed(),
              depositTimeout: parseInt(transferTime.toString()),
            },
          })
        );
      });
    }
  }
};

export default function Updater(): null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchGeneralData(dispatch);
    fetchGeneralDataInitial(dispatch);

    const generalDataTimer = setInterval(() => {
      fetchGeneralData(dispatch);
    }, 20000);

    const geenralDataTimerId: number = parseInt(generalDataTimer.toString());

    return () => {
      clearInterval(geenralDataTimerId);
    };
  }, []);

  return null;
}

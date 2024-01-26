import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RELAYER_SUPPORTED_TOKENS,
  SupportedRelayerNetwork,
  SupportedRelayerToken,
} from "../../constants";
import { RootState } from "..";

const defaultValue = {
  availableLiquidity: "0",
  minDeposit: "0",
  maxDeposit: "0",
  depositTimeout: 0,
  totalFees: "0",
};

const initialValue = () => {
  let ret: { [tokenId: string]: { [networkId: number]: {} } } = {};
  for (let i = 0; i < RELAYER_SUPPORTED_TOKENS.length; i++) {
    const relayerToken = RELAYER_SUPPORTED_TOKENS[i];
    for (let j = 0; j < relayerToken.supportedNetworks.length; j++) {
      const relayerNetwork = relayerToken.supportedNetworks[j];
      if (!(relayerToken.tokenId in ret)) {
        ret[relayerToken.tokenId] = {};
      }
      ret[relayerToken.tokenId][relayerNetwork] = defaultValue;
    }
  }

  return ret as {
    [tokenId: string]: {
      [networkId: number]: typeof defaultValue;
    };
  };
};

const initialState: {
  general: ReturnType<typeof initialValue>;
} = {
  general: initialValue(),
};

export const relayerVaultSlice = createSlice({
  name: "relayervault",
  initialState,
  reducers: {
    relayerVaultUpdateAvailableLiquidityAndTotalFees: (
      state,
      action: PayloadAction<{
        chainId: SupportedRelayerNetwork;
        tokenId: SupportedRelayerToken;
        availableLiquidity: string;
        totalFees: string;
      }>
    ) => {
      if (state?.general?.[action.payload.tokenId]?.[action.payload.chainId]?.availableLiquidity) { // TODO(Marko): Temporary prevented the 'availableLiquidity of undefined' issue
        state.general[action.payload.tokenId][
          action.payload.chainId
        ].availableLiquidity = action.payload.availableLiquidity;
        state.general[action.payload.tokenId][action.payload.chainId].totalFees =
          action.payload.totalFees;
      }
    },
    relayerVaultUpdateStataticGenenralData: (
      state,
      action: PayloadAction<{
        chainId: SupportedRelayerNetwork;
        tokenId: SupportedRelayerToken;
        data: {
          minDeposit: string;
          maxDeposit: string;
          depositTimeout: number;
        };
      }>
    ) => {
      state.general[action.payload.tokenId][action.payload.chainId] = {
        ...state.general[action.payload.tokenId][action.payload.chainId],
        ...action.payload.data,
      };
    },
  },
});

export const {
  relayerVaultUpdateAvailableLiquidityAndTotalFees,
  relayerVaultUpdateStataticGenenralData,
} = relayerVaultSlice.actions;

export const selectRelayerVaultGeneral = (state: RootState) =>
  state.relayervault.general;

export default relayerVaultSlice.reducer;

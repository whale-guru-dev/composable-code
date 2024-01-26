import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupportedLpToken } from "../../constants";
import { RootState } from "..";

const initialState: {
  loading: boolean;
  general: {
    [tokenId in SupportedLpToken]: {
      cap: string;
      tvl: string;
      isEnabled?: boolean;
      isEnabledWithdraw?: boolean;
    };
  };
  user: {
    [tokenId in SupportedLpToken]: {
      deposited: string;
      feeShare: number;
    };
  };
} = {
  loading: true,
  general: {
    usdc: { cap: "0", tvl: "0" },
    weth: { cap: "0", tvl: "0" },
    "crvTricrypto-usd-btc-eth": {
      cap: "0",
      tvl: "0",
    },
    "sushi-weth-usdc": { cap: "0", tvl: "0" },
    "sushi-weth-usdt": { cap: "0", tvl: "0" },
    aDai: { cap: "0", tvl: "0" },
    aUsdc: { cap: "0", tvl: "0" },
    aUsdt: { cap: "0", tvl: "0" },
    mim: { cap: "0", tvl: "0" },
  },
  user: {
    usdc: {
      deposited: "0",
      feeShare: 0,
    },
    weth: {
      deposited: "0",
      feeShare: 0,
    },
    "crvTricrypto-usd-btc-eth": {
      deposited: "0",
      feeShare: 0,
    },
    "sushi-weth-usdc": {
      deposited: "0",
      feeShare: 0,
    },
    "sushi-weth-usdt": {
      deposited: "0",
      feeShare: 0,
    },
    aDai: {
      deposited: "0",
      feeShare: 0,
    },
    aUsdc: {
      deposited: "0",
      feeShare: 0,
    },
    aUsdt: {
      deposited: "0",
      feeShare: 0,
    },
    mim: {
      deposited: "0",
      feeShare: 0,
    },
  },
};

export const lpVaultSlice = createSlice({
  name: "lpvault",
  initialState,
  reducers: {
    lpVaultUpdateUserToken: (
      state,
      action: PayloadAction<{
        tokenId: SupportedLpToken;
        value: { deposited: string };
      }>
    ) => {
      state.user[action.payload.tokenId].deposited =
        action.payload.value.deposited;
    },
    lpVaultUpdateUserFeeShare: (
      state,
      action: PayloadAction<{
        tokenId: SupportedLpToken;
        value: { feeShare: number };
      }>
    ) => {
      state.user[action.payload.tokenId].feeShare =
        action.payload.value.feeShare;
    },
    lpVaultUpdateGeneralTvl: (
      state,
      action: PayloadAction<{
        tokenId: SupportedLpToken;
        tvl: string;
      }>
    ) => {
      state.general[action.payload.tokenId].tvl = action.payload.tvl;
    },
    lpVaultUpdateGeneralLoaded: (state) => {
      state.loading = false;
    },
    lpVaultUpdateGeneralEnable: (
      state,
      action: PayloadAction<{
        tokenId: SupportedLpToken;
      }>
    ) => {
      state.general[action.payload.tokenId].isEnabled = true;
    },
    lpVaultUpdateGeneralEnableWithdraw: (
      state,
      action: PayloadAction<{
        tokenId: SupportedLpToken;
      }>
    ) => {
      state.general[action.payload.tokenId].isEnabledWithdraw = true;
    },
    lpVaultUpdateGeneralCap: (
      state,
      action: PayloadAction<{
        tokenId: SupportedLpToken;
        cap: string;
      }>
    ) => {
      state.general[action.payload.tokenId].cap = action.payload.cap;
    },
    lpVaultResetUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const {
  lpVaultUpdateUserToken,
  lpVaultUpdateGeneralTvl,
  lpVaultUpdateGeneralCap,
  lpVaultResetUser,
  lpVaultUpdateUserFeeShare,
  lpVaultUpdateGeneralEnable,
  lpVaultUpdateGeneralEnableWithdraw,
  lpVaultUpdateGeneralLoaded,
} = lpVaultSlice.actions;

export const selectLpVaultGeneral = (state: RootState) => state.lpvault.general;
export const selectLpVaultUser = (state: RootState) => state.lpvault.user;
export const selectLpVaultGeneralLoading = (state: RootState) =>
  state.lpvault.loading;

export default lpVaultSlice.reducer;

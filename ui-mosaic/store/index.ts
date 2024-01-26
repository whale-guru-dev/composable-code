import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import lpvault from "./lpVault/slice";
import userdata from "./userdata/slice";
import blockchainReducer from "./blockchain/slice";
import transactionReducer from "./tranasctions/slice";
import appsettingsReducer from "./appsettings/slice";
import relayervault from "./relayerVault/slice";
import relayertransfers from "./relayerTransfers/slice";
import nftrelayertransfers from "./nftRelayerTransfers/slice";
import usersettings from "./usersettings/slice";
import stablesInvestor from "./stablesInvestor/slice";
import notificationsReducer from "@/submodules/contracts-operations/src/store/notifications/slice";
import supportedTokens from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { save, load } from "redux-localstorage-simple";
import transactionSettingsReducer from "./transactionSettingsOptions/slice";

const PERSISTED_KEYS: string[] = [
  "transactions",
  "relayertransfers",
  "nftrelayertransfers",
  "transactionSettingsOptions",
  "supportedTokens",
];

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    lpvault: lpvault,
    userdata: userdata,
    blockchain: blockchainReducer,
    appsettings: appsettingsReducer,
    notifications: notificationsReducer,
    relayervault: relayervault,
    relayertransfers: relayertransfers,
    nftrelayertransfers: nftrelayertransfers,
    usersettings: usersettings,
    stablesInvestor: stablesInvestor,
    supportedTokens,
    transactionSettingsOptions: transactionSettingsReducer
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: true }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

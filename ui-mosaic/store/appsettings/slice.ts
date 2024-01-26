import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface AppSettings {
  isOpenConfirmationModal: boolean;
  isOpenWalletConnectModal: boolean;
  triedEeager: boolean;
  confirmationModalContent: Array<{
    heading: string;
    description: string;
  }>;
}

const initialState: AppSettings = {
  isOpenConfirmationModal: false,
  isOpenWalletConnectModal: false,
  triedEeager: false,
  confirmationModalContent: [
    {
      heading: "",
      description: "",
    },
  ],
};

export const appettingsSlice = createSlice({
  name: "appsettings",
  initialState,
  reducers: {
    openConfirmationModal: (state) => {
      state.isOpenConfirmationModal = true;
    },
    closeConfirmationModal: (state) => {
      state.isOpenConfirmationModal = false;
    },
    openWalletConnectModal: (state) => {
      state.isOpenWalletConnectModal = true;
    },
    closeWalletConnectModal: (state) => {
      state.isOpenWalletConnectModal = false;
    },
    triedEagerConnect: (state) => {
      state.triedEeager = true;
    },
    setConfirmModalContent: (state, payload: PayloadAction<any>) => {
      state.confirmationModalContent = payload.payload;
    },
  },
});

export const selectConfirmationModalContent = (state: RootState) =>
  state.appsettings.confirmationModalContent;
export const selectIsOpenConfirmation = (state: RootState) =>
  state.appsettings.isOpenConfirmationModal;
export const selectIsOpenWalletConnect = (state: RootState) =>
  state.appsettings.isOpenWalletConnectModal;
export const selectHasTriedEeager = (state: RootState) =>
  state.appsettings.triedEeager;

export const {
  openConfirmationModal,
  closeConfirmationModal,
  openWalletConnectModal,
  closeWalletConnectModal,
  setConfirmModalContent,
  triedEagerConnect,
} = appettingsSlice.actions;

export default appettingsSlice.reducer;

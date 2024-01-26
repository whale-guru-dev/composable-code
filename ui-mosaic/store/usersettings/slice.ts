import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface UserSettings {
  visitedPicassoModal: boolean;
  addedTokens: Array<Token>;
}

const initialState: UserSettings = {
  visitedPicassoModal: false,
  addedTokens: [],
};

export const appettingsSlice = createSlice({
  name: "usersettings",
  initialState,
  reducers: {
    visitedPicassoModal: (state) => {
      state.visitedPicassoModal = true;
    },
    addToken: (state, action) => {
      return {
        ...state,
        addedTokens: [...state.addedTokens, action.payload],
      };
    },
  },
});

export const selectHaveVisitedPicassoModal = (state: RootState) => state.usersettings.visitedPicassoModal

export const { visitedPicassoModal, addToken } = appettingsSlice.actions;

export default appettingsSlice.reducer

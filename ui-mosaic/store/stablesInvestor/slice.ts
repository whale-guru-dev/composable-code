import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

const initialState: {
  general: {
    totalTvl: string
    currentTvl: string
    totalContributedKsmAmount: string
  }
} = {
  general: { totalTvl: '1', currentTvl: '1', totalContributedKsmAmount: '1' },
}

export const polkadotAccountSlice = createSlice({
  name: 'stablecoinInvestor',
  initialState,
  reducers: {
    updateGeneral: (
      state,
      action: PayloadAction<{
        totalTvl: string
        currentTvl: string
        totalContributedKsmAmount: string
      }>
    ) => {
      state.general = action.payload
    },
  },
})

export const { updateGeneral } = polkadotAccountSlice.actions

export const selectStablesGeneral = (state: RootState) => state.stablesInvestor.general

export default polkadotAccountSlice.reducer

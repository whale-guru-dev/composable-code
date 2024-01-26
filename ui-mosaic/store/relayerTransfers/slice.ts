import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RELAYER_SUPPORTED_TOKENS,
  SupportedRelayerNetwork,
} from "../../constants";
import { TokenId } from "defi/tokenInfo";
import { RootState } from "..";
import { TransferStates } from "@/types/phase1";

export interface TransferStore {
  id: string;
  fromChainId: SupportedRelayerNetwork;
  toChainId: SupportedRelayerNetwork;
  fromTimestamp: number;
  fromBlock: number;
  fromBlockCurrent: number;
  toTimestamp: number;
  fromAddress: string;
  toAddress: string;
  amount: string;
  gasFee: string;
  fee: string;
  tokenId: TokenId;
  depositTxHash: string;
  withdrawalTxHash: string;
  status: TransferStates;
}

const initialState: { [id: string]: TransferStore } = {};

export const initialTransferState: TransferStore = {
  id: "",
  fromChainId: RELAYER_SUPPORTED_TOKENS[0].supportedNetworks[0],
  toChainId: RELAYER_SUPPORTED_TOKENS[0].supportedNetworks[1],
  fromTimestamp: 0,
  fromBlock: 0,
  fromBlockCurrent: 0,
  toTimestamp: 0,
  fromAddress: "0x0",
  toAddress: "0x0",
  amount: "0",
  gasFee: "0",
  fee: "0",
  tokenId: "usdc",
  depositTxHash: "",
  withdrawalTxHash: "",
  status: "depositing",
};

export const relayerTransfersSlice = createSlice({
  name: "relayertransfers",
  initialState,
  reducers: {
    newRelayerDeposit: (
      state,
      action: PayloadAction<
        Omit<
          TransferStore,
          | "id"
          | "toTimestamp"
          | "fromTimestamp"
          | "gasFee"
          | "fee"
          | "withdrawalTxHash"
          | "status"
          | "fromBlock"
          | "fromBlockCurrent"
        >
      >
    ) => {
      const transfer = action.payload;
      const id = `${transfer.fromChainId}-${transfer.depositTxHash}`;

      if (!(id in state)) {
        const tr = { ...initialTransferState, ...transfer };

        tr.status = "depositing";
        state[id] = tr;
      }
    },
    relayerDeposited: (
      state,
      action: PayloadAction<
        Omit<
          TransferStore,
          | "toTimestamp"
          | "fee"
          | "toChainId"
          | "withdrawalTxHash"
          | "fromAddress"
          | "toAddress"
          | "amount"
          | "tokenId"
          | "status"
          | "fromBlockCurrent"
        >
      >
    ) => {
      const transfer = action.payload;
      const id = `${transfer.fromChainId}-${transfer.depositTxHash}`;

      if (id in state) {
        const currentState = { ...state[id] };
        currentState.id = transfer.id;
        currentState.fromTimestamp = transfer.fromTimestamp;
        currentState.fromBlock = transfer.fromBlock;
        currentState.fromBlockCurrent = transfer.fromBlock;
        currentState.gasFee = transfer.gasFee;
        currentState.status = "confirmingDeposit";
        delete state[id];
        state[id] = currentState;
      }
    },
    relayerUpdateDepositBlock: (
      state,
      action: PayloadAction<{
        depositTxHash: string;
        fromChainId: SupportedRelayerNetwork;
        fromBlockCurrent: number;
        confirmationsNeeded: number;
      }>
    ) => {
      const transfer = action.payload;
      const id = `${transfer.fromChainId}-${transfer.depositTxHash}`;
      if (id in state) {
        const currentState = { ...state[id] };

        currentState.fromBlockCurrent = transfer.fromBlockCurrent;
        if (
          currentState.fromBlockCurrent - transfer.confirmationsNeeded >
          currentState.fromBlock
        ) {
          currentState.fromBlockCurrent =
            currentState.fromBlock + transfer.confirmationsNeeded;
        }
        if (
          transfer.fromBlockCurrent - currentState.fromBlock >=
          transfer.confirmationsNeeded
        ) {
          currentState.status = "processing";
        }
        state[id] = currentState;
      }
    },
    relayerDepositFailed: (
      state,
      action: PayloadAction<{
        depositTxHash: string;
        fromChainId: SupportedRelayerNetwork;
      }>
    ) => {
      const transfer = action.payload;
      const id = `${transfer.fromChainId}-${transfer.depositTxHash}`;
      if (id in state) {
        const currentState = { ...state[id] };

        currentState.status = "depositFailed";
        state[id] = currentState;
      }
    },
    relayerDepositCanceled: (
      state,
      action: PayloadAction<{
        depositTxHash: string;
        fromChainId: SupportedRelayerNetwork;
      }>
    ) => {
      const transfer = action.payload;
      const id = `${transfer.fromChainId}-${transfer.depositTxHash}`;
      if (id in state) {
        delete state[id];
      }
    },
    newTransfer: (state, action: PayloadAction<TransferStore>) => {
      const transfer = action.payload;
      const id = `${transfer.fromChainId}-${transfer.id}`;
      const tr = { ...initialTransferState, ...transfer };
      state[id] = tr;
    },
    // @ts-ignore
    relayerTransfersReset: (state) => {
      state = {};
    },
  },
});

export const {
  newTransfer,
  relayerTransfersReset,
  relayerDeposited,
  newRelayerDeposit,
  relayerUpdateDepositBlock,
  relayerDepositFailed,
  relayerDepositCanceled,
} = relayerTransfersSlice.actions;

export const selectAllRelayerTransfers = (state: RootState) =>
  state.relayertransfers;

export const selectLatestTimestampTransfer = (state: RootState) => {
  const v = Object.values(state.relayertransfers).sort(
    (a, b) => b.toTimestamp - a.toTimestamp
  );
  return v.length ? v[0].toTimestamp : 0;
};

export default relayerTransfersSlice.reducer;

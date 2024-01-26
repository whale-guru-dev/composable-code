import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  NFT_RELAYER_SUPPORTED_NETWORKS,
  SupportedNftRelayerNetwork,
} from "../../constants";
import { TokenId } from "defi/tokenInfo";
import { RootState } from "..";
import { NftTransferStates } from "@/types/nfts";
import { ethers } from "ethers";

export interface NftNetworkInfo {
  nftId: string;
  nftAddress: string;
  chainId: SupportedNftRelayerNetwork;
}

export interface NftNetworkInfoDestination {
  nftId?: string;
  nftAddress: string;
  chainId: SupportedNftRelayerNetwork;
}

export interface NftTransferStore {
  id: string;

  sourceNftInfo: NftNetworkInfo;
  destinationNftInfo: NftNetworkInfoDestination;
  originalNftInfo: NftNetworkInfo;

  nftUri: string;
  fromTimestamp: number;
  fromBlock: number;
  fromBlockCurrent: number;
  toTimestamp: number;
  fromAddress: string;
  toAddress: string;
  fee: { amount: string; feeTokenId: TokenId };
  depositTxHash: string;
  withdrawalTxHash: string;
  status: NftTransferStates;
}

const initialState: { [id: string]: NftTransferStore } = {};

export const initialNftTransferState: NftTransferStore = {
  id: "",
  sourceNftInfo: {
    chainId: NFT_RELAYER_SUPPORTED_NETWORKS[0],
    nftId: "0",
    nftAddress: ethers.constants.AddressZero,
  },
  originalNftInfo: {
    chainId: NFT_RELAYER_SUPPORTED_NETWORKS[0],
    nftId: "0",
    nftAddress: ethers.constants.AddressZero,
  },
  destinationNftInfo: {
    chainId: NFT_RELAYER_SUPPORTED_NETWORKS[1],
    nftAddress: ethers.constants.AddressZero,
  },
  nftUri: "",
  fromTimestamp: 0,
  fromBlock: 0,
  fromBlockCurrent: 0,
  toTimestamp: 0,
  fromAddress: ethers.constants.AddressZero,
  toAddress: ethers.constants.AddressZero,
  fee: {
    amount: "0",
    feeTokenId: "usdc",
  },
  depositTxHash: "",
  withdrawalTxHash: "",
  status: "depositing",
};

export const relayerNftTransfersSlice = createSlice({
  name: "nftrelayertransfers",
  initialState,
  reducers: {
    newNftRelayerDeposit: (
      state,
      action: PayloadAction<
        Omit<
          NftTransferStore,
          | "id"
          | "toTimestamp"
          | "fromTimestamp"
          | "withdrawalTxHash"
          | "status"
          | "fromBlock"
          | "fromBlockCurrent"
        >
      >
    ) => {
      const transfer = action.payload;
      const id = `${transfer.sourceNftInfo.chainId}-${transfer.depositTxHash}`;

      if (!(id in state)) {
        const tr = { ...initialNftTransferState, ...transfer };

        tr.status = "depositing";
        state[id] = tr;
      }
    },
    nftRelayerDeposited: (
      state,
      action: PayloadAction<
        Omit<
          NftTransferStore & { fromChainId: SupportedNftRelayerNetwork },
          | "sourceNftInfo"
          | "destinationNftInfo"
          | "originalNftInfo"
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
          | "nftUri"
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
        currentState.status = "confirmingDeposit";
        delete state[id];
        state[id] = currentState;
      }
    },
    nftRelayerUpdateDepositBlock: (
      state,
      action: PayloadAction<{
        depositTxHash: string;
        fromChainId: SupportedNftRelayerNetwork;
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
    nftRelayerDepositFailed: (
      state,
      action: PayloadAction<{
        depositTxHash: string;
        fromChainId: SupportedNftRelayerNetwork;
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
    nftRelayerDepositCanceled: (
      state,
      action: PayloadAction<{
        depositTxHash: string;
        fromChainId: SupportedNftRelayerNetwork;
      }>
    ) => {
      const transfer = action.payload;
      const id = `${transfer.fromChainId}-${transfer.depositTxHash}`;
      if (id in state) {
        delete state[id];
      }
    },
    newNftTransfer: (state, action: PayloadAction<NftTransferStore>) => {
      const transfer = action.payload;
      
      const id = `${transfer.sourceNftInfo.chainId}-${transfer.id}`;
      const tr = { ...initialNftTransferState, ...transfer };
      state[id] = tr;
    },
    // @ts-ignore
    nftRelayerTransfersReset: (state) => {
      state = {};
    },
  },
});

export const {
  newNftTransfer,
  nftRelayerUpdateDepositBlock,
  nftRelayerDepositFailed,
  nftRelayerDepositCanceled,
  nftRelayerTransfersReset,
  newNftRelayerDeposit,
  nftRelayerDeposited,
} = relayerNftTransfersSlice.actions;

export const selectAllNftRelayerTransfers = (state: RootState) =>
  state.nftrelayertransfers;

export const selectLatestTimestampNftTransfer = (state: RootState) => {
  const v = Object.values(state.nftrelayertransfers).sort(
    (a, b) => b.toTimestamp - a.toTimestamp
  );
  return v.length ? v[0].toTimestamp : 0;
};

export default relayerNftTransfersSlice.reducer;

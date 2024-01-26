import { NftTransfertatusApiResponse } from "@/types/nfts";
import { Manager } from "socket.io-client";

const manager = new Manager(process.env.NFT_WS_URL!, {
  reconnectionDelayMax: 10000,
});

export const getUserTxsWs = (
  userAddress: string,
  transferUpdateListener: (data: NftTransfertatusApiResponse) => any,
  isConnected?: (isConnected: boolean) => any
) => {
  const socket = manager.socket(`/transaction`, {
    auth: {
      fromAddress: userAddress,
    },
  });
  socket.on("status", (data) => {
    transferUpdateListener(data);
  });
  socket.on("connect", () => {
    if (isConnected) isConnected(true);
  });
  socket.on("disconnect", () => {
    if (isConnected) isConnected(false);
  });
  socket.on("connect_error", (err: any) => {
    console.error(`connect_error due to ${err.message}`);
    if (isConnected) isConnected(false);
  });

  return socket;
};

export const getExplorerTxsWs = (
  transferUpdateListener: (data: NftTransfertatusApiResponse) => any,
  isConnected?: (isConnected: boolean) => any
) => {
  const socket = manager.socket(`/transaction`, {
    auth: {
      status: "success",
    },
  });
  socket.on("status", (data) => {
    transferUpdateListener(data);
  });
  socket.on("connect", () => {
    if (isConnected) isConnected(true);
  });
  socket.on("disconnect", () => {
    if (isConnected) isConnected(false);
  });
  socket.on("connect_error", (err: any) => {
    console.error(`connect_error due to ${err.message}`);
    if (isConnected) isConnected(false);
  });

  return socket;
};

import { SupportedNftRelayerNetwork } from "@/constants";

export type ObjectBasic<T> = { [key: string]: T };
export type ObjectPromise<T> = ObjectBasic<Promise<T>>;

export type ReducerErrorType = {
  [key: string]: {
    reason: any;
    step: "getTokenId" | "getTokenURI" | "getNftUri";
  };
};

export type ReducerType<T> = {
  res: ObjectBasic<T>;
  err: ReducerErrorType;
};

export type ApiNft = {
  contractAddress: string;
  tokenId?: string;
  tokenName: string;
  tokenSymbol: string;
  balance: string;
  imageUrl: string;
};

export type NftType = {
  id: string;
  address: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  uri: string;
  networkId: SupportedNftRelayerNetwork;
};

export type NftTransferStatusType =
  | "depositing"
  | "deposited"
  | "confirming"
  | "sending"
  | "processing"
  | "done"
  | "error";

export type NftTransferProps = {
  item: NftType;
  handleBack: Function;
};

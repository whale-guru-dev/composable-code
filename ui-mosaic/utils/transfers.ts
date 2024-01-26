import { SupportedRelayerNetwork } from "../constants";
import { NEEDED_CONFIRMATIONS } from "../constants";
import { ADDRESSES } from "defi/addresses";
import { getToken, TokenId } from "defi/tokenInfo";
import { TransactionStatusApiResponse } from "store/apiService";
import {
  initialTransferState,
  TransferStore,
} from "store/relayerTransfers/slice";
import { toTokenUnitsBN } from "utils";
import { TransferStates } from "@/types/phase1";

export const convertApiTransfer = (
  apiTransfer: TransactionStatusApiResponse
): TransferStore => {
  const foundToken = Object.entries(ADDRESSES).find(
    ([_, address]) =>
      apiTransfer.sourceTokenAddress.toLowerCase() ===
      address[
        apiTransfer.sourceNetworkId as SupportedRelayerNetwork
      ].toLowerCase()
  );

  if (!foundToken) {
    console.error("Token not found when converting transfer");
    return initialTransferState;
  }

  const tokenId = foundToken[0] as TokenId;
  const token = getToken(tokenId);

  const eth = getToken("eth");
  const [_, id] = apiTransfer.publicId.split("-");
  return {
    tokenId: tokenId,
    amount: toTokenUnitsBN(
      apiTransfer.amount.$numberDecimal,
      token.decimals
    ).toFixed(),
    fee: apiTransfer.fee
      ? toTokenUnitsBN(apiTransfer.fee.$numberDecimal, token.decimals).toFixed()
      : "0",
    gasFee: toTokenUnitsBN(
      apiTransfer.gasUsed.$numberDecimal,
      eth.decimals
    ).toFixed(),
    id: id,
    depositTxHash: apiTransfer.depositTxHash,
    withdrawalTxHash: apiTransfer.withdrawTxHash
      ? apiTransfer.withdrawTxHash
      : "",
    fromAddress: apiTransfer.sourceUserAddress,
    toAddress: apiTransfer.destinationUserAddress,
    fromBlock: 0,
    fromBlockCurrent:
      NEEDED_CONFIRMATIONS[
        apiTransfer.sourceNetworkId as SupportedRelayerNetwork
      ],
    fromChainId: apiTransfer.sourceNetworkId as SupportedRelayerNetwork,
    toChainId: apiTransfer.remoteNetworkId as SupportedRelayerNetwork,
    fromTimestamp: new Date(apiTransfer.depositTimestamp).getTime(),
    toTimestamp: apiTransfer.withdrawTimestamp
      ? new Date(apiTransfer.withdrawTimestamp).getTime()
      : 0,
    status: apiTransfer.status as TransferStates,
  };
};

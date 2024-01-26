import BigNumber from "bignumber.js";
import { getNetworkRpcUrl } from "defi";
import {
  SupportedRelayerNetwork,
  SupportedRelayerToken,
} from "../../constants";
import { BigNumber as BigNumberEthers, ethers } from "ethers";
import { ADDRESSES } from "defi/addresses";
import { handleErr } from "defi/errorHandling";
import { toBaseUnitBN } from "utils";
import { getToken } from "defi/tokenInfo";
import { SupportedNetworkId, TestSupportedNetworkId, TEST_SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { ModalTextsProps } from "../PreReview/ConfirmationModal";
import { FormType } from "../Earn/Vaults/DepositWithdraw";

const abi = [
  "function calculateFeePercentage(address token, uint256 amount) public view returns (uint256)",
  "function feeFactor() public view returns (uint256)",
];

export const calculateFee = async (
  amount: BigNumber,
  tokenId: SupportedRelayerToken,
  chainId: SupportedRelayerNetwork
) => {
  const rpcUrl = getNetworkRpcUrl(chainId);
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl, chainId);
  const contract = new ethers.Contract(
    ADDRESSES.relayervault[chainId],
    abi,
    provider
  );

  const token = getToken(tokenId);

  const feePercentage: BigNumberEthers = await handleErr(() =>
    contract.calculateFeePercentage(
      ADDRESSES[tokenId][chainId],
      toBaseUnitBN(amount.toFixed(), token.decimals).toFixed()
    )
  );

  const fee = amount.multipliedBy(feePercentage.toString()).div(10000);
  return fee;
};

export function composeSwitchNetwork(
  from_network: TestSupportedNetworkId | undefined,
  to_network: TestSupportedNetworkId | undefined
) : ModalTextsProps {
  return {
    heading: "Switch Network",
    description: from_network && to_network ? `Switching from ${TEST_SUPPORTED_NETWORKS[from_network]?.name} to ${TEST_SUPPORTED_NETWORKS[to_network]?.name} network.` : '',
  };
}

export function composeApproval() : ModalTextsProps {
  return {
    heading: "Approve access",
    description: "Giving permission to access to wallet funds.",
  };
}

export function composeSwap(
  from_token: Token | undefined,
  to_token: Token | undefined,
  from_value: BigNumber | undefined,
  to_value: BigNumber | undefined
) : ModalTextsProps {
  return {
    heading: "Swap",
    description: from_value && from_token && to_value && to_token ? `Swap ${from_value.toFixed()} ${
      from_token.symbol
    } for ${to_value.toFixed()} ${to_token.symbol}` : '',
  };
}

export function composeDepositWithdraw(
  formType: FormType,
  token: Token | undefined,
  value: BigNumber | undefined
) : ModalTextsProps {
  switch (formType) {
    case 'deposit':
      return {
        heading: "Deposit",
        description: token && value ? `Deposit ${value.toFixed()} ${token.symbol}` : '',
      };
    case 'withdraw':
        return {
          heading: "Withdraw",
          description: token && value ? `Withdraw ${value.toFixed()} ${token.symbol}` : '',
        };
  }
}
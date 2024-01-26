import { NftTransferStore } from "@/store/nftRelayerTransfers/slice";
import BaseFlow, { CrossLayerFlowStepProps } from "./Baseflow";
import { NETWORKS } from "@/defi/networks";
import { NftTransferStates } from "@/types/nfts";
import { NEEDED_CONFIRMATIONS } from "@/constants";
import useMobile from "@/hooks/useMobile";
import {
  Box,
  BoxProps
} from "@mui/material";
import { ProgressStatus } from "../types";

const FLOW_ORDER: NftTransferStates[] = [
  "depositing", // 0
  "depositFailed", // 1
  "confirmingDeposit", // 2
  "processing", // 3
  "withdrawSubmitted", // 4
  "success", // 5
  "expired", // 6
];

type CrossLayerNftFlowProps = {
  transfer?: NftTransferStore
} & BoxProps;

const CrossLayerNftFlow = ({
  transfer,
  ...rest
}: CrossLayerNftFlowProps) => {
  const isMobile = useMobile('sm');

  if (!transfer) {
    return null;
  }

  const flowStepIndex = FLOW_ORDER.findIndex((x) => x === transfer.status);

  const sourceNetwork = NETWORKS[transfer.sourceNftInfo.chainId];
  const destinationNetwork = NETWORKS[transfer.destinationNftInfo.chainId];
  const confirmationsCount =
    NEEDED_CONFIRMATIONS[transfer.sourceNftInfo.chainId];

  const activeStep = () => {
    if (["depositing", "depositFailed"].includes(transfer.status)) {
      return 0;
    }

    if (["confirmingDeposit"].includes(transfer.status)) {
      return 1;
    }

    if (
      ["processing", "deposit_confirmed", "error-unlocked_funds"].includes(
        transfer.status
      )
    ) {
      return 2;
    }

    if (
      [
        "transferring-withdrawn",
        "error-withdrawn",
        "tranferring-withdrawing",
        "transferring-withdraw_submitted",
        "expired-done",
      ].includes(transfer.status)
    ) {
      return 3;
    }
    return 4;
  };

  const steps: CrossLayerFlowStepProps[] = [
    {
      chainId: transfer.sourceNftInfo.chainId,
      status:
        transfer.status === "depositing"
          ? ProgressStatus.in_progress
          : transfer.status === "depositFailed"
          ? ProgressStatus.error
          : ProgressStatus.done,
      text: "Sent",
    },
    {
      chainId: transfer.sourceNftInfo.chainId,
      status:
        transfer.status === "confirmingDeposit"
          ? ProgressStatus.in_progress
          : flowStepIndex < 2
          ? ProgressStatus.awaiting
          : ProgressStatus.done,
      text: `${
        transfer.fromBlockCurrent - transfer.fromBlock
      }/${confirmationsCount} confirmations`,
      urlInfo: {
        alt: "Click to see transaction details",
        url: sourceNetwork.infoPageUrl + transfer.depositTxHash,
      },
    },
    {
      status:
        transfer.status === "processing"
          ? ProgressStatus.in_progress
          : flowStepIndex < 3
          ? ProgressStatus.awaiting
          : ProgressStatus.done,
      text: "Bridge",
    },
    transfer.status === "expired"
      ? {
          chainId: transfer.destinationNftInfo.chainId,
          status: ProgressStatus.error,
          text: "Expired",
        }
      : {
          chainId: transfer.destinationNftInfo.chainId,
          status:
            transfer.status === "withdrawSubmitted"
              ? ProgressStatus.in_progress
              : flowStepIndex < 4
              ? ProgressStatus.awaiting
              : ProgressStatus.done,
          text: "0/12 confirmations",
          urlInfo: {
            alt: "Click to see transaction details",
            url: destinationNetwork.infoPageUrl + transfer.withdrawalTxHash,
          },
        },

    transfer.status === "expired"
      ? {
          chainId: transfer.destinationNftInfo.chainId,
          status: ProgressStatus.error,
          text: "Expired",
        }
      : {
          chainId: transfer.destinationNftInfo.chainId,
          status: 
            transfer.status === "success" 
              ? ProgressStatus.done 
              : ProgressStatus.awaiting,
          text: "Received",
        },
  ];

  const mobileSteps = [steps[0], steps[2], steps[4]];

  return (
    <Box sx={{
                marginLeft: '-10%',
                marginRight: '-10%',
            }}
          {...rest}
    >
          <BaseFlow steps={isMobile ? mobileSteps : steps} activeStep={activeStep()} />
    </Box>
  )
};

export default CrossLayerNftFlow;

import BaseFlow, { CrossLayerFlowStepProps } from "./Baseflow";
import useMobile from "@/hooks/useMobile";
import {
  Box,
  BoxProps,
} from "@mui/material";
import { ProgressStatus, ProgressStatusType } from "../types";
import { Transaction } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { TEST_SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { useBlockchainProvider } from "@integrations-lib/core";
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { useCallback, useEffect, useMemo, useState } from "react";

type CrossLayerTokenFlowProps = {
  tx: Transaction
} & BoxProps

interface ActiveStepState {
  step: number;
  status: ProgressStatusType;
}

const CrossLayerTokenFlow = ({
  tx,
  ...rest
}: CrossLayerTokenFlowProps) => {
  const isMobile = useMobile('sm');

  const sourceNetwork = TEST_SUPPORTED_NETWORKS[tx.sourceNetworkId];
  const destinationNetwork = TEST_SUPPORTED_NETWORKS[tx.remoteNetworkId];
  
  const depositHash = tx.transactions?.deposit?.hash;
  const withdrawalHash = tx.transactions?.withdrawal?.hash;

  const { provider: sourceProvider } = useBlockchainProvider(tx.sourceNetworkId);
  const { provider: destinationProvider } = useBlockchainProvider(tx.remoteNetworkId);

  const [sourceConfirmations, setSourceConfirmations] = useState<number>(0);
  const [destinationConfirmations, setDestinationConfirmations] = useState<number>(0);

  useEffect(
    () => {
      if (depositHash && sourceProvider && sourceNetwork) {
        sourceProvider
          .getTransaction(depositHash)
          .then((response: TransactionResponse) => {
            setSourceConfirmations(Math.min(response.confirmations, sourceNetwork.neededConfirmations));
          });
      }
    },
    [depositHash, sourceProvider, sourceNetwork]
  );

  useEffect(
    () => {
      if (withdrawalHash && destinationProvider && destinationNetwork) {
        destinationProvider
          .getTransaction(withdrawalHash)
          .then((response: TransactionResponse) => {
            setDestinationConfirmations(Math.min(response.confirmations, destinationNetwork.neededConfirmations));
          });
      }
    },
    [destinationProvider, destinationNetwork, withdrawalHash]
  );

  const activeStep = useCallback(
    () : ActiveStepState => {
      if (!sourceNetwork || !destinationNetwork) {
        return {
          step: -1,
          status: ProgressStatus.error,
        };
      }

      if (tx.type !== 'liquidity-withdrawal') {
        if (sourceConfirmations < sourceNetwork.neededConfirmations) {
          return {
            step: 1,
            status: ProgressStatus.in_progress,
          };
        }
      }

      if (tx.status === "in_progress" || tx.status === "error") {
        return {
          step: 2,
          status: tx.status,
        };
      }

      if (destinationConfirmations < destinationNetwork.neededConfirmations) {
        return {
          step: 3,
          status: ProgressStatus.in_progress,
        };
      }

      return {
        step: 4,
        status: ProgressStatus.done,
      };
    },
    [sourceNetwork, destinationNetwork, sourceConfirmations, destinationConfirmations, tx]
  );

  const steps: CrossLayerFlowStepProps[] = useMemo(
    () => {
      if (!sourceNetwork || !destinationNetwork) {
        return [];
      }

      const activeStepStatus = activeStep();

      const {
        step,
        status,
      } = activeStepStatus;

      const getStatus = (stepNb: number) => {
        return step < stepNb
          ? ProgressStatus.awaiting
          : step === stepNb
            ? status
            : ProgressStatus.done;
      }
      
      return [
        ...tx.type !== 'liquidity-withdrawal' ? [{
          chainId: tx.sourceNetworkId,
          status: getStatus(0),
          text: "Sent",
        },
        {
          chainId: tx.sourceNetworkId,
          status: getStatus(1),
          text: `${sourceConfirmations}/${sourceNetwork.neededConfirmations} confirmations`,
          urlInfo: {
            alt: "Click to see transaction details",
            url: sourceNetwork?.infoPageUrl + depositHash,
          },
        }] : [],
        {
          chainId: tx.remoteNetworkId,
          status: getStatus(2),
          text: "Bridge",
        },
        {
          chainId: tx.remoteNetworkId,
          status: getStatus(3),
          text: `${destinationConfirmations}/${destinationNetwork?.neededConfirmations} confirmations`,
          urlInfo: {
            alt: "Click to see transaction details",
            url: destinationNetwork?.infoPageUrl + withdrawalHash,
          },
        },
        {
          chainId: tx.remoteNetworkId,
          status: getStatus(4),
          text: "Received",
        },
      ];
    },
    [sourceNetwork, destinationNetwork, activeStep, tx, sourceConfirmations, destinationConfirmations, depositHash, withdrawalHash]
  );

  const mobileSteps = [steps[0], steps[2], steps[4]];

  return (
    <Box sx={{
                marginLeft: '-10%',
                marginRight: '-10%',
            }}
          {...rest}
    >
      <BaseFlow steps={isMobile ? mobileSteps : steps} activeStep={activeStep().step} />
    </Box>
  );
};

export default CrossLayerTokenFlow;

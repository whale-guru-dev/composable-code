import { 
  Step, 
  StepLabel, 
  Stepper, 
  StepperProps 
} from "@mui/material";
import React from "react";
import Connector from "@/components/CrossLayerFlow/Connector";
import Label from "../Step/Label";
import Icon from "../Step/Icon";
import { ProgressStatusType } from "../types";
import { TestSupportedNetworkId } from "@/submodules/contracts-operations/src/defi/constants";

export interface CrossLayerFlowStepProps {
  status: ProgressStatusType;
  chainId?: TestSupportedNetworkId;
  text: string;
  urlInfo?: { url: string; alt: string };
}

type BaseFlowProps = {
  steps: CrossLayerFlowStepProps[];
  activeStep: number;
} & StepperProps;

const BaseFlow = ({
  steps,
  activeStep,
  ...rest
}: BaseFlowProps) => {

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<Connector />}
      sx={{
        background: "transparent",
      }}
      {...rest}
    >
      {steps.map(({ status, chainId, urlInfo, text }, index) => (
        <Step key={index}>
          <StepLabel icon={<Icon status={status} chainId={chainId} />}>
            <Label text={text} urlInfo={urlInfo} />
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default BaseFlow;

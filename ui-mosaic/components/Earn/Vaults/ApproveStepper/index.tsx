import { BoxProps, Step, StepLabel, Stepper, Box } from "@mui/material";
import { Status } from "../types";
import Image from "next/image";
import { checked, clock, shield_rounded } from "@/assets/icons/common";
import Connector from "./Connector";

type ApproveStepperProps = {
  status?: Status;
  endIcon: string;
  endLabel: string;
} & BoxProps;

const ApproveStepper = ({
  status,
  endIcon,
  endLabel,
  ...rest
}: ApproveStepperProps) => {
  return (
    <Box {...rest}>
      <Stepper
        activeStep={status == Status.Approving ? 0 : 1}
        alternativeLabel
        connector={<Connector />}
      >
        <Step>
          <StepLabel
            icon={
              <Image
                src={status == Status.Approving ? shield_rounded : checked}
                alt={status == Status.Approving ? "Approve" : "Approved"}
                width="32"
                height="32"
              />
            }
          >
            {status == Status.Approving ? "Approve" : "Approved"}
          </StepLabel>
        </Step>
        <Step>
          <StepLabel
            icon={
              <Image
                src={status == Status.Approving ? clock : endIcon}
                alt={endLabel}
                width="32"
                height="32"
              />
            }
          >
            {endLabel}
          </StepLabel>
        </Step>
      </Stepper>
    </Box>
  );
};

ApproveStepper.defaultProps = {
  status: Status.Approving,
};

export default ApproveStepper;

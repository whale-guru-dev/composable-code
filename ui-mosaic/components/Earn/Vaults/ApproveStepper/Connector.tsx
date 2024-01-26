import {
  alpha,
  StepConnector,
  stepConnectorClasses,
  styled
} from "@mui/material";

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    top: 15,
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
      border: `1px solid ${alpha(theme.palette.common.white, theme.opacity.main)}`,
      background: alpha(theme.palette.common.white, theme.opacity.main),
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 1,
    border: `1px dotted ${alpha(theme.palette.common.white, theme.opacity.main)}`,
    background: 'transparent',
    borderRadius: 1,
  },
}));

export default Connector;

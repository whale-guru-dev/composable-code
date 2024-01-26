import { StepConnector, Theme, alpha } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

const Connector = withStyles((theme: Theme) => ({
  alternativeLabel: {
    top: 13,
    left: 'calc(-50% + 10px)',
    right: 'calc(50% + 10px)'
  },
  active: {
    '& $line': {
      backgroundColor: theme.palette.primary.main
    },
  },
  completed: {
    '& $line': {
      backgroundColor: theme.palette.primary.main
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: alpha(theme.palette.text.primary, 0.25),
    borderRadius: 1,
  },
}))(StepConnector)

export default Connector

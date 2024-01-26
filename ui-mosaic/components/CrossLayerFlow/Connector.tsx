import { StepConnector, Theme, alpha } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

const Connector = withStyles((theme: Theme) => ({
  alternativeLabel: {
    top: 14,
    left: 'calc(-50% + 12px)',
    right: 'calc(50% + 15px)'
  },
  active: {
    '& $line': {
      backgroundColor: alpha(theme.palette.common.white, theme.opacity.main),
      height: 3,
      borderTop: 0,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: alpha(theme.palette.common.white, theme.opacity.main),
      height: 3,
      borderTopWidth: 0,
    },
  },
  line: {
    height: 1,
    border: 0,
    borderTopWidth: 1,
    borderStyle: 'dotted',
    borderColor: alpha(theme.palette.common.white, theme.opacity.main),
    borderRadius: 1,
  },
}))(StepConnector)

export default Connector

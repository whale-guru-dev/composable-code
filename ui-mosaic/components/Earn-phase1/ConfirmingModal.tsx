import { Typography, CircularProgress, DialogProps } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material/styles';

import Modal from '../Modal'

interface ConfirmingModalProps extends DialogProps {
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center'
  },
  text: {
    color: theme.palette.text.primary,
    fontSize: '36px',
    lineHeight: '48px'
  },
  progress: {
    marginTop: theme.spacing(5)
  }
}))

const ConfirmingModal = ({ open, onClose }: ConfirmingModalProps) => {
  const classes = useStyles()

  return (
    <Modal.Container open={open} onClose={onClose}>
      <Modal.Content className={classes.root}>
        <Typography className={classes.text}>Confirming transaction</Typography>
        <CircularProgress className={classes.progress} />
      </Modal.Content>
    </Modal.Container>
  )
}

export default ConfirmingModal

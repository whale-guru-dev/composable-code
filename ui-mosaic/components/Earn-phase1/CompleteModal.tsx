import { Typography, DialogProps } from '@mui/material'
import { Theme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import Modal from '../Modal'
import Button from  '../Button'

interface CompleteModalProps extends DialogProps {
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
  label: {
    color: theme.palette.text.secondary,
    fontSize: '16px',
    lineHeight: '32px',
    margin: theme.spacing(2, 0)
  },
  progress: {
    marginTop: theme.spacing(5)
  }
}))

const CompleteModal = ({ open, onClose }: CompleteModalProps) => {
  const classes = useStyles()

  const handleClose = (event: React.SyntheticEvent) => {
    if (onClose) onClose(event, 'escapeKeyDown')
  }

  return (
    <Modal.Container open={open} onClose={onClose}>
      <Modal.Content className={classes.root}>
        <Typography className={classes.text}>Transaction submitted</Typography>
        <Typography className={classes.label}>Track current status of your transfer</Typography>
        <Button variant="outlined" color="primary" fullWidth onClick={handleClose}>Close</Button>
      </Modal.Content>
    </Modal.Container>
  )
}

export default CompleteModal

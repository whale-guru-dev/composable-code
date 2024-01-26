import { Theme } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import { alpha } from '@mui/material/styles';

import Text from './Text'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '500px',
      padding: theme.spacing(2, 5),
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(12),
      borderRadius: '10px',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%'
      }
    },
  })
)

type DesktopNotAllowedProps = {
  title: string
}

const DesktopNotAllowed = ({ title }: DesktopNotAllowedProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Text type="primary">Please, see the <strong>{title}</strong> page on desktop</Text>
    </div>
  )
}

export default DesktopNotAllowed

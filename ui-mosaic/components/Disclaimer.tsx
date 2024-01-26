import { Theme } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import { alpha } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 5),
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      textAlign: 'center',
      marginBottom: theme.spacing(6),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'fit-content',
      display: 'block',
      borderRadius: '10px'
    },
  })
)

const Disclaimer = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      Disclaimer: This is a proof of concept capped at 3m TVL.
    </div>
  )
}

export default Disclaimer

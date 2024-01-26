import Image from 'next/image'
import { makeStyles, createStyles } from '@mui/styles'
import { useMediaQuery } from '@mui/material'
import { Theme, useTheme, alpha } from '@mui/material/styles';
import { clock } from 'assets/icons/common'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '600px',
      padding: theme.spacing(2, 5),
      color: theme.palette.text.secondary,
      backgroundColor: alpha(theme.palette.text.primary, 0.05),
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      borderRadius: '10px',
      lineHeight: '24px',
      position: 'relative',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        maxWidth: '100%'
      }
    },
    token: {
      color: theme.palette.text.primary
    },
    tokens: {
      display: 'flex',
      position: 'absolute',
      left: '32px'
    },
  })
)

const Limitation = () => {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <div className={classes.root}>
      {!isMobile && (
        <div className={classes.tokens}>
          <div>
            <Image src={clock} alt="Out" width="24" height="24" />
          </div>
        </div>
      )}
      Transfer will be reverted if not completed in 30 minutes
    </div>
  )
}

export default Limitation

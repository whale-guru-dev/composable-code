import { makeStyles, createStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles';

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        display: 'block',
        marginBottom: theme.spacing(12)
      }
    },
    mobile: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(4)
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      background: 'linear-gradient(179.65deg, #180010 -0.39%, #10020B 99.69%)',
      boxShadow: '20px 0px 120px -12px rgba(0, 0, 0, 0.4)'
    },
    // necessary for content to be below app bar
    toolbar: {
      ...theme.mixins.toolbar,
      margin: theme.spacing(5, 0),
      textAlign: 'center'
    },
    main: {
      flexGrow: 1,
    },
    content: {
      padding: theme.spacing(3),
    },
    menu: {
      padding: theme.spacing(0, 3),
      marginTop: theme.spacing(5),
      color: theme.palette.text.secondary
    },
    account: {
      position: 'absolute',
      top: '0',
      right: '0',
      minWidth: '200px',
      height: '52px'
    },
    header: {
      position: 'relative'
    }
  })
)

export default useStyles

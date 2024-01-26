import Image from 'next/image'
import { Box, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: '100px',
    display: 'flex',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    // backgroundColor: theme.palette.other.background.n3,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '-80px',
  },
  image: {
    mixBlendMode: 'luminosity'
  }
}));

const NoNftsCover = () => {
  const classes = useStyles();


  return (
    <Box className={classes.root}>
      <Box className={classes.wrapper}>
        <Image src="/images/empty.png" width={320} height={320} className={classes.image} />
        <Box mb={9} />
        <Box>
          <Typography variant="h6" color="text.secondary">
            You don’t have any NFTs on this network
          </Typography>
        </Box>
      </Box>
    </Box>
  )
};

export default NoNftsCover;

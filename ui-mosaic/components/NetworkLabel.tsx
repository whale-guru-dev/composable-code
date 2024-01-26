import Image from "next/image";
import { ButtonProps, Theme, useTheme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { alpha } from '@mui/material/styles';

import Button from "./Button";
import { Network } from "../defi/types";

type NetworkButtonProps = {
  network?: Network;
  text?: string;
  customText?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'default',
      whiteSpace: 'nowrap',
    },
    image: {
      display: "flex",
      alignItems: "center",
      position: "absolute",
      left: "20px",
      [theme.breakpoints.down('sm')]: {
        left: "10px",
      }
    },
  })
);

const NetworkLabel = ({
  network,
  text,
  customText,
  ...rest
}: NetworkButtonProps & ButtonProps) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      color="primary"
      customColor={alpha(theme.palette.common.white, 0.07)}
      className={classes.root}
      {...rest}
    >
      {network ? 
        <>
          <div className={classes.image}>
            <Image
              src={network.logo}
              alt={network.name}
              width="24"
              height="24"
            />
          </div>
          {text ?? network.name}
        </>  :  customText || 'Select Network'
      }
    </Button>
  );
};

export default NetworkLabel;

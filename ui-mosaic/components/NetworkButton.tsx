import Image from "next/image";
import { ButtonProps } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

import Button from "./Button";
import { Network } from "../defi/types";
import { ExpandMore } from "@mui/icons-material";

type NetworkButtonProps = {
  network: Network;
  text?: string;
  isExpandMore?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minWidth: "200px",
    },
    image: {
      display: "flex",
      alignItems: "center",
      position: "absolute",
      left: "20px",
    },
    expandMore: {
      right: "20px",
      position: "absolute",
      display: "flex",
      alignItems: "center",
    }
  })
);

const NetworkButton = ({
  network,
  onClick,
  text,
  isExpandMore,
  ...rest
}: NetworkButtonProps & ButtonProps) => {
  const classes = useStyles();

  return (
    <Button
      variant="outlined"
      color="primary"
      customColor={network.backgroundColor}
      onClick={onClick}
      className={classes.root}
      {...rest}
    >
      <div className={classes.image}>
        <Image
          src={network.logo}
          alt={network.name}
          width="24"
          height="24"
        />
      </div>
      {text ?? network.name}
      {isExpandMore && <div className={classes.expandMore}>
        <ExpandMore />
      </div>}
    </Button>
  );
};

export default NetworkButton;

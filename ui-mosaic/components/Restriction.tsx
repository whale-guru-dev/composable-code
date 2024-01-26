import Image from "next/image";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme, alpha } from "@mui/material/styles";
import { getToken } from "defi/tokenInfo";
import { LIQUIDITY_PROVIDER_SUPPORTED_TOKEN } from "@/constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "600px",
      padding: theme.spacing(2, 5),
      color: theme.palette.text.secondary,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      margin: "auto",
      textAlign: "center",
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      borderRadius: "10px",
      lineHeight: "24px",
      position: "relative",
      [theme.breakpoints.down('sm')]: {
        width: "100%",
        maxWidth: "100%",
      },
      display: "flex",
      justifyContent: "center",
    },
    token: {
      color: theme.palette.text.primary,
    },
    tokens: {
      display: "flex",
      position: "absolute",
      left: "32px",
      [theme.breakpoints.down('sm')]: {
        display: "none",
      },
    },
    usdc: {
      marginLeft: theme.spacing(-1),
    },
  })
);

const Restriction = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.tokens}></div>
      <span>Currently we support</span>
      {LIQUIDITY_PROVIDER_SUPPORTED_TOKEN.map((t, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 8 : -8 }}>
          <Image
            src={getToken(t.tokenId).picture}
            alt={getToken(t.tokenId).symbol}
            width="24"
            height="24"
          />
        </span>
      ))}
    </div>
  );
};

export default Restriction;

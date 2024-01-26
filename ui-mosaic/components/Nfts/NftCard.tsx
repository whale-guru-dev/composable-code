import { alpha, Box } from "@mui/material";
import {
  Button,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { NftTransferStatusType, NftType } from "./types";
import { getAccountShorthand, titleize } from "utils";
import NetworkLabel from "../NetworkLabel";
import { NETWORKS } from "@/defi/networks";
import NftStatusLabel from "./NftStatusLabel";
import { useEffect, useState } from "react";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 240,
    },
    disabled: {
      opacity: theme.opacity.main,
    },
    done: {
      borderColor: theme.palette.success.main,
    },
    error: {
      borderColor: theme.palette.error.main,
    },
    processing: {
      borderColor: alpha(theme.palette.common.white, theme.opacity.dark),
      boxShadow: `0px 0px 16px ${alpha(
        theme.palette.common.white,
        theme.opacity.main
      )}`,
    },
    depositing: {
      borderColor: alpha(theme.palette.common.white, theme.opacity.dark),
      boxShadow: `0px 0px 16px ${alpha(
        theme.palette.common.white,
        theme.opacity.main
      )}`,
    },
    deposited: {
      borderColor: alpha(theme.palette.common.white, theme.opacity.dark),
      boxShadow: `0px 0px 16px ${alpha(
        theme.palette.common.white,
        theme.opacity.main
      )}`,
    },
    confirming: {
      borderColor: alpha(theme.palette.common.white, theme.opacity.dark),
      boxShadow: `0px 0px 16px ${alpha(
        theme.palette.common.white,
        theme.opacity.main
      )}`,
    },
    sending: {
      borderColor: alpha(theme.palette.common.white, theme.opacity.dark),
      boxShadow: `0px 0px 16px ${alpha(
        theme.palette.common.white,
        theme.opacity.main
      )}`,
    },
    initial: {},
  })
);

export type NftCardProps = {
  item: NftType;
  handleTransfer?: (nft: NftType) => any;
  isStatus?: boolean;
  noNetwork?: boolean;
  disabled?: boolean;
  status?: NftTransferStatusType;
  className?: string;
};

const NftCard = ({
  item,
  isStatus,
  noNetwork,
  disabled,
  status,
  className,
  handleTransfer,
}: NftCardProps) => {
  const classes = useStyles();
  /*
  const getPictureSrc = () => {
    try {
      const url = new URL(item.image);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return `/api/imageproxy?url=${encodeURIComponent(item.image)}`;
      } else {
        return item.image;
      }
    } catch (_) {
      return item.image;
    }
  };
*/

  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    axios.head(item.image).then((x) => {
      if (
        "content-type" in x.headers &&
        x.headers["content-type"].includes("video")
      ) {
        setIsVideo(true);
      }
    });
  }, []);

  return (
    <Card
      variant="outlined"
      className={`${className} ${classes.root} ${
        status ? (classes as any)[status as any] : ""
      } ${disabled ? classes.disabled : ""}`}
    >
      {isVideo ? (
        <video autoPlay loop style={{ width: 240, height: 180 }}>
          <source src={item.image} />
        </video>
      ) : (
        <img
          width="240"
          height="180"
          src={item.image}
          alt={item.name}
          style={{ objectFit: "cover" }}
        />
      )}

      <CardHeader
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              sx={{
                maxWidth: "60%",
              }}
            >
              <Typography
                gutterBottom
                variant="caption"
                component="div"
                color="text.primary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                #{item.tokenId}
              </Typography>
            </Box>
            {status && (
              <NftStatusLabel
                text={titleize(status)}
                status={status}
                size="small"
                link={undefined}
              />
            )}
          </Box>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {getAccountShorthand(item.address)}
          </Typography>
        }
      />
      <CardContent>
        <Typography
          variant="h6"
          color="text.primary"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </Typography>
      </CardContent>
      <CardActions>
        {!isStatus && !noNetwork && handleTransfer && (
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => handleTransfer(item)}
          >
            Transfer
          </Button>
        )}
        {(isStatus || noNetwork) && (
          <NetworkLabel
            network={
              !noNetwork && item.networkId
                ? NETWORKS[item.networkId]
                : undefined
            }
            fullWidth
          />
        )}
      </CardActions>
    </Card>
  );
};

export default NftCard;

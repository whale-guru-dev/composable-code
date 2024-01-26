import Image from "next/image";
import { checked, clock, error } from "assets/icons/common";
import { CircularProgress } from "@mui/material";
import { Box, Theme } from "@mui/material";
import { ProgressStatus, ProgressStatusType } from "../types";
import { TestSupportedNetworkId, TEST_SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";

type ProgressIconType = {
  icon: any; 
  alt: string;
};

const progressIcons: { [status in ProgressStatusType]: ProgressIconType } =
  {
    awaiting: {
      icon: clock,
      alt: ProgressStatus.awaiting,
    },
    in_progress: {
      icon: clock,
      alt: ProgressStatus.in_progress,
    },
    error: {
      icon: error,
      alt: ProgressStatus.error,
    },
    done: {
      icon: checked,
      alt: ProgressStatus.done,
    },
  };

const Icon = ({
  status,
  chainId,
}: {
  status: ProgressStatusType;
  chainId?: TestSupportedNetworkId;
}) => {

  return (
    <Box display="flex">
      <Box>
        {status !== ProgressStatus.in_progress ? (
          <Image
            src={progressIcons[status].icon}
            alt={progressIcons[status].alt}
            width="32"
            height="32"
          />
        ) : (
          <Box
            sx={{
              backgroundColor: "#950063",
              height: 32,
              width: 32,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "white" }} size={20} />
          </Box>
        )}
      </Box>

      {chainId && (
        <Box 
          sx={{
            marginLeft: (theme: Theme) => theme.spacing(-0.8),
            marginTop: (theme: Theme) => theme.spacing(2),
          }}
        >
          <Image
            src={getChainIconURL(chainId)}
            alt={TEST_SUPPORTED_NETWORKS[chainId]?.name}
            width="16"
            height="16"
          />
        </Box>
      )}
    </Box>
  );
};

export default Icon;

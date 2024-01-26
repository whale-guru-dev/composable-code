import React from "react";
import Image from "next/image";
import { Box, BoxProps, Theme, Typography } from "@mui/material";
import { crv, eth, usdc } from "assets/tokens";
import {
  CrossChainToken,
  selectCrossChainTokens,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { useAppSelector } from "@/store";

const SupportedTokenList = ({ ...rest }: BoxProps) => {
  const crossChainTokens: Array<CrossChainToken> = useAppSelector(
    selectCrossChainTokens
  );

  return (
    <Box
      sx={{
        padding: (theme: Theme) => theme.spacing(2, 0, 2),
        textAlign: "center",
      }}
      {...rest}
    >
      <Typography variant="caption" color="text.secondary">
        Currently we support
      </Typography>
      <Box display="flex" justifyContent="center" mt={2}>
        {crossChainTokens.map((token, i) => (
          <Box
            key={i}
            sx={{
              marginRight: (theme: Theme) => theme.spacing(3),
              "&:last-child": {
                marginRight: 0,
              },
            }}
          >
            <Image
              src={token.image}
              width={24}
              height={24}
              alt={i.toString()}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const InBoxSupportedTokens = ({ ...rest }: BoxProps) => {
  return (
    <Box
      display="flex"
      sx={{
        padding: (theme: Theme) => theme.spacing(2, 4),
        borderRadius: 2,
        background: (theme: Theme) => theme.palette.other.background.n7,
        alignItems: "center",
        textAlign: "center",
        maxWidth: 810,
        mx: "auto",
      }}
      {...rest}
    >
      <Box display="flex" mr="1">
        <Box display="flex">
          <Image src={eth} width={24} height={24} alt="ETH" />
        </Box>
        <Box sx={{ marginLeft: "-7px", display: "flex" }}>
          <Image src={usdc} width={24} height={24} alt="USDC" />
        </Box>
        <Box sx={{ marginLeft: "-7px", display: "flex" }}>
          <Image src={crv} width={24} height={24} alt="CRV" />
        </Box>
      </Box>
      <Box width={"100%"} textAlign={"center"}>
        <Typography variant="caption" color="text.secondary" mr={1}>
          Currently we support
        </Typography>
        <Typography variant="caption" color="text.primary" mr={1}>
          ETH, USDC
        </Typography>
        <Typography variant="caption" color="text.secondary" mr={1}>
          and
        </Typography>
        <Typography variant="caption" color="text.primary">
          CRV
        </Typography>
      </Box>
    </Box>
  );
};

export default SupportedTokenList;

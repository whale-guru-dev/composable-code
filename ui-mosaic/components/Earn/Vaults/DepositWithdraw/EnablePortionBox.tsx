import * as React from "react";
import {
  Box,
  BoxProps,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import IconButton from "@/components/IconButton";
import { SupportedNetwork } from "@/submodules/contracts-operations/src/defi/constants";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";

type EnablePortionBoxProps = {
  disabled: boolean;
  network: SupportedNetwork;
  checked: boolean;
  setChecked: (status: boolean) => any;
  operation: "swap" | "withdraw";
} & BoxProps;

const EnablePortionBox = ({
  disabled,
  network,
  checked,
  setChecked,
  operation = "withdraw",
  ...rest
}: EnablePortionBoxProps) => {
  const withdrawText = "I would like to withdraw a portion of my tokens to ";
  const swapText = "I would like to swap a portion of my tokens to ";
  const text = operation === "swap" ? swapText : withdrawText;
  if (!network) {
    return null;
  }
  return (
    <Box {...rest}>
      <FormControlLabel
        control={
          <Checkbox
            disabled={disabled}
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
          >
            <Typography
              variant="body2"
              color={`text.${disabled ? "disabled" : "primary"}`}
              display="flex"
              alignItems="center"
            >
              {text}
            </Typography>
            <Image
              src={getChainIconURL(network.chainId)}
              width={24}
              height={24}
              alt={network.name}
            />
            &nbsp;{network.nativeToken.symbol}
            <Tooltip
              title={
                <React.Fragment>
                  <Typography variant="body2">
                    Enabling this option will allow to swap the minimum amount
                    to operate on the destination network. If you do not have
                    any funds in your wallet, this will help you to use your
                    swapped tokens on this network.
                  </Typography>
                </React.Fragment>
              }
              placement="bottom"
              arrow
            >
              <IconButton size="small" variant="phantom" sx={{ ml: 1 }}>
                <ErrorOutlineOutlinedIcon
                  sx={{
                    width: 16,
                    height: 16,
                  }}
                  color="primary"
                />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
    </Box>
  );
};

EnablePortionBox.defaultProps = {
  disabled: false
}

export default EnablePortionBox;

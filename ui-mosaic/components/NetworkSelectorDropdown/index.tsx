import * as React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { InputLabel } from "@mui/material";
import { NETWORKS } from "@/defi/networks";
import { SupportedNetworks } from "@/defi/types";

import AutoSelector from "../AutoSelector";

export type NetworkSelectorProps = {
  label?: string;
  networks: SupportedNetworks[];
  selected: SupportedNetworks;
  onChangeHandler: (selected: SupportedNetworks) => void;
  disabled?: boolean;
  endLabel?: { network: SupportedNetworks; text: string };
} & BoxProps;

export default function NetworkSelector({
  label,
  networks,
  selected,
  onChangeHandler,
  disabled,
  endLabel,
  ...rest
}: NetworkSelectorProps) {
  const curObject = NETWORKS[selected];
  return (
    <Box {...rest}>
      {label && <InputLabel variant="standard">{label}</InputLabel>}
      <AutoSelector
        items={networks}
        onChange={onChangeHandler}
        picture={curObject.logo}
        text={curObject.name}
        getItemLabel={(option) => NETWORKS[option].name}
        renderItem={(props, option) => {
          const network = NETWORKS[option];
          return (
            <AutoSelector.DropdownItem
              imageSrc={network.logo}
              imageAlt={network.name}
              labelText={network.name}
              props={props}
              isSelected={option === selected}
              endLabel={
                endLabel && option === endLabel.network
                  ? endLabel.text
                  : undefined
              }
            />
          );
        }}
      />
    </Box>
  );
}

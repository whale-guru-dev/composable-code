import { Tooltip, Button, TooltipProps } from "@mui/material";

import React from "react";
import Image from "next/image";
import { tooltip } from "assets/icons/common";

export type CustomizedTooltipProps = Omit<TooltipProps, "children"> & {
  title: string;
};

const CustomizedTooltip = ({ title, ...rest }: CustomizedTooltipProps) => {
  return (
    <Tooltip {...rest} arrow title={title}>
      <Button
        sx={{
          p: 0,
          border: "none",
          minWidth: 14,
          "&:hover": {
            border: "none",
            backgroundColor: "transparent",
          },
        }}
      >
        <Image src={tooltip} width={14} height={14} alt={"tooltip"} />
      </Button>
    </Tooltip>
  );
};

export default CustomizedTooltip;

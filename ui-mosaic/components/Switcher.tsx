import React from "react";
import { Box, BoxProps, Tab, Tabs } from "@mui/material";

type SwitcherProps = {
  selectedTab: number;
  handleTabChange: (_: React.SyntheticEvent, newValue: number) => any;
  firstLabel?: string;
  secondLabel?: string;
} & BoxProps;

const Switcher = ({
  selectedTab,
  handleTabChange,
  firstLabel,
  secondLabel,
  ...rest
}: SwitcherProps) => {
  return (
    <Box {...rest}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Tab label={firstLabel} wrapped />
        <Tab label={secondLabel} wrapped />
      </Tabs>
    </Box>
  );
};

Switcher.defaultProps = {
  firstLabel: "First",
  secondLabel: "Second",
};

export default Switcher;

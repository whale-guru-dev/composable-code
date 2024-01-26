import React from "react";
import { Box, BoxProps, Tab, Tabs } from "@mui/material";

type SwitcherProps = {
  selectedTab: number;
  handleTabChange: () => any;
  depositLabel?: string;
  withdrawLabel?: string;
} & BoxProps

const Switcher = ({
  selectedTab,
  handleTabChange,
  depositLabel,
  withdrawLabel,
  ...rest
}: SwitcherProps) => {

  const onChange = (_: React.SyntheticEvent) => {
    handleTabChange();
  };

  return (
    <Box {...rest}>
      <Tabs
        value={selectedTab}
        onChange={onChange}
        variant="fullWidth"
        sx={{
          '& .MuiTabs-indicator':{
            backgroundColor: 'transparent',
          }
        }}
      >
        <Tab label={depositLabel} id="deposit-tab" wrapped />
        <Tab label={withdrawLabel} id="withdraw-tab" wrapped />
      </Tabs>

    </Box>
  );
};

Switcher.defaultProps = {
  depositLabel: 'Deposit',
  withdrawLabel: 'Withdraw',
}

export default Switcher;

import { Box, OutlinedInput, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";

export type DestinationAddressProps = {
  address?: string;
  onChange: (value: string) => void;
};

const DestinationAddress = ({ address, onChange }: DestinationAddressProps) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  return (
    <Box>
      <Box
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "primary.main",
        }}
      >
        <Typography>Change destination address (Optional)</Typography>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Box>
      {open && (
        <Box mt={6}>
          <OutlinedInput
            type="text"
            fullWidth
            value={address}
            placeholder="Enter destination address"
            onChange={(e) => onChange(e.target.value)}
          />
        </Box>
      )}
    </Box>
  );
};

export default DestinationAddress;

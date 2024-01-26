import {
  Typography,
  Theme,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  styled,
  Paper,
  PaperProps,
  ListItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { makeStyles, createStyles } from "@mui/styles";
import Image from "next/image";
import React, { useState } from "react";

import { SupportedNetworkId, SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";
import { search as SearchIcon, check as CheckIcon } from "assets/icons/common";
import { arbitrum } from "@/assets/networks";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";

export type NetworkSelectorProps = {
  label?: string;
  networks: SupportedNetworkId[];
  selected: SupportedNetworkId | undefined;
  isExpandMore?: boolean;
  onChange: (selected: SupportedNetworkId) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1),
    },
  })
);

const NetworkMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  textAlign: "center",
}));

const NetworkSelectDropdownPane = React.forwardRef<
  HTMLDivElement,
  Partial<
    PaperProps<"div", { value: string; onChange: (value: string) => void }>
  >
>(({ children, value, onChange, ...rest }, ref) => {
  return (
    <Paper ref={ref} {...rest}>
      <ListItem>
        <TextField
          color="primary"
          type="text"
          margin="normal"
          fullWidth
          onKeyDown={(e) => e.stopPropagation()}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Search"
          sx={{
            textAlign: "center",
            ":hover": {
              borderColor: "primary.main",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Image src={SearchIcon} alt={"Search"} width="22" height="22" />
              </InputAdornment>
            ),
            endAdornment:
              value == "" ? (
                <Box ml={2} />
              ) : (
                <InputAdornment position="end">
                  <ClearIcon
                    fontSize="small"
                    onClick={() => onChange && onChange("")}
                    sx={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
          }}
        />
      </ListItem>
      {children}
    </Paper>
  );
});
NetworkSelectDropdownPane.displayName = "NetworkSelectDropdownPane";

const NetworkSelector = ({
  label,
  networks,
  selected,
  onChange,
}: NetworkSelectorProps) => {
  const [searchKey, setSearchKey] = useState("");
  const classes = useStyles();

  return (
    <div>
      {label && <Typography className={classes.label}>{label}</Typography>}
      <TextField
        color="primary"
        select
        fullWidth
        placeholder="Select"
        margin="normal"
        hiddenLabel
        value={selected}
        onChange={(e) =>
          onChange(parseInt(e.target.value) as SupportedNetworkId)
        }
        sx={{
          mb: 0,
          height: 52,
        }}
        SelectProps={{
          displayEmpty: true,
          sx: {
            "&:hover": {
              borderColor: "primary.main",
            },
            "& .checkImage": {
              display: "none !important",
            },
          },
          MenuProps: {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            PaperProps: {
              component: NetworkSelectDropdownPane,
              value: searchKey,
              onChange: setSearchKey,
              elevation: 17,
              sx: {
                maxHeight: 400,
                border: "1px solid",
                maxWidth: 100,
                borderColor: "other.border.d1",
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: "primary.main",
                },
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "primary.dark",
                },
                "& .MuiMenuItem-root.Mui-selected:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            } as any,
          },
        }}
      >
        <NetworkMenuItem value="" hidden style={{ display: "none" }}>
          Select network
        </NetworkMenuItem>
        {networks
          .filter((id: SupportedNetworkId) => SUPPORTED_NETWORKS[id].name
              .toLocaleUpperCase()
              .includes(searchKey.toLocaleUpperCase())
          )
          .map((id: SupportedNetworkId) => (
            <NetworkMenuItem key={id} value={id}>
              <Image
                width={24}
                height={24}
                src={getChainIconURL(id)}
                alt={SUPPORTED_NETWORKS[id].name}
              />
              &nbsp;&nbsp;
              <Typography
                component="p"
                align="center"
                textOverflow="ellipsis"
                overflow="hidden"
                margin="auto"
              >
                {SUPPORTED_NETWORKS[id].name}
              </Typography>
              {id === selected ? (
                <Image
                  width={24}
                  height={24}
                  src={CheckIcon}
                  alt="check"
                  className="checkImage"
                />
              ) : (
                <Box ml={3} />
              )}
            </NetworkMenuItem>
          ))}
      </TextField>
    </div>
  );
};

export default NetworkSelector;

import {
  alpha,
  Box,
  BoxProps,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { TransactionType } from "@/submodules/contracts-operations/src/api";

export type TransactionFilter = "All Transactions" | "NFT" | "Swap" | "Earn";

export const TransactionFilterToTypesMapping: { [key in TransactionFilter]: Array<TransactionType> } = {
  "All Transactions" : ["all"],
  "NFT": ["nft"],
  "Swap": ["token"],
  "Earn": ["liquidity-withdrawal", "liquidity-deposit"],
};

type FilterNavProps = {
  isGlobal?: boolean;
  filter: TransactionFilter;
  setFilter: (filter: TransactionFilter) => any;
} & BoxProps;
const FilterNav = ({
  isGlobal,
  filter,
  setFilter,
  ...rest
}: FilterNavProps) => {
  const [anchorEl, setAnchorEl] = React.useState<Element>();
  const open = Boolean(anchorEl);
  const showFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const selectFilter = (filter: TransactionFilter) => {
    setFilter(filter);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      {...rest}
    >
      <Typography variant="body2" color="text.secondary">
        {filter}
      </Typography>
      <IconButton
        id="filter-dropdown-button"
        sx={{
          border: "none",
        }}
        size="small"
        onClick={showFilters}
      >
        <FilterListIcon
          sx={{
            color: (theme: Theme) => theme.palette.primary.main
          }}
        />
      </IconButton>

      <Menu
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 1,
            minWidth: 320,
            border: (theme: Theme) =>
              `1px solid ${alpha(
                theme.palette.common.white,
                theme.opacity.lighter
              )}`,
            marginTop: (theme: Theme) => theme.spacing(1),
            "& .MuiMenuItem-root": {
              "&:hover": {
                backgroundColor: (theme: Theme) =>
                  alpha(theme.palette.primary.main, theme.opacity.dark),
              },
            },
            "& .MuiMenu-list": {
              padding: 0,
            },
          },
        }}
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id="filter-dropdown-nav"
        MenuListProps={{
          "aria-labelledby": "filter-dropdown-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {Object.keys(TransactionFilterToTypesMapping).map(
          (key) =>
            (!isGlobal || key != "earn") && (
              <MenuItem
                onClick={() => selectFilter(key as TransactionFilter)}
                value={key}
                disableRipple
                selected={key === filter}
                sx={{
                  padding: (theme: Theme) => theme.spacing(1.625, 8),
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  "&.Mui-selected": {
                    backgroundColor: (theme: Theme) =>
                      alpha(theme.palette.primary.main, theme.opacity.dark),
                  },
                }}
                key={key}
              >
                <Typography variant="body2">
                  {key}
                </Typography>
                {key === filter && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 24,
                    }}
                  >
                    <CheckIcon />
                  </Box>
                )}
              </MenuItem>
            )
        )}
      </Menu>
    </Box>
  );
};

export default FilterNav;

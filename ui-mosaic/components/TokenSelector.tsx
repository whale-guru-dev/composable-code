import React from "react";
import Image from "next/image";
import {
  Typography,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  styled,
  Paper,
  PaperProps,
  ListItem,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import { search as SearchIcon, check as CheckIcon } from "assets/icons/common";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";

export type TokenSelectorProps = {
  tokens: Array<Token>;
  value: string;
  onChange: (selected: Token) => void;
};

const TokenMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  textAlign: "center",
}));

const TokenSelectDropdownPane = React.forwardRef<
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
          sx={{ textAlign: "center" }}
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
TokenSelectDropdownPane.displayName = "TokenSelectDropdownPane";

const TokenSelector = ({ tokens, value, onChange }: TokenSelectorProps) => {
  const [searchKey, setSearchKey] = React.useState("");

  return (
    <div>
      <TextField
        color="primary"
        select
        fullWidth
        placeholder="Select"
        margin="normal"
        hiddenLabel
        value={value}
        onChange={(e) => onChange(tokens.find((token: Token) => token.address === e.target.value) as Token)}
        sx={{
          mb: 0,
          height: 52,
        }}
        SelectProps={{
          displayEmpty: true,
          sx: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
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
              component: TokenSelectDropdownPane,
              value: searchKey,
              onChange: setSearchKey,
              elevation: 17,
              sx: {
                maxHeight: 400,
                maxWidth: 100,
                border: "1px solid",
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
        <TokenMenuItem value="" hidden style={{ display: "none" }}>
          Select Token
        </TokenMenuItem>
        {tokens
          .filter((token) => token.symbol.toUpperCase().includes(searchKey.toLocaleUpperCase()))
          .map((token) => (
            <TokenMenuItem key={token.symbol} value={token.address}>
              <Image
                width={24}
                height={24}
                src={token.image}
                alt={token.symbol}
              />
              &nbsp;&nbsp;
              <Typography
                component="p"
                align="center"
                textOverflow="ellipsis"
                overflow="hidden"
                margin="auto"
              >
                {token.symbol}
              </Typography>
              {token.address === value ? (
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
            </TokenMenuItem>
          ))}
      </TextField>
    </div>
  );
};

export default TokenSelector;

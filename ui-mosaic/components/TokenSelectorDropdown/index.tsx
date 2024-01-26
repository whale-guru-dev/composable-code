import React, { ChangeEvent, ReactNode, useState } from "react";
import {
  Typography,
  Theme,
  InputLabel,
  Select,
  SelectChangeEvent,
  alpha,
  Box,
  BoxProps,
  OutlinedInput,
  ListSubheader,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import Image from "next/image";
import { ExpandMore } from "@mui/icons-material";
import OptionItem from "./OptionItem";
import { getToken, TokenId } from "@/defi/tokenInfo";

export type TokenSelectorDropdownProps = {
  label?: string;
  tokens: TokenId[];
  selected: string;
  onChangeHandler: (event: SelectChangeEvent<string>, _child: ReactNode) => void;
  disabled?: boolean;
  searchable?: boolean;
} & BoxProps;

const TokenSelectorDropdown = ({
  label,
  tokens,
  selected,
  onChangeHandler,
  disabled,
  searchable,
  ...rest
}: TokenSelectorDropdownProps) => {

  const [keyword, setKeyword] = useState<string>("");

  const handleKewordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setKeyword(event.target.value);
  }

  const searchTokenIds = (tokenIds: TokenId[], keyword: string) => {
    return tokenIds.filter((tokenId) => selected == tokenId || getToken(tokenId).symbol.toLowerCase().indexOf(keyword.toLowerCase()) != -1)
  }

  return (
    <Box {...rest}>
      {label && <InputLabel variant="standard">{label}</InputLabel>}

      <Select
        disabled={disabled}
        value={selected}
        onChange={onChangeHandler}
        inputProps={{ "aria-label": "Without label" }}
        fullWidth
        IconComponent={ExpandMore}
        onClick={() => {setKeyword('');}}
        sx={{
          '&.Mui-focused': {
            borderColor: (theme: Theme) => alpha(theme.palette.primary.dark, theme.opacity.dark),
          },
          '& .MuiSelect-select': {
            paddingLeft:  (theme: Theme) => theme.spacing(4),
            '& .MuiTypography-root':{
              width: '100%',
            }
          }
        }}
        MenuProps={{
          sx: {
            '.MuiMenu-paper': {
              background: (theme: Theme) => theme.palette.other.background.n3,
              border: (theme: Theme) => `1px solid ${alpha(theme.palette.text.primary, 0.16)}`,
              marginTop: '2px',
            }
          }
        }}
      >
        {searchable && <ListSubheader sx={{
                          background: (theme: Theme) => theme.palette.other.background.n3,
                          paddingBottom: (theme: Theme) => theme.spacing(1),
                        }}>
          <OutlinedInput
            fullWidth
            autoFocus
            placeholder="Search"
            startAdornment={
              <SearchIcon fontSize="medium"
                          sx={{
                            color: (theme: Theme) => theme.palette.text.secondary,
                          }} />
            }
            value={keyword}
            onChange={handleKewordChange}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </ListSubheader>}
        {searchTokenIds(tokens, keyword).map((tokenId) => {
          const token = getToken(tokenId);
          return (
            <OptionItem
              value={tokenId}
              key={tokenId}
              disabled={selected == tokenId}
            >
              <Box sx={{
                      position: "absolute",
                      left: 20,
                      display: "flex",
                    }}>
                <Image
                  src={token.picture}
                  alt={token.symbol}
                  width="24"
                  height="24"
                />
              </Box>

              <Typography>{token.symbol}</Typography>

            </OptionItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default TokenSelectorDropdown;

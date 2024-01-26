import { useTheme } from "@mui/material/styles";
import {
  alpha,
  Box,
  Fade,
  IconButton,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import { SELECT_TOKEN_SEARCH_PLACEHOLDER } from "../constants";
import React from "react";
import { Close, Search } from "@mui/icons-material";

type SearchInputProps = Omit<OutlinedInputProps, 'value'> & {
  onReset: () => void;
  value: string;
};

export const SearchInput = ({
  onReset,
  value,
  ...rest
}: SearchInputProps) => {
  const theme = useTheme();
  const iconColor = alpha(theme.palette.common.white, 0.6);

  return (
    <Box sx={{ paddingX: theme.spacing(3), mb: theme.spacing(2) }}>
      <OutlinedInput
        fullWidth
        autoFocus
        placeholder={SELECT_TOKEN_SEARCH_PLACEHOLDER}
        value={value}
        endAdornment={
          <Fade in={value.length > 0}>
            <IconButton
              disableRipple
              onClick={onReset}
              edge={"end"}
              sx={{
                color: theme.palette.primary.main,
                border: 0,
              }}
            >
              <Close />
            </IconButton>
          </Fade>
        }
        startAdornment={
          <Search
            sx={{
              color: iconColor,
            }}
          />
        }
        {...rest}
      />
    </Box>
  );
};

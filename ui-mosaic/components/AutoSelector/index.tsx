import * as React from "react";
import { useTheme } from "@mui/material/styles";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Autocomplete, {
  AutocompleteCloseReason,
} from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import { PopperComponent, StyledPopper } from "./PopperComponents";
import SelectButton from "./SelectButton";
import { InputAdornment, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { search as SearchIcon, check as CheckIcon } from "assets/icons/common";
import NftStatusLabel from "../Nfts/NftStatusLabel";

export type AutoSelectorProps<T> = {
  items: T[];
  picture: string;
  text: string;
  onChange: (value: T) => void;
  renderItem: (props: any, option: T) => any;
  getItemLabel: (option: T) => string;
  buttonStyle?: object;
};

export default function AutoSelector<T>({
  items,
  onChange,
  picture,
  text,
  renderItem,
  getItemLabel,
  buttonStyle,
}: AutoSelectorProps<T>) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchKey, setSearchKey] = React.useState("");
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div>
      <div ref={buttonRef}>
        <SelectButton
          onClick={handleClick}
          picture={picture}
          text={text}
          open={open}
          extraStyle={buttonStyle}
        />
      </div>

      <StyledPopper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ width: buttonRef?.current?.offsetWidth }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <Autocomplete
              sx={{
                "&.MuiAutocomplete-root": {
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  "& .MuiOutlinedInput-root": {
                    px: theme.spacing(2),
                  },
                  "& .MuiFormControl-root": {
                    padding: theme.spacing(1, 2),
                  },
                },
              }}
              open
              onClose={(
                _event: React.ChangeEvent<{}>,
                reason: AutocompleteCloseReason
              ) => {
                if (reason === "escape") {
                  handleClose();
                }
              }}
              onInputChange={(_event, value) => setSearchKey(value)}
              inputValue={searchKey}
              onChange={(event, newValue, reason) => {
                if (
                  event.type === "keydown" &&
                  (event as React.KeyboardEvent).key === "Backspace" &&
                  reason === "removeOption"
                ) {
                  return;
                }
                onChange(newValue as T);
                handleClose();
              }}
              disableCloseOnSelect
              PopperComponent={PopperComponent}
              renderTags={() => null}
              noOptionsText="No labels"
              renderOption={renderItem}
              options={[...items]}
              getOptionLabel={getItemLabel}
              renderInput={(params) => (
                <TextField
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  autoFocus
                  color="primary"
                  type="text"
                  margin="normal"
                  fullWidth
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Search"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Image
                          src={SearchIcon}
                          alt={"Search"}
                          width="22"
                          height="22"
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <ClearIcon
                          fontSize="small"
                          onClick={() => setSearchKey("")}
                          sx={{
                            cursor: "pointer",
                            visibility: searchKey !== "" ? "visible" : "hidden",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
        </ClickAwayListener>
      </StyledPopper>
    </div>
  );
}

type ItemProps = {
  props: object;
  imageSrc: string;
  imageAlt: string;
  isSelected: boolean;
  labelText: string;
};

const AutoSelectorItem = ({
  props,
  imageSrc,
  imageAlt,
  isSelected,
  labelText,
}: ItemProps) => {
  const theme = useTheme();
  return (
    <li
      {...props}
      style={{
        backgroundColor: isSelected ? theme.palette.primary.main : "",
      }}
    >
      <Image width={24} height={24} src={imageSrc} alt={imageAlt} />
      &nbsp;&nbsp;
      <Typography
        component="p"
        align="center"
        textOverflow="ellipsis"
        overflow="hidden"
        margin="auto"
      >
        {labelText}
      </Typography>
      {isSelected ? (
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
    </li>
  );
};

type DropdownItemProps = {
  endLabel?: string;
} & ItemProps;

const DropdownItem = ({
  props,
  imageSrc,
  imageAlt,
  isSelected,
  labelText,
  endLabel,
}: DropdownItemProps) => {
  return (
    <li
      {...props}
      style={{
        opacity: isSelected ? 0.07 : 1,
        backgroundColor: isSelected ? "transparent" : "",
      }}
    >
      <Image width={24} height={24} src={imageSrc} alt={imageAlt} />
      &nbsp;&nbsp;
      <Typography
        component="p"
        align="center"
        textOverflow="ellipsis"
        overflow="hidden"
        margin="auto"
      >
        {labelText}
      </Typography>
      {endLabel && (
        <Box
          sx={{
            position: "absolute",
            right: 40,
            display: "flex",
          }}
        >
          <NftStatusLabel
            text={endLabel}
            status="done"
            size="small"
            link={undefined}
          />
        </Box>
      )}
    </li>
  );
};
AutoSelector.Item = AutoSelectorItem;
AutoSelector.DropdownItem = DropdownItem;

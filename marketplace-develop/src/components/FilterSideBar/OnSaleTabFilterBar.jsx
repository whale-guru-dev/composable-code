import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import {
  Collapse,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputAdornment,
} from '@mui/material';

const CollapseCustom = styled(Collapse)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  padding: theme.spacing(2, 2),
}));

const FilterMenuItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2, 2, 2, 0),
  marginLeft: theme.spacing(-5),
  fontWeight: 'bold',
  border: `1px solid ${theme.palette.text.lighter}`,
}));

const OnSaleFilterTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1),
  backgroundColor: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    border: `1px solid ${theme.palette.border.lighter}`,
    borderRadius: '10px',
  },
}));

export default function OnSaleTabFilterBar({ collapseOpen }) {
  const [open, setOpen] = useState(collapseOpen);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const onSaleList = {
    ETH: false,
    NRG: false,
    WETH: false,
    AC: false,
    ALXO: false,
  };
  const [filteredOnSaleList, setOnSaleList] = useState(onSaleList); // dummy List

  const handleSaleChange = (event) => {
    const newSaleList = {
      ...filteredOnSaleList,
      [event.target.name]: event.target.checked,
    };
    setOnSaleList(newSaleList);
    console.log(newSaleList);
  };

  const FilterOnSaleList = (e) => {
    setOnSaleList(
      Object.keys(onSaleList)
        .filter((key) => key.toLowerCase().indexOf(e?.target?.value?.toLowerCase()) >= 0)
        .reduce((cur, key) => {
          return Object.assign(cur, { [key]: onSaleList[key] });
        }, {}),
    );
  };

  return (
    <>
      <FilterMenuItem onClick={handleClickOpen}>
        <ListItemIcon />
        <ListItemText primaryTypographyProps={{ fontWeight: '700' }} primary="On Sale In" />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterMenuItem>
      <CollapseCustom in={open} timeout="auto" unmountOnExit>
        <FormControl component="fieldset" variant="standard">
          <OnSaleFilterTextField
            placeholder="Filter"
            icon={SearchIcon}
            onChange={(e) => FilterOnSaleList(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormGroup>
            {Object.keys(filteredOnSaleList).map((saleKey) => {
              return (
                <FormControlLabel
                  key={saleKey}
                  control={
                    <Checkbox
                      checked={filteredOnSaleList?.[saleKey]}
                      onChange={handleSaleChange}
                      name={saleKey}
                    />
                  }
                  label={saleKey}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </CollapseCustom>
    </>
  );
}

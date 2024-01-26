import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import {
  InputLabel,
  Collapse,
  Button,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  MenuItem,
  FormControl,
  TextField,
  Select,
} from '@mui/material';

const PriceRangeDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '& p': {
    fontSize: '1.2rem',
  },
}));

const FilterMenuItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2, 2, 2, 0),
  marginLeft: theme.spacing(-5),
  fontWeight: 'bold',
  border: `1px solid ${theme.palette.text.lighter}`,
}));

const CollapseCustom = styled(Collapse)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
}));

const ButtonCustom = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.white,
  width: '44%',
  marginBottom: theme.spacing(2),
  fontWeight: '700',
}));

const SelectCustom = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.white,
  borderRadius: '0.7rem',
}));

const TextFieldCustom = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.white,
  width: '45%',
  borderRadius: '10px',
}));

const PriceForm = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  margin: theme.spacing(1.5, 1.5, 0, 1.5),
  gap: theme.spacing(1.5),
}));

export default function PriceTabFilterBar({ collapseOpen }) {
  const [statusOpen, setStatusOpen] = useState(collapseOpen);

  const handleStatusClick = () => {
    setStatusOpen(!statusOpen);
  };

  const [price, setPrice] = useState('USD');

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  return (
    <>
      <FilterMenuItem onClick={handleStatusClick}>
        <ListItemIcon />
        <ListItemText primaryTypographyProps={{ fontWeight: '700' }} primary="Price" />
        {statusOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterMenuItem>
      <CollapseCustom in={statusOpen} timeout="auto" unmountOnExit>
        <PriceForm>
          <InputLabel id="select-price-currency">Price</InputLabel>
          <SelectCustom
            labelId="select-price-currency"
            id="select-price-currency-id"
            value={price}
            label="Price Currency"
            onChange={handlePriceChange}
          >
            <MenuItem value="USD">United States Dollar (USD)</MenuItem>
            <MenuItem value="NRG">Energi (NRG)</MenuItem>
          </SelectCustom>
          <PriceRangeDiv>
            <TextFieldCustom id="outlined-basic" label="Min" variant="outlined" size="small" />
            <p>to</p>
            <TextFieldCustom id="outlined-basic" label="Max" variant="outlined" size="small" />
          </PriceRangeDiv>
          <ButtonCustom variant="outlined" disabled>
            Apply
          </ButtonCustom>
        </PriceForm>
      </CollapseCustom>
    </>
  );
}

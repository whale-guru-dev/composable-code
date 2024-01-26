import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import {
  Collapse,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  List,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const StatusToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  flexWrap: 'wrap',
  margin: theme.spacing(2),
  '& .MuiToggleButton-root.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.white,
    '&:hover': {
      color: theme.palette.text.white,
      backgroundColor: theme.palette.primary.main,
    },
  },

  '& > .MuiToggleButton-root': {
    justifyContent: 'left',
    color: theme.palette.text.darker,
    fontSize: '15px',
    backgroundColor: theme.palette.background.white,
    width: '47%',
    height: '40px',
    '&:hover': {
      color: theme.palette.primary.main,
      boxShadow: '0px 4px 11px 0px #DDD',
    },
  },

  '.MuiToggleButtonGroup-grouped:not(:first-of-type), .MuiToggleButtonGroup-grouped:not(:last-of-type)':
    {
      margin: theme.spacing(0.5),
      borderRadius: '10px',
      border: `1px solid ${theme.palette.text.lighter}`,
      '& + .MuiToggleButton-root.Mui-selected': {
        margin: theme.spacing(0.5),
      },
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

export default function StatusTabFilterBar({ collapseOpen }) {
  const [statusOpen, setStatusOpen] = useState(collapseOpen);

  const handleStatusClick = () => {
    setStatusOpen(!statusOpen);
  };

  const [statusFilterList, setStatusFilterList] = useState(() => []);
  const handleStatusFilter = (event, newFormats) => {
    setStatusFilterList(newFormats);
    console.log(newFormats);
  };

  return (
    <>
      <FilterMenuItem onClick={handleStatusClick}>
        <ListItemIcon />
        <ListItemText primaryTypographyProps={{ fontWeight: '700' }} primary="Status" />
        {statusOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterMenuItem>
      <CollapseCustom in={statusOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <StatusToggleButtonGroup
            value={statusFilterList}
            onChange={handleStatusFilter}
            aria-label="status filter"
          >
            <ToggleButton value="BUY_NOW" aria-label="buy_now">
              Buy Now
            </ToggleButton>
            <ToggleButton value="ON_AUCTION" aria-label="on_auction">
              On Auction
            </ToggleButton>
            <ToggleButton value="NEW" aria-label="new">
              New
            </ToggleButton>
            <ToggleButton value="HAS_OFFERS" aria-label="has_offers">
              Has Offers
            </ToggleButton>
          </StatusToggleButtonGroup>
        </List>
      </CollapseCustom>
    </>
  );
}

import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  BlurOn as BlurOnIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import {
  Collapse,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  InputAdornment,
  Box,
  List,
} from '@mui/material';

const CollapseCustom = styled(Collapse)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
}));

const FilterMenuItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2, 2, 2, 0),
  marginLeft: theme.spacing(-5),
  fontWeight: 'bold',
  border: `1px solid ${theme.palette.text.lighter}`,
}));

const CollectionsFilterTextField = styled(TextField)(({ theme }) => ({
  width: '90%',
  margin: theme.spacing(2),
  backgroundColor: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    border: `1px solid ${theme.palette.border.lighter}`,
    borderRadius: '10px',
  },
}));

const ListItemCustom = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'unset',
    '& svg': {
      width: '28px',
      height: '28px',
    },
  },
}));

export default function CollectionsTabFilterBar({ collapseOpen }) {
  const collections = ['Crypto Punk', 'Energi Special', 'ABC Collection']; // dummy data - Fetch from database
  const [filteredCollections, setCollections] = useState(collections);

  const [statusOpen, setStatusOpen] = useState(collapseOpen);

  const handleStatusClick = () => {
    setStatusOpen(!statusOpen);
  };

  const FilterCollectionsList = (e) => {
    setCollections(
      collections.filter((collection) => {
        return collection.toLowerCase().indexOf(e?.target?.value?.toLowerCase()) >= 0;
      }),
    );
  };

  return (
    <>
      <FilterMenuItem onClick={handleStatusClick}>
        <ListItemIcon />
        <ListItemText primaryTypographyProps={{ fontWeight: '700' }} primary="Collections" />
        {statusOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterMenuItem>
      <CollapseCustom in={statusOpen} timeout="auto" unmountOnExit>
        <Box>
          <CollectionsFilterTextField
            placeholder="Filter"
            icon={SearchIcon}
            onChange={(e) => FilterCollectionsList(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <List>
            {filteredCollections.length > 0 ? (
              filteredCollections.map((collection) => {
                return (
                  <ListItemCustom key={collection} disableRipple={false}>
                    <ListItemIcon>
                      <BlurOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={collection}></ListItemText>
                  </ListItemCustom>
                );
              })
            ) : (
              <p>No Matching Collections</p>
            )}
          </List>
        </Box>
      </CollapseCustom>
    </>
  );
}

import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  BlurOn as BlurOnIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Collapse, List, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';

const CollapseCustom = styled(Collapse)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  padding: theme.spacing(1, 0),
}));

const FilterMenuItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2, 2, 2, 0),
  marginLeft: theme.spacing(-5),
  fontWeight: 'bold',
  border: `1px solid ${theme.palette.text.lighter}`,
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

export default function CategoriesTabFilterBar({ collapseOpen }) {
  const categories = ['Art', 'Music', 'Domain Names', 'Virtual Worlds', 'Trading Cards'];
  const [open, setOpen] = React.useState(collapseOpen);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <FilterMenuItem onClick={handleClickOpen}>
        <ListItemIcon />
        <ListItemText primaryTypographyProps={{ fontWeight: '700' }} primary="Categories" />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterMenuItem>
      <CollapseCustom in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {categories.map((category) => {
            return (
              <ListItemCustom key={category}>
                <ListItemIcon>
                  <BlurOnIcon />
                </ListItemIcon>
                <ListItemText primary={category}></ListItemText>
              </ListItemCustom>
            );
          })}
        </List>
      </CollapseCustom>
    </>
  );
}

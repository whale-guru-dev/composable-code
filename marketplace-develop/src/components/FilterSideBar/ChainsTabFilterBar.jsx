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

export default function ChainsTabFilterBar({ collapseOpen }) {
  const chains = ['Energi', 'Ethereum'];
  const [statusOpen, setStatusOpen] = React.useState(collapseOpen);

  const handleStatusClick = () => {
    setStatusOpen(!statusOpen);
  };

  return (
    <>
      <FilterMenuItem onClick={handleStatusClick}>
        <ListItemIcon />
        <ListItemText primaryTypographyProps={{ fontWeight: '700' }} primary="Chains" />
        {statusOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterMenuItem>
      <CollapseCustom in={statusOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {chains.map((chain) => {
            return (
              <ListItemCustom key={chain}>
                <ListItemIcon>
                  <BlurOnIcon />
                </ListItemIcon>
                <ListItemText primary={chain}></ListItemText>
              </ListItemCustom>
            );
          })}
        </List>
      </CollapseCustom>
    </>
  );
}

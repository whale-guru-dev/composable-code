import * as React from 'react';
import { styled } from '@mui/material/styles';
import StatusTabFilterBar from './StatusTabFilterBar';
import PriceTabFilterBar from './PriceTabFilterBar';
import CollectionsTabFilterBar from './CollectionsTabFilterBar';
import ChainsTabFilterBar from './ChainsTabFilterBar';
import CategoriesTabFilterBar from './CategoriesTabFilterBar';
import OnSaleTabFilterBar from './OnSaleTabFilterBar';
import { DRAWER_WIDTH } from '../../constants';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  Drawer as MuiDrawer,
  Button,
  List as MuiList,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  top: '72px',
  height: '90%',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'sticky',
  top: '0',
  zIndex: 2,
  border: `1px solid ${theme.palette.text.lighter}`,
  backgroundColor: theme.palette.background.white,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  zIndex: 1,
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const FilterMenuItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const List = styled(MuiList)(({ theme }) => ({
  paddingTop: theme.spacing(0),
}));

const FilterArrowItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 3, 2, 3),
}));

const MobileCloseButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-end',
  padding: theme.spacing(0, 3),
  fontSize: '18px',
}));

const MobileClearButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  padding: theme.spacing(0, 2),
  fontSize: '18px',
}));

const MobileFilterItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 0, 2, 0),
  fontWeight: 'bold',
  border: `1px solid ${theme.palette.text.lighter}`,
  backgroundColor: theme.palette.background.white,
  position: 'sticky',
  top: '0',
  zIndex: 1,
  justifyContent: 'space-between',
}));

const MobileFilterButton = styled(Button)(({ theme }) => ({
  width: '70%',
  height: '7%',
  borderRadius: '50px',
  position: 'fixed',
  bottom: '25px',
  left: '0',
  right: '0',
  marginLeft: 'auto',
  marginRight: 'auto',
  color: theme.palette.text.white,
  fontSize: '18px',
}));

export default function FilterSideBar() {
  const mobile = useMediaQuery('(max-width: 600px)');
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMobileDrawerOpen = () => {
    setMobileOpen(true);
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  const FilterTabsList = () => {
    return (
      <List>
        <StatusTabFilterBar collapseOpen={true} />
        <PriceTabFilterBar collapseOpen={true} />
        <CollectionsTabFilterBar collapseOpen={false} />
        <ChainsTabFilterBar collapseOpen={false} />
        <CategoriesTabFilterBar collapseOpen={false} />
        <OnSaleTabFilterBar collapseOpen={false} />
      </List>
    );
  };

  const WebFilterBar = () => {
    return (
      <Drawer variant="permanent" open={open}>
        {open && (
          <DrawerHeader>
            <FilterMenuItem onClick={handleDrawerClose}>
              <ListItemIcon>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: '700', marginLeft: '-1rem' }}
                primary="Filter"
              />
              <ArrowBackIcon />
            </FilterMenuItem>
          </DrawerHeader>
        )}
        {!open ? (
          <>
            <DrawerHeader />
            <List>
              <FilterArrowItem button onClick={open ? handleDrawerClose : handleDrawerOpen}>
                {!open && <ArrowForwardIcon />}
              </FilterArrowItem>
            </List>
          </>
        ) : (
          <FilterTabsList />
        )}
      </Drawer>
    );
  };

  const MobileFilterBar = () => {
    return (
      <>
        {!mobileOpen && (
          <MobileFilterButton variant="contained" primary="Filter" onClick={handleMobileDrawerOpen}>
            Filter
          </MobileFilterButton>
        )}
        <MuiDrawer
          sx={{
            width: '100%',
            '& .MuiDrawer-paper': {
              width: '100%',
              top: '72px',
              height: '90%',
            },
          }}
          anchor="left"
          open={mobileOpen}
        >
          <List>
            <MobileFilterItem>
              <MobileClearButton variant="text" onClick={(e) => console.log('Clear All')}>
                Clear All
              </MobileClearButton>
              <MobileCloseButton variant="text" onClick={handleMobileDrawerClose}>
                Done
              </MobileCloseButton>
            </MobileFilterItem>
            <FilterTabsList />
          </List>
        </MuiDrawer>
      </>
    );
  };

  return mobile ? <MobileFilterBar /> : <WebFilterBar />;
}

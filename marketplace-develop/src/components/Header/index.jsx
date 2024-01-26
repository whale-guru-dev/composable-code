import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Avatar, IconButton } from '@mui/material';
import { EnergiLogo } from '../StyledComponents';
import SideNavigation from './SideNavigation';
import { Link, useLocation } from 'react-router-dom';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Store as StoreIcon,
  Equalizer as EqualizerIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/styles';
import WalletSidebar from './WalletSidebar';
import { NAV_MENUS } from '../../constants';

/********************  Styled Components  ********************/
const Root = styled('div')({
  height: 72,
  position: 'sticky',
  top: 0,
  width: '100%',
  boxShadow: '0px 4px 11px 0px #DDD',
  zIndex: 1500,
  backgroundColor: 'white',
});

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(0, 1),
  alignItems: 'center',
  height: '100%',
  justifyContent: 'space-between',
  '& > div, & > a': {
    padding: theme.spacing(0, 1.6),
  },
  '@media(max-width: 750px)': {
    padding: theme.spacing(0, 0),
  },
}));

const SearchFieldContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.lighter}`,
  borderRadius: 5,
  flex: 1,
  width: 400,
  '& input': {
    padding: theme.spacing(1.5, 1.5),
    width: '100%',
  },
  '@media(max-width: 750px)': {
    width: 280,
  },
}));

const Menu = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

const MenuItem = styled(Link)(({ theme, active }) => ({
  height: 72,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 2),
  color: theme.palette.text.menu,
  textDecoration: 'none',
  borderBottom: active ? `3px solid ${theme.palette.primary.main}` : 'none',
}));

const SidePanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flex: 1,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.text.lighter}`,
  cursor: 'pointer',
}));

const AccountBalanceWalletIconButton = styled(AccountBalanceWalletIcon)(({ theme }) => ({
  color: theme.palette.text.light,
  fontSize: 34,
}));

const SideNavigationButton = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('lg')]: {
    display: 'block',
  },
}));

const MenuIconButton = styled(MenuIcon)(({ theme }) => ({
  fontSize: 35,
  color: theme.palette.text.darker,
}));

const CloseIconButton = styled(CloseIcon)(({ theme }) => ({
  fontSize: 35,
  color: theme.palette.text.darker,
}));

/********************  Main Component  ********************/
const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [walletSidebarOpen, setWalletSidebarOpen] = useState(false);
  const matchNavSideMenu = useMediaQuery('(max-width: 1200px)');
  const { pathname } = useLocation();
  const menus = [
    {
      id: 1,
      text: 'Marketplace',
      path: '/marketplace',
      icon: <StoreIcon />,
    },
    {
      id: 2,
      text: 'Stats',
      path: '/stats',
      icon: <EqualizerIcon />,
    },
    {
      id: 3,
      text: 'Resources',
      path: '/resources',
      icon: <DescriptionIcon />,
    },
    {
      id: 4,
      text: 'Create',
      path: '/create',
      notShowInSideNav: true,
    },
  ];

  const handleCloseSideModals = () => {
    setMobileNavOpen(!mobileNavOpen);
    setWalletSidebarOpen(false);
  };

  return (
    <>
      <SideNavigation
        setWalletSidebarOpen={setWalletSidebarOpen}
        open={matchNavSideMenu && mobileNavOpen}
        menus={NAV_MENUS}
        setMobileNavOpen={setMobileNavOpen}
      />
      <WalletSidebar open={walletSidebarOpen} />
      <Root>
        <Container>
          <EnergiLogo />
          <SearchFieldContainer>
            <SearchTextField
              placeholder="Search Market Place"
              icon={SearchIcon}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => console.log(e.target.value)}
            />
          </SearchFieldContainer>
          <Menu>
            {menus.map((menu) => (
              <MenuItem key={menu.id} to={menu.path} active={pathname === menu.path ? 'true' : ''}>
                <Typography fontWeight={600} fontSize={16}>
                  {menu.text}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
          <SidePanel>
            <UserAvatar
              sx={{
                width: 38,
                height: 38,
              }}
              alt="Avatar"
              src="https://i.pravatar.cc/300"
              onClick={() => console.log('Avatar clicked!')}
            />
            <IconButton onClick={() => setWalletSidebarOpen(!walletSidebarOpen)}>
              <AccountBalanceWalletIconButton fontSize="34px" />
            </IconButton>
          </SidePanel>
          <SideNavigationButton>
            <IconButton onClick={handleCloseSideModals}>
              {!mobileNavOpen && !walletSidebarOpen ? (
                <MenuIconButton fontSize="16px" />
              ) : (
                <CloseIconButton fontSize="16px" />
              )}
            </IconButton>
          </SideNavigationButton>
        </Container>
      </Root>
    </>
  );
};

export default Header;

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Button, TextField, InputAdornment, Typography, Drawer, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Instagram as InstagramIcon,
  Search as SearchIcon,
  Telegram as TelegramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { ReactComponent as DiscordIcon } from '../../assets/images/discord.svg';
import { styled } from '@mui/system';
import { LINKS_LIST } from '../../constants';

/********************  Styled Components  ********************/
const SearchTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: 'white',
  width: '100%',
  '& input': {
    padding: theme.spacing(4, 1),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
    borderRadius: 0,
    borderBottom: `1px solid ${theme.palette.border.lighter}`,
  },
  '& svg': {
    marginLeft: theme.spacing(2),
  },
}));

const NavigationBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3),
  flex: 1,
  backgroundColor: theme.palette.background.main,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  paddingBottom: theme.spacing(2),
}));

const MenuItemLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: theme.palette.text.menu,
  textDecoration: 'none',
  padding: theme.spacing(3, 0),
  '& > svg': {
    fontSize: 28,
    marginRight: 10,
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  height: 75,
  display: 'flex',
  backgroundColor: 'white',
  marginBottom: 72,
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.border.lighter}`,
  justifyContent: 'space-around',
  padding: theme.spacing(0, 3),
  '& a': {
    color: theme.palette.text.darker,
    transition: '0.1s',
    '&:hover': {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
}));

const MenuItemArrowIcon = styled('div')(({ theme }) => ({
  flex: 1,
  justifyContent: 'flex-end',
  display: 'flex',
}));

/********************  Main Component  ********************/
const SideNavigation = ({ menus, open, setWalletSidebarOpen, setMobileNavOpen }) => {
  const fullWidthNav = useMediaQuery('(max-width: 600px)');
  const theme = useTheme();
  const NavigationWidth = fullWidthNav ? '100%' : 400;

  const socialMedias = [
    {
      ...LINKS_LIST['twitter'],
      icon: <TwitterIcon />,
    },
    {
      ...LINKS_LIST['telegram'],
      icon: <TelegramIcon />,
    },
    {
      ...LINKS_LIST['instagram'],
      icon: <InstagramIcon />,
    },
    {
      ...LINKS_LIST['youtube'],
      icon: <YouTubeIcon />,
    },
    {
      ...LINKS_LIST['discord'],
      icon: <DiscordIcon style={{ width: 20 }} />,
    },
  ];

  const handleOpenWalletSidebar = () => {
    setWalletSidebarOpen(true);
    setMobileNavOpen(false);
  };

  return (
    <div>
      <Drawer
        sx={{
          width: NavigationWidth,
          '& .MuiDrawer-paper': {
            width: NavigationWidth,
            paddingTop: '72px',
            zIndex: 1300,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {fullWidthNav && (
          <Box>
            <SearchTextField
              placeholder="Search items, collections, and accounts"
              icon={SearchIcon}
              onChange={(e) => console.log(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
        <NavigationBody>
          <Box>
            {menus.map(
              (menu) =>
                !menu?.notShowInSideNav && (
                  <MenuItemLink to={menu.path} key={menu.id}>
                    {menu?.icon}
                    <Typography fontSize={16} fontWeight={500}>
                      {menu.text}
                    </Typography>
                    <MenuItemArrowIcon>
                      <ChevronRightIcon />
                    </MenuItemArrowIcon>
                  </MenuItemLink>
                ),
            )}
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{
                padding: theme.spacing(1.5, 2.5),
                fontWeight: 600,
                marginTop: theme.spacing(1.6),
                width: fullWidthNav ? '100%' : 'auto',
              }}
              color="secondary"
              onClick={handleOpenWalletSidebar}
            >
              Connect Wallet
            </Button>
          </Box>
        </NavigationBody>
        <Footer>
          {socialMedias.map((media) => (
            <a key={media.name} rel="noopener noreferrer" target="_blank" href={media.link}>
              {media.icon}
            </a>
          ))}
        </Footer>
      </Drawer>
    </div>
  );
};

export default SideNavigation;

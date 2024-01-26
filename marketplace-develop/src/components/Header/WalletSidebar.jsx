import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Drawer,
  Box,
  Tooltip,
  tooltipClasses,
  Menu,
  MenuItem,
  ListItemIcon,
  useMediaQuery,
} from '@mui/material';
import {
  InfoOutlined as InfoOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Logout as LogoutIcon,
  Autorenew as AutorenewIcon,
} from '@mui/icons-material';
import { ReactComponent as MetamaskIcon } from '../../assets/images/metamask.svg';
import { styled } from '@mui/system';
import { useMetamask } from '@energi/energi-wallet';
import { copyToClipboard, shorten } from '../../utils/helper';

/********************  Styled Components  ********************/
const Heading = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.text.lighter}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2.5, 3),
  '& svg': {
    fontSize: 32,
    color: theme.palette.text.light,
  },
}));

const Body = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
}));

const Profile = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  '& svg:last-child': {
    fontSize: 25,
  },
}));

const InfoTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.dark,
    color: 'white',
    maxWidth: 305,
    padding: '1rem',
    marginRight: '2.5rem',
    borderRadius: 10,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.dark,
  },
}));

const InfoLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontWeight: 600,
  color: theme.palette.primary.main,
  display: 'inline-flex',
  '& svg': {
    marginLeft: 3,
    width: 20,
    color: theme.palette.primary.main,
  },
  '&:hover, &:hover svg': {
    color: theme.palette.primary.lighter,
  },
}));

const Wallets = styled(Box)(({ theme }) => ({
  borderRadius: 10,
  border: `1px solid ${theme.palette.border.lighter}`,
  marginTop: '1rem',
  overflow: 'hidden',
}));

const WalletItem = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  borderBottom: `1px solid ${theme.palette.border.lighter}`,
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  transition: '0.2s',
  '&:last-child': {
    borderBottom: 'none',
  },
  '& svg': {
    marginRight: '1rem',
    width: 28,
  },
  '&:hover': {
    backgroundColor: theme.palette.background.main,
  },
}));

const ShowMoreButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  width: '100%',
  fontSize: 16,
  fontWeight: 600,
  color: theme.palette.text.light,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  padding: '0.8rem',
  transition: '0.2s',
}));

const CopyTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.dark,
    color: 'white',
    padding: '0.9em 1.4em',
    fontSize: 15,
    borderRadius: 6,
    fontWeight: 600,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.dark,
  },
}));

const Address = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.medium,
}));

const MyWalletButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.darker,
  minWidth: 'auto',
  fontSize: 16,
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const ProfileMenu = styled(Menu)(() => ({
  '& .MuiPaper-root, & .MuiList-root': {
    padding: 0,
  },
}));

const ProfileMenuItem = styled(MenuItem)(({ theme }) => ({
  width: 220,
  padding: theme.spacing(2),
  borderBottom: '1px solid #DDD',
}));

const BalanceBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.border.lighter}`,
  borderBottom: 'none',
  borderRadius: 10,
  overflow: 'hidden',
}));

const AddFundButton = styled(Button)(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 0,
  borderTopLeftRadius: 0,
  color: theme.palette.text.white,
  fontSize: 16,
  fontWeight: 600,
  padding: theme.spacing(1.2),
  marginTop: theme.spacing(2),
  borderBottom: 'none',
  boxShadow: 'none',
}));

/********************  Main Component  ********************/
const WalletSidebar = ({ open }) => {
  const theme = useTheme();
  const matchMobileFullWidth = useMediaQuery('(max-width: 600px)');
  const NavigationWidth = matchMobileFullWidth ? '100%' : 420;
  const [walletsExpanded, setWalletsExpanded] = useState(false);
  const { connected, address, connect, disconnect } = useMetamask();

  const [copied, setCopied] = useState(null);
  const [copyTimeout, setCopyTimeout] = useState(null);

  const copy = async (address, type) => {
    await copyToClipboard(address);
    setCopied(type);
    if (copyTimeout) {
      clearTimeout(copyTimeout);
      setCopyTimeout(null);
    }
    const timeout = setTimeout(() => {
      setCopied(null);
      setCopyTimeout(null);
    }, 1000);
    setCopyTimeout(timeout);
  };

  const SUPPORTED_WALLETS = [
    {
      name: 'Metamask',
      icon: <MetamaskIcon />,
      sideText: 'Popular',
      onClick: () => {
        connect();
      },
    },
    {
      name: 'WalletConnect',
      icon: <MetamaskIcon />,
    },
    {
      name: 'Coinbase Wallet',
      icon: <MetamaskIcon />,
      sideText: 'Desktop only',
    },
    {
      name: 'Formatic',
      icon: <MetamaskIcon />,
    }, // more copies for testing
    {
      name: 'Metamask',
      icon: <MetamaskIcon />,
    },
    {
      name: 'WalletConnect',
      icon: <MetamaskIcon />,
    },
    {
      name: 'Coinbase Wallet',
      icon: <MetamaskIcon />,
      sideText: 'Random text',
    },
    {
      name: 'Formatic',
      icon: <MetamaskIcon />,
    },
  ];

  const [anchorElement, setAnchorElement] = useState(null);
  const menuOpen = Boolean(anchorElement);
  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  const displayedWallet = walletsExpanded ? SUPPORTED_WALLETS : SUPPORTED_WALLETS.slice(0, 4);

  const renderAccountMenu = () => {
    return (
      <ProfileMenu id="basic-menu" anchorEl={anchorElement} open={menuOpen} onClose={handleClose}>
        <ProfileMenuItem onClick={() => disconnect()}>
          <ListItemIcon>
            <LogoutIcon fontSize="medium" />
          </ListItemIcon>
          <Typography color={theme.palette.text.darker} fontWeight={500} fontSize={15}>
            Logout
          </Typography>
        </ProfileMenuItem>
        <ProfileMenuItem onClick={handleClose}>
          <ListItemIcon>
            <AutorenewIcon fontSize="medium" />
          </ListItemIcon>
          <Typography color={theme.palette.text.darker} fontWeight={500} fontSize={15}>
            Refresh funds
          </Typography>
        </ProfileMenuItem>
      </ProfileMenu>
    );
  };

  return (
    <div>
      <Drawer
        sx={{
          width: NavigationWidth,
          '& .MuiDrawer-paper': {
            width: NavigationWidth,
            paddingTop: '72px',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Heading>
          <Profile>
            <AccountCircleIcon />
            <MyWalletButton endIcon={connected && <KeyboardArrowDownIcon />} onClick={handleClick}>
              My Wallet
            </MyWalletButton>
          </Profile>
          {connected && (
            <CopyTooltip
              onClick={() => copy(address, 'address')}
              title={copied === 'address' ? 'Copied!' : 'Copy'}
              placement="top"
              arrow
            >
              <Address>{shorten(address, 5)}</Address>
            </CopyTooltip>
          )}
        </Heading>
        <Body>
          {connected ? (
            <>
              {renderAccountMenu()}
              <BalanceBox>
                <Typography fontSize={14} fontWeight={500} color={theme.palette.text.light}>
                  Total Balanace
                </Typography>
                <Typography fontSize={20} fontWeight={600}>
                  $0.00 USD
                </Typography>
                <AddFundButton variant="contained">Add Funds</AddFundButton>
              </BalanceBox>
            </>
          ) : (
            <>
              <Typography
                fontSize={16}
                fontWeight={400}
                textAlign="justify"
                color={theme.palette.text.medium}
              >
                Connect with one of our available {` `}
                <InfoTooltip
                  arrow
                  title={
                    <React.Fragment>
                      <Typography
                        fontSize={15}
                        fontWeight={600}
                        textAlign="center"
                        lineHeight={1.3}
                      >
                        A crypto wallet is an application or hardware device that allows individuals
                        to store and retrieve digital items.{` `}
                        <InfoLink to={'/'}>Learn more</InfoLink>
                      </Typography>
                    </React.Fragment>
                  }
                >
                  <InfoLink to={'/'}>
                    wallet <InfoOutlinedIcon></InfoOutlinedIcon>
                  </InfoLink>
                </InfoTooltip>
                {` `}
                providers or create a new one.
              </Typography>
              <Wallets>
                {displayedWallet.map((wallet, index) => (
                  <WalletItem key={index} onClick={wallet.onClick}>
                    <Typography
                      color={theme.palette.text.darker}
                      fontSize={14}
                      display="flex"
                      alignItems="center"
                      fontWeight={700}
                    >
                      {wallet.icon}
                      {wallet.name}
                    </Typography>
                    {wallet?.sideText && (
                      <Typography fontWeight={500} fontSize={12} color={theme.palette.text.medium}>
                        {wallet?.sideText}
                      </Typography>
                    )}
                  </WalletItem>
                ))}
                <ShowMoreButton disableRipple onClick={() => setWalletsExpanded(!walletsExpanded)}>
                  {walletsExpanded ? `Show less options` : `Show more options`}
                </ShowMoreButton>
              </Wallets>
            </>
          )}
        </Body>
      </Drawer>
    </div>
  );
};

export default WalletSidebar;

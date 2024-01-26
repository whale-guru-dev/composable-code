import { Typography } from '@mui/material';
import energiLogo from '../../assets/images/energiLogo.png';
import { styled } from '@mui/styles';
import { Link } from 'react-router-dom';
import { ReactComponent as NRGLogo } from '../../assets/images/NRGLogo.svg';

const LogoLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.text.darker,
  '& img': {
    height: 34,
    marginRight: 6,
  },
  '& h1': {
    whiteSpace: 'nowrap',
    fontWeight: 400,
    fontSize: '26px',
    '& strong': {
      fontWeight: 600,
    },
  },
}));

export const EnergiLogo = () => {
  return (
    <LogoLink to="/">
      <img src={energiLogo} alt="Energi" />
      <Typography variant="h1">
        ENERGI <strong>NFT</strong>
      </Typography>
    </LogoLink>
  );
};

export const Divider = styled('div')(() => ({
  height: '1px',
  width: '100%',
  backgroundColor: 'rgba(30, 68, 94, 1)',
}));

const PriceText = styled('p')(({ theme, size }) => ({
  fontFamily: 'Poppins-bold',
  fontSize: size,
  color: theme.palette.text.black,
  margin: '0px',
}));

const PriceDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '5px',
}));

export const Price = ({ price = 0, currency = 'NRG', size = '14px', logoSize = 20 }) => {
  return (
    <PriceDiv>
      {currency === 'NRG' ? <NRGLogo width={logoSize} height={logoSize} /> : ''}
      <PriceText size={size}>{price}</PriceText>
    </PriceDiv>
  );
};

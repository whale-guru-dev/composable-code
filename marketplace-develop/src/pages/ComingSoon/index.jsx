import { styled } from '@mui/styles';
import React from 'react';
import energiLogo from '../../assets/images/energiLogo.png';
import Footer from '../../components/Footer';

/********************  Styled Components  ********************/
const LayoutContainer = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'auto',
}));

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '95vh',
  backgroundColor: theme.palette.background.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > img': {
    width: 100,
  },
}));

const Heading = styled('h1')(({ theme }) => ({
  padding: theme.spacing(0, 5),
  fontSize: 58,
  fontWeight: 500,
  color: theme.palette.text.darker,
  '@media (max-width: 600px)': {
    fontSize: 36,
  },
}));

/********************  Main Component  ********************/
const ComingSoon = () => {
  return (
    <LayoutContainer>
      <Container>
        <Content>
          <Heading>Coming Soon</Heading>
          <img src={energiLogo} alt="Energi" />
        </Content>
      </Container>
      <Footer />
    </LayoutContainer>
  );
};

export default ComingSoon;

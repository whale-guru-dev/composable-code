import React from 'react';
import { styled } from '@mui/styles';
import { Price } from '../../components/StyledComponents';
import { Favorite } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { ReactComponent as Approved } from '../../assets/images/approved.svg';

const Card = styled('div')(({ large }) => ({
  display: 'flex',
  width: large ? '317px' : '204px',
  height: large ? '445px' : '347px',
  flexDirection: 'column',
  border: '1px solid rgba(229, 232, 235, 1)',
  borderRadius: '6px',
  transition: 'top ease 0.6s',

  '& .MuiButton-root': {
    visibility: 'hidden',
  },

  '&:hover': {
    cursor: 'pointer',
    marginTop: '-3px',
    boxShadow: 'rgba(100, 100, 111, 0.3) 0px 5px 10px 0px',

    '& .MuiButton-root': {
      visibility: 'visible',
    },
  },
}));

const CardImage = styled('img')(({ large }) => ({
  width: large ? '317px' : '204px',
  height: large ? '314px' : '204px',
  borderRadius: '6px 6px 0px 0px',
}));

const CardContent = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '12px',
  gap: '6px',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
}));

const Heading = styled('p')(() => ({
  fontFamily: 'Poppins',
  fontSize: '11px',
  fontWeight: 600,
  color: '#707A83',
  opacity: 0.85,
  margin: '0px',
}));

const ContentHeading = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const LastPrice = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '5px',
  justifyContent: 'end',
}));

const CardTitle = styled('p')(() => ({
  fontFamily: 'Poppins-bold',
  fontSize: '12px',
  color: 'black',
  margin: '0px',
}));

const Footer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginLeft: '0.25rem',
}));

const FavoriteDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: 'auto 12px auto 0px',
  gap: '8px',
}));

const FavoriteIcon = styled(Favorite)(() => ({
  width: '20px',
  height: '20px',
  color: 'white',
  stroke: 'rgba(112, 122, 131, 0.85)',
  strokeWidth: '2',

  '& :hover': {
    stroke: 'red',
  },
}));

const ApprovedIcon = styled(Approved)(() => ({
  width: '14px',
  height: '14px',
  marginLeft: '5px',
  verticalAlign: 'sub',
}));

const ArtCard = ({ card, size = 'LARGE' }) => {
  const large = size === 'LARGE' ? 1 : 0;
  return (
    <Card large={large} onClick={() => console.log('Art Card Clicked!')}>
      <CardImage large={large} src={card.image} alt="" loading="lazy" />
      <CardContent>
        <ContentHeading>
          <Heading>
            {card.collection}
            {card.approved && <ApprovedIcon />}
          </Heading>
          <Heading>Price</Heading>
        </ContentHeading>

        <ContentHeading>
          <CardTitle>Window To The Future</CardTitle>
          <Price price={card.price} currency={'NRG'} size={'14px'}></Price>
        </ContentHeading>

        <LastPrice>
          <Heading>Last</Heading>
          <Price price={card.lastPrice} currency={'NRG'} size={'11px'} logoSize={14}></Price>
        </LastPrice>
      </CardContent>
      <Footer>
        <Button
          variant="text"
          sx={{
            zIndex: 100,
            ':hover': { fontWeight: '600' },
          }}
          onClick={() => console.log('Buy Now clicked!')}
        >
          Buy Now
        </Button>
        <FavoriteDiv>
          <FavoriteIcon />
          <Heading>{card.favorites}</Heading>
        </FavoriteDiv>
      </Footer>
    </Card>
  );
};

export default ArtCard;

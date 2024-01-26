import React from 'react';
import { Helmet } from 'react-helmet-async';
import FilterSideBar from '../../components/FilterSideBar/index';
import CardsContainer from '../../components/CardsContainer';
import { Stack } from '@mui/material';

const MarketPlace = () => {
  const cards = [
    {
      collection: 'Davinci2',
      title: 'Window To The Future',
      price: 1876,
      lastPrice: 0.29,
      currency: 'NRG',
      favorites: 201,
      approved: true,
      image: '/static/images/cards/cardImage.jpg',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Energi Marketplace</title>
      </Helmet>
      <Stack direction="row">
        <FilterSideBar />
        <CardsContainer cards={cards} />
      </Stack>
    </>
  );
};

export default MarketPlace;

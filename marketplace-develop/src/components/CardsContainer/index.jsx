import { Stack } from '@mui/material';
import React, { useState } from 'react';
import ArtCard from '../ArtCard';
import { styled } from '@mui/styles';
import { SORT_OPTIONS, ITEMS_OPTIONS } from '../../constants';
import {
  ToggleButton,
  ToggleButtonGroup,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import {
  Apps as SmallGridIcon,
  GridViewSharp as LargeGridIcon,
  Stop as SingleGridIcon,
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

const HeadContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '1.5rem 0.1rem 1rem 0',
  justifyContent: 'end',
  gap: '10px',
  marginBottom: '0.3rem',
  height: '40px',

  '@media(max-width: 1200px)': {
    justifyContent: 'center',
  },

  '@media(max-width: 960px)': {
    flexDirection: 'column',
    alignItems: 'center',
    height: '100px',
  },
}));

const SortContainer = styled(FormControl)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',

  '@media(max-width: 960px)': {
    width: '100%',
  },
}));

const ItemsContainer = styled(FormControl)(() => ({
  '@media(max-width: 960px)': {
    width: '100%',
  },
}));

const ResultText = styled('p')(() => ({
  fontFamily: 'Poppins',
  fontSize: '15px',
  fontWeight: 500,
  color: 'rgb(53, 56, 64)',
  marginRight: 'auto',
  marginTop: 'auto',
}));

const GridLayout = styled('div')(({ layout }) => ({
  display: 'grid',
  justifyContent: 'space-between',
  gridTemplateColumns: layout === 'LARGE' ? 'repeat(auto-fill, 312px)' : 'repeat(auto-fill, 202px)',
  gridGap: '14px',
  flexWrap: 'wrap',
  marginBottom: '0.3rem',

  '& .MenuItem :last-child': {
    marginRight: 'auto',
  },

  '@media(max-width: 1440px)': {
    justifyContent: 'space-evenly',
  },
}));

const SelectCustom = styled(Select)(({ small = true }) => ({
  height: '48px',
  width: '225px',
  borderRadius: '10px',
  fontWeight: 500,

  '@media(max-width: 960px)': {
    width: small ? 'calc(100% - 50px)' : '100%',
  },
}));

const ToggleButtonCustom = styled(ToggleButton)(() => ({
  width: '50px',
  height: '48px',
  borderRadius: '7px',

  '&.Mui-selected': {
    color: 'rgba(0, 171, 88, 1)',
  },
}));

const DisplayToggle = ({ layout, handleLayoutChange, below1060 }) => {
  return (
    <ToggleButtonGroup value={layout} exclusive onChange={handleLayoutChange} aria-label="layout">
      <ToggleButtonCustom value="LARGE" aria-label="Large layout">
        {below1060 ? <SingleGridIcon /> : <LargeGridIcon />}
      </ToggleButtonCustom>
      <ToggleButtonCustom value="SMALL" aria-label="Small layout">
        {below1060 ? <LargeGridIcon /> : <SmallGridIcon />}
      </ToggleButtonCustom>
    </ToggleButtonGroup>
  );
};

const CardsContainer = ({ cards }) => {
  const numberOfCards = new Array(20).fill(0); //dummy for number of cards
  const [bundled, setBundled] = useState('ALL_ITEMS');
  const handleChange = (event) => {
    setBundled(event.target.value);
  };

  const [sort, setSort] = useState('');
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const [layout, setLayout] = useState('LARGE');
  const handleLayoutChange = (event, newValue) => {
    setLayout(newValue);
  };

  const below1200 = useMediaQuery('(max-width: 1200px)');
  const below960 = useMediaQuery('(max-width: 960px)');
  const below1060 = useMediaQuery('(max-width: 1060px)');

  return (
    <Stack sx={{ width: '100%', padding: '0 28px' }}>
      <HeadContainer>
        {!below1200 && <ResultText>{numberOfCards.length} results</ResultText>}
        <SortContainer>
          <InputLabel id="bundleInput">Items</InputLabel>
          <SelectCustom
            labelId="bundleInput"
            small={1}
            value={bundled}
            label="items"
            onChange={handleChange}
          >
            {ITEMS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </SelectCustom>
          {below960 && (
            <DisplayToggle
              layout={layout}
              handleLayoutChange={handleLayoutChange}
              below1060={below1060}
            />
          )}
        </SortContainer>

        <ItemsContainer>
          <InputLabel id="sortInput">Sort By</InputLabel>
          <SelectCustom
            labelId="sortInput"
            small={0}
            value={sort}
            label="items"
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </SelectCustom>
        </ItemsContainer>
        {!below960 && (
          <DisplayToggle
            layout={layout}
            handleLayoutChange={handleLayoutChange}
            below1060={below1060}
          />
        )}
      </HeadContainer>

      <GridLayout layout={layout}>
        {numberOfCards.map((value, index) => (
          <ArtCard size={layout} key={index} card={cards[0]} />
        ))}
      </GridLayout>
    </Stack>
  );
};

export default CardsContainer;

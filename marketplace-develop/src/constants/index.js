import {
  Store as StoreIcon,
  Equalizer as EqualizerIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

// Width for Filter side bar drawer
export const DRAWER_WIDTH = '340px';

// All links within marketplace and outside - handle testnet/mainnet in env?
export const LINKS_LIST = {
  allNFTs: {
    name: 'All NFTs',
    link: '',
  },
  new: {
    name: 'New',
    link: '',
  },
  art: {
    name: 'Art',
    link: '',
  },
  domainNames: {
    name: 'Domain Names',
    link: '',
  },
  virtualWorlds: {
    name: 'Virtual Worlds',
    link: '',
  },
  tradingCards: {
    name: 'Trading Cards',
    link: '',
  },
  collectibles: {
    name: 'Collectibles',
    link: '',
  },
  sports: {
    name: 'Sports',
    link: '',
  },
  utility: {
    name: 'Utility',
    link: '',
  },
  profile: {
    name: 'Profile',
    link: '',
  },
  favorites: {
    name: 'Favorites',
    link: '',
  },
  myCollectibles: {
    name: 'My Collectibles',
    link: '',
  },
  settings: {
    name: 'Settings',
    link: '',
  },
  rankings: {
    name: 'Rankings',
    link: '',
  },
  activity: {
    name: 'Activity',
    link: '',
  },
  docs: {
    name: 'Docs',
    link: '',
  },
  blog: {
    name: 'Blog',
    link: '',
  },
  partners: {
    name: 'Partners',
    link: '',
  },
  website: {
    name: 'Website',
    type: 'resources',
    link: '',
  },
  documentation: {
    name: 'Documentation',
    link: '',
  },
  github: {
    name: 'Github',
    link: 'https://github.com/energicryptocurrency',
  },
  joinOurTeam: {
    name: 'Join Our Team',
    link: 'https://www.energi.world/join-our-team/',
  },
  contactUs: {
    name: 'Contact Us',
    link: 'https://www.energi.world/contact-us/',
  },
  twitter: {
    name: 'Twitter',
    link: 'https://twitter.com/energi',
  },
  discord: {
    name: 'Discord',
    link: 'https://discord.com/invite/sCtgNC3/',
  },
  telegram: {
    name: 'Telegram',
    link: 'https://t.me/energicrypto',
  },
  reddit: {
    name: 'Reddit',
    link: 'https://www.reddit.com/r/energicryptocurrency/',
  },
  youtube: {
    name: 'Youtube',
    link: 'https://www.youtube.com/c/Energicrypto',
  },
  facebook: {
    name: 'Facebook',
    link: 'https://www.facebook.com/energicrypto/',
  },
  instagram: {
    name: 'Instagram',
    link: 'https://www.instagram.com/energicrypto',
  },
  linkedin: {
    name: 'Linkedin',
    link: 'https://www.linkedin.com/company/energi-core/',
  },
};

export const NAV_MENUS = [
  {
    id: 1,
    text: 'Marketplace',
    path: '/marketplace',
    active: true,
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

// marketplace - options to sort listed cards
export const SORT_OPTIONS = [
  { name: 'Recently Listed', value: 'RECENTLY_LISTED' },
  { name: 'Recently Created', value: 'RECENTLY_CREATED' },
  { name: 'Recently Sold', value: 'RECENTLY_SOLD' },
  { name: 'Recently Received', value: 'RECENTLY_RECEIVED' },
  { name: 'Ending Soon', value: 'ENGING_SOOM' },
  { name: 'Price: Low to High', value: 'PRICE_LOW_TO_HIGH' },
  { name: 'Price: High to Low', value: 'PRICE_HIGH_TO_LOW' },
  { name: 'Highest Last Sale', value: 'HIGHEST_LAST_SALE' },
  { name: 'Oldest', value: 'OLDEST' },
];

// marketplace - options to display type of cards
export const ITEMS_OPTIONS = [
  { name: 'All Items', value: 'ALL_ITEMS' },
  { name: 'Single Item', value: 'SINGLE_ITEM' },
  { name: 'Bundles', value: 'BUNDLES' },
];

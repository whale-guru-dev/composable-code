import ComingSoon from './ComingSoon';
import MarketPlace from './MarketPlace';

const routes = [
  {
    path: '/',
    component: ComingSoon,
    exact:  true
  },
  {
    path: '/marketplace',
    component: MarketPlace
  }
];

export default routes;

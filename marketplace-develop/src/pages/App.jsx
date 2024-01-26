import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './routes';
import theme from './../styles/theme';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../components/Header';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Header />
          <div className="root">
            <Switch>
              {routes.map((item, index) => (
                <Route key={index} {...item} />
              ))}
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

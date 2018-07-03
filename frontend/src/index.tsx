import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
// import { orange, red, grey } from '@material-ui/core/colors';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// const custom = {
//   50: '#e8f5e9',
//   100: '#c8e6c9',
//   200: '#a5d6a7',
//   300: '#81c784',
//   400: '#66bb6a',
//   500: '#4caf50',
//   600: '#43a047',
//   700: '#388e3c',
//   800: '#2e7d32',
//   900: '#1b5e20',
//   A100: '#b9f6ca',
//   A200: '#69f0ae',
//   A400: '#00e676',
//   A700: '#00c853'
// }

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#0066ff',
      main: '#D4D4D4',
      contrastText: '#ffcc00',
    },
    secondary: {
      light: '#FFFFFF',
      main: '#F2F3F3',
      dark: '#00FF00',
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();

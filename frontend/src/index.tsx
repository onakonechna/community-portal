import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

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

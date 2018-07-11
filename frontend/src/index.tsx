import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import createTypography from '@material-ui/core/styles/createTypography';
import createPalette from '@material-ui/core/styles/createPalette';
import { Palette } from '@material-ui/core/styles/createPalette';
import { FontStyle } from "@material-ui/core/styles/createTypography";

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const palette: Palette = createPalette({
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
  });

const fontStyle: FontStyle = {
  fontFamily: 'system-ui',
  fontSize: 12,
  fontWeightLight: 300,
  fontWeightRegular: "normal",
  fontWeightMedium: "bold"
};
const theme = createMuiTheme({
  typography: createTypography(createPalette({}), fontStyle),
  palette: palette
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

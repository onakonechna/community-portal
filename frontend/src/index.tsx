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

const palette: Palette = createPalette({
    primary: {
      light: '#48BF61',
      dark: '#A9A9A9',
      main: '#8BC34A',
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


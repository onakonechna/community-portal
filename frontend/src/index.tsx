import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createPalette, { Palette } from '@material-ui/core/styles/createPalette';
import createTypography, { FontStyle } from '@material-ui/core/styles/createTypography';

import App from './App';

const palette: Palette = createPalette({
  primary: {
    light: '#48BF61',
    dark: '#D4D4D4',
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
  fontWeightRegular: 'normal',
  fontWeightMedium: 'bold',
};
const theme = createMuiTheme({
  palette,
  typography: createTypography(createPalette({}), fontStyle),
    overrides: {
      MuiModal:{
          root: {
              zIndex: 999,
          }
      }
    }
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

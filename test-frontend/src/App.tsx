import * as React from 'react';
import './App.css';
import Crowdsourcing from './components/crowdsourcing';
import ProjectsGrid from './components/projectGrid';

import { green } from '@material-ui/core/colors';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const custom = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
  A100: '#b9f6ca',
  A200: '#69f0ae',
  A400: '#00e676',
  A700: '#00c853'
}

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      root: {
        align: "center"
      }
    }
  },
  palette: {
    primary: custom,
    secondary: green,
  },
});

class App extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
          <Crowdsourcing />
          <ProjectsGrid />
      </MuiThemeProvider>
    );
  }
}

export default App;

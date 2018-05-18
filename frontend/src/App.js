import React from 'react';
import Crowdsourcing from './Crowdsourcing'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';
//import Chart from './Chart'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

var custtom = {
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
};

const theme = createMuiTheme({
  
  palette: {
    primary: custtom,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
  <Router>
    <div>
      {/* <ul>
        <li><Link to="">Home</Link></li>
        <li><Link to="crowdsourcing">Crowdsourcing</Link></li>
        <li><Link to="chart">Chart</Link></li>
      </ul>

      <hr/> */}

      <Route exact path="" component={Crowdsourcing}/>
    </div>
  </Router>
  </MuiThemeProvider>
)
export default App
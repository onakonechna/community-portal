import * as React from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import Crowdsourcing from './components/crowdsourcing';
import ProjectsGrid from './components/projectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Crowdsourcing />
        <Route path='/projects' component={ProjectsGrid}/>
      </div>
    );
  }
}

export default App;

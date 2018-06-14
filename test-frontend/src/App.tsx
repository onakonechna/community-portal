import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import Crowdsourcing from './components/crowdsourcing';
import ProjectsGrid from './components/projectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Crowdsourcing />
        <Switch>
          <Route path='/projects' component={ProjectsGrid}/>
        </Switch>
      </div>
    );
  }
}

export default App;

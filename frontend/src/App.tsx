import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/Auth';
import HeadBar from './components/HeadBar';
import WithProjectGrid from './components/WithProjectGrid';

import { loadProjects } from './actions';

class App extends React.Component {
  public render() {
    return (
      <div>
        <HeadBar />
        <Route exact path="/" component={WithProjectGrid(loadProjects)} />
        <Route exact path="/auth" component={Auth}/>
        <Route exact path="/bookmarked" component={WithProjectGrid(loadProjects)} />
      </div>
    );
  }
}

export default App;

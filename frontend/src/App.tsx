import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/Auth';
import HeadBar from './components/HeadBar';
import Profile from './components/Profile';
import ProjectGrid from './components/ProjectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Route path="/" component={HeadBar}/>
        <Route exact path="/" component={ProjectGrid}/>
        <Route exact path="/auth" component={Auth}/>
        <Route exact path="/profile" component={Profile}/>
      </div>
    );
  }
}

export default App;

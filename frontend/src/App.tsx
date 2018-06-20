import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/auth';
import HeadBar from './components/headBar';
import ProjectsGrid from './components/projectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <HeadBar />
        <Route exact path="/projects" component={ProjectsGrid}/>
        <Route exact path="/auth" component={Auth}/>
      </div>
    );
  }
}

export default App;

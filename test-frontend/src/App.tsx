import * as React from 'react';
import { Route } from 'react-router-dom';

import HeadBar from './components/headBar';
import ProjectsGrid from './components/projectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <HeadBar />
        <Route path='/projects' component={ProjectsGrid}/>
      </div>
    );
  }
}

export default App;

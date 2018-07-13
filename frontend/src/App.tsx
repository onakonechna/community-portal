import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/Auth';
import HeadBar from './components/HeadBar';
import ProjectGrid from './components/ProjectGrid';
import ProjectView from './components/ProjectView/ProjectView';

class App extends React.Component {
  public render() {
    return (
      <div>
        <HeadBar />
        <Route exact path="/" component={ProjectGrid} />
        <Route exact path="/project" component={ProjectView} />
        <Route exact path="/auth" component={Auth}/>
        <Route exact path="/bookmarked" render={
          () => <ProjectGrid filter="bookmarkedProjects" />
        } />
      </div>
    );
  }
}

export default App;

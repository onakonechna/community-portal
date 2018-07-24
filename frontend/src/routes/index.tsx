import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from '../components/Auth';
import HeadBar from '../components/HeadBar';
import ProjectGrid from '../components/ProjectGrid';

const Routes = () => (
  <div>
    <Route path="/" component={HeadBar} />
    <Route exact path="/" component={ProjectGrid} />
    <Route exact path="/auth" component={Auth} />
    <Route exact path="/bookmarked" render={
      () => <ProjectGrid filter="bookmarkedProjects" />
    } />
  </div>
);

export default Routes;

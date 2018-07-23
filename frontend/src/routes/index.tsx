import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from '../components/Auth';
import HeadBar from '../components/HeadBar';
import ProjectGrid from '../components/ProjectGrid';

const Routes = () => (
  <div>
    <HeadBar />
    <ProjectGrid />
    <Route exact path="/auth" component={Auth} />
  </div>
);

export default Routes;

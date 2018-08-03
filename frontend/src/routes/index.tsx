import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from '../components/Auth';
import HeadBar from '../components/HeadBar';
import Profile from '../components/Profile';
import ProjectGrid from '../components/ProjectGrid';
import ProjectDetails from '../components/ProjectDetails';

const Routes = () => (
  <div>
    <Route path="/" component={HeadBar} />
    <Route exact path="/" component={ProjectGrid} />
    <Route exact path="/auth" component={Auth} />
    <Route exact path="/profile" component={Profile}/>
    <Route exact path="/bookmarked" render={
      (props: any) => <ProjectGrid filter="bookmarkedProjects" {...props} />
    } />
    <Route exact path="/pledged" render={
      (props: any) => <ProjectGrid filter="pledgedProjects" {...props} />
    } />
    <Route exact path="/project/:project_id" component={
      (props: any) => <ProjectDetails project_id={props.match.params.project_id} />
    } />
  </div>
);

export default Routes;

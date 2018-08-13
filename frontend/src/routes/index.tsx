import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import Auth from '../components/Auth';
import HeadBar from '../components/HeadBar';
import Profile from '../components/Profile';
import ProjectGrid from '../components/ProjectGrid';
import ViewPartnersTeamPage from '../components/partners/pages/ViewPartnersTeamPage';
import EditPartnersTeamPage from '../components/partners/pages/EditPartnersTeamPage';
import CreatePartnersTeamPage from '../components/partners/pages/CreatePartnersTeamPage';
import PartnersManagementPage from '../components/partners/pages/PartnersManagementPage';
import history from './history';
import PartnerRoute from './PartnerRoute';

const Routes = () => (
  <Router history={history}>
    <div>
        <Route path="/" component={HeadBar} />

        <PartnerRoute exact path="/partners-management/view/:id" component={ViewPartnersTeamPage} role="partner-user"/>
        <PartnerRoute exact path="/partners-management/edit/:id" component={EditPartnersTeamPage} role="partner-owner"/>
        <PartnerRoute exact path="/partners-management/create" component={CreatePartnersTeamPage} role="partner-admin"/>
        <PartnerRoute exact path="/partners-management" component={PartnersManagementPage} role="partner-admin"/>

        <Route exact path="/" component={ProjectGrid} />
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/profile" component={Profile}/>
        <Route exact path="/bookmarked" render={
          () => <ProjectGrid filter="bookmarkedProjects" />
        } />
        <Route exact path="/pledged" render={
          () => <ProjectGrid filter="pledgedProjects" />
        }
        />
    </div>
  </Router>
);

export default Routes;

import * as React from 'react';
import { Route } from 'react-router-dom';
import Auth from '../components/Auth';
import HeadBar from '../components/HeadBar';
import Profile from '../components/Profile';
import ProjectGrid from '../components/ProjectGrid';
import ViewPartnersTeamPage from '../components/partners/pages/ViewPartnersTeamPage';
import EditPartnersTeamPage from '../components/partners/pages/EditPartnersTeamPage';
import CreatePartnersTeamPage from '../components/partners/pages/CreatePartnersTeamPage';
import PartnersManagementPage from '../components/partners/pages/PartnersManagementPage';
import PartnerRoute from './PartnerRoute';
import ProjectDetails from '../components/ProjectDetails';
import CalendarPage from '../components/calendar/CalendarPage';
import SurveyPage from '../components/survey/SurveyPage';

const Routes = () => (
  <div>
    <Route path="/" component={HeadBar} />
    <PartnerRoute exact path="/partners-management/view/:id" component={ViewPartnersTeamPage} role="partner-user"/>
    <PartnerRoute exact path="/partners-management/edit/:id" component={EditPartnersTeamPage} role="partner-owner"/>
    <PartnerRoute exact path="/partners-management/create" component={CreatePartnersTeamPage} role="partner-admin"/>
    <PartnerRoute exact path="/partners-management" component={PartnersManagementPage} role="partner-admin"/>

    <Route exact path="/" component={ProjectGrid} />
    <Route exact path="/community-calendar" component={CalendarPage} />
    <Route exact path="/survey/:survey_name/:repo_details" render={(props: any) =>
        <SurveyPage repo_details={props.match.params.repo_details} survey_name={props.match.params.survey_name}/>} />
    <Route exact path="/auth" component={Auth} />
    <Route exact path="/profile/:login" component={Profile} />
    <Route exact path="/bookmarked" render={(props: any) => <ProjectGrid filter="bookmarkedProjects" {...props} />}/>
    <Route exact path="/user/projects" render={(props: any) => <ProjectGrid filter="userProjects" {...props} />}/>
    <Route exact path="/project/:project_id" component={(props: any) =>
      <ProjectDetails project_id={props.match.params.project_id}/>}/>
  </div>
);

export default Routes;

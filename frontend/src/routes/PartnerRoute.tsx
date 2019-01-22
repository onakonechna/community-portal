import * as React from 'react';
import _isEmpty  from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PartnerRoute = ({ role, types, redirectTo, component: Component, ...rest }:any) => (
  <Route
    { ...rest }
    render={
      props => types[role] ? <Component { ...props } /> : <Redirect to={redirectTo || '/'}/>
    }
  />
);

function mapStateToProps(state:any) {
  const isMember = !_isEmpty(state.user['partner_team_member']);
  const isOwner = !_isEmpty(state.user['partner_team_owner']);
  const isAdmin = !!state.user['partners_admin'];

  return {
    types: {
      'partner-user': isMember || isOwner || isAdmin,
      'partner-member': isMember || isAdmin,
      'partner-owner': isOwner || isAdmin,
      'partner-admin': isAdmin
    }
  }
}

export default withRouter(connect<{}, {}, any>(mapStateToProps)(PartnerRoute));
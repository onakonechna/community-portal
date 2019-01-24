import * as React from 'react';
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
    const scopes = state.user.scopes;
    let isMember = false,
        isOwner = false,
        isAdmin = false;

    if (scopes) {
        scopes.map(function (value: any, index: any) {
            if (value.scope == 'partners_admin') {
                isAdmin = true;
            } else if (value.scope == 'partner_team_member') {
                isMember = true;
            } else if (value.scope == 'partner_team_owner') {
                isOwner = true;
            }
        });
    }

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
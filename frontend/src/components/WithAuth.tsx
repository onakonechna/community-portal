import * as _ from 'lodash';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import GithubAuthButton, { User }from './GithubAuthButton';
import { onSuccess, onFailure } from './HeadBar';
import { LoadUserAction,
         UpdateUserRoleAction,
         getLikedProjectsAction,
         UpdateUserScopesAction,
        } from '../actions';

interface WithAuthProps {
  className?: any;
  user?: any;
  handler?: any;
  liked?: boolean;
  upvotes?: number;
  project_id?: string;
  label?: string;
  clientId?: string;
  scope?: string;
  redirectUri?: string;
  onSuccess?: any;
  onFailure?: any;
  toggleLike?: any;
  likeProject?: any;
}

interface WithAuthStateProps {
  user?: any;
}

interface WithAuthDispatchProps {
  loadUser?: any;
  updateUserRole?: any;
  updateUserScopes?: any;
  getLikedProjects?: any;
}

const Authorization = (allowedRoles:any, compulsoryScopes?:any) => (WrappedComponent:any) => {
  const Login = GithubAuthButton(WrappedComponent);
  class WithAuth extends React.Component<WithAuthProps & WithAuthStateProps & WithAuthDispatchProps, {}> {
    constructor(props: WithAuthProps) {
      super(props);
    }
    render() {
      const { role, scopes } = this.props.user;
      console.log('WithAuth.tsx debugging - scopes:', scopes);
      if (!allowedRoles.includes(role)) {
        return <Login
          clientId="668e0b6c450cc783f267"
          scope=""
          redirectUri="http://localhost:3030/auth"
          onSuccess={onSuccess}
          onFailure={onFailure}
          user={this.props.user}
          loadUser={this.props.loadUser}
          updateUserRole={this.props.updateUserRole}
          updateUserScopes={this.props.updateUserScopes}
          getLikedProjects={this.props.getLikedProjects}
        />;
      }

      // do not check scopes if compulsoryScopes is not specified
      if (compulsoryScopes === undefined
        || (Array.isArray(compulsoryScopes) && compulsoryScopes.length === 0)
      ) {
        return <WrappedComponent {...this.props} />;
      }
      if (!Array.isArray(compulsoryScopes)) {
        console.log('Logging compulsoryScopes:', compulsoryScopes);
        throw 'WithAuth.tsx: compulsoryScopes must be an array if specified';
      }

      // check if user scopes contain every compulsory scope listed
      if (_.every(compulsoryScopes, (scope: string) => _.includes(scopes, scope))) {
        return <WrappedComponent {...this.props} />;
      }

      // render nothing
      return null;
    }
  }
  const mapStateToProps = (state: any) => {
    return {
      user: state.user,
    };
  };

  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      getLikedProjects: () => dispatch(getLikedProjectsAction()),
      loadUser: (user: User) => dispatch(LoadUserAction(user)),
      updateUserRole: (id: string, role: string) => dispatch(UpdateUserRoleAction(id, role)),
      updateUserScopes: (id: string, scopes: string[]) => dispatch(UpdateUserScopesAction(id, scopes)),
    };
  };

  return connect<WithAuthStateProps, WithAuthDispatchProps, WithAuthProps>(mapStateToProps, mapDispatchToProps)(WithAuth);
};

export default Authorization;

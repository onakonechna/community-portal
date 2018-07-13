import * as _ from 'lodash';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import GithubAuthButton, { User }from './GithubAuthButton';
import { onSuccess, onFailure } from './HeadBar';
import { LoadUserAction,
  UpdateUserRoleAction,
  getLikedProjectsAction,
  getBookmarkedProjectsAction,
  UpdateUserScopesAction,
} from '../actions';

declare const __FRONTEND__: string;
export const frontEnd = __FRONTEND__;
declare const GIT_ID: string;
export const gitId = GIT_ID;

interface WithAuthProps {
  className?: any;
  user?: any;
  handler?: any;
  liked?: boolean;
  bookmarked?: boolean;
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
  toggleBookmark?: any;
  bookmarkProject?: any;
}

interface WithAuthStateProps {
  user?: any;
}

interface WithAuthDispatchProps {
  loadUser?: any;
  updateUserRole?: any;
  updateUserScopes?: any;
  getLikedProjects?: any;
  getBookmarkedProjects?: any;
}

const Authorization = (allowedRoles:any, compulsoryScopes?:any) => (WrappedComponent:any) => {
  const Login = GithubAuthButton(WrappedComponent);
  class WithAuth extends React.Component<WithAuthProps & WithAuthStateProps & WithAuthDispatchProps, {}> {
    constructor(props: WithAuthProps) {
      super(props);
    }
    render() {
      const { role, scopes } = this.props.user;

      // do not render if user has no required scopes
      if (
        typeof compulsoryScopes !== 'undefined'
        && Array.isArray(compulsoryScopes)
        && compulsoryScopes.length > 0
      ) {
        if (
          typeof scopes === 'undefined'
          || scopes.length === 0
          || !_.every(compulsoryScopes, (scope: string) => _.includes(scopes, scope))
        ) {
          return null;
        }
      }

      if (!allowedRoles.includes(role)) {
        return <Login
          clientId={gitId}
          scope=""
          redirectUri={`${frontEnd}/auth`}
          onSuccess={onSuccess}
          onFailure={onFailure}
          user={this.props.user}
          loadUser={this.props.loadUser}
          updateUserRole={this.props.updateUserRole}
          updateUserScopes={this.props.updateUserScopes}
          getLikedProjects={this.props.getLikedProjects}
        />;
      }

      return <WrappedComponent {...this.props} />;
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
      getBookmarkedProjects: () => dispatch(getBookmarkedProjectsAction()),
      loadUser: (user: User) => dispatch(LoadUserAction(user)),
      updateUserRole: (id: string, role: string) => dispatch(UpdateUserRoleAction(id, role)),
      updateUserScopes: (id: string, scopes: string[]) => dispatch(UpdateUserScopesAction(id, scopes)),
    };
  };

  return connect<WithAuthStateProps, WithAuthDispatchProps, WithAuthProps>(mapStateToProps, mapDispatchToProps)(WithAuth);
};

export default Authorization;

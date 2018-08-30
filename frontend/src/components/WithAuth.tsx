import every from 'lodash/every';
import includes from 'lodash/includes';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import GithubAuthButton, { User } from './GithubAuthButton';
import { LoadUserAction,
         UpdateUserRoleAction,
         getBookmarkedProjectsAction,
         UpdateUserScopesAction,
} from '../actions';

interface WithAuthStateProps {
  user?: any;
}

interface WithAuthDispatchProps {
  loadUser?: any;
  updateUserRole?: any;
  updateUserScopes?: any;
  getBookmarkedProjects?: any;
}

const Authorization = (allowedRoles:any, compulsoryScopes?:any) => (WrappedComponent:any) => {
  const Login = GithubAuthButton(WrappedComponent);
  class WithAuth extends React.Component<any, {}> {
    constructor(props: any) {
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
          || !every(compulsoryScopes, (scope: string) => includes(scopes, scope))
        ) {
          return null;
        }
      }

      if (!allowedRoles.includes(role)) {
        return <Login
          scope=""
          className={this.props.className}
          user={this.props.user}
          loadUser={this.props.loadUser}
          updateUserRole={this.props.updateUserRole}
          updateUserScopes={this.props.updateUserScopes}
          getBookmarkedProjects={this.props.getBookmarkedProjects}
        />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }
  const mapStateToProps = (state: any) => ({
    user: state.user
  });

  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      getBookmarkedProjects: () => dispatch(getBookmarkedProjectsAction()),
      loadUser: (user: User) => dispatch(LoadUserAction(user)),
      updateUserRole: (id: string, role: string) => dispatch(UpdateUserRoleAction(id, role)),
      updateUserScopes: (id: string, scopes: string[]) => dispatch(UpdateUserScopesAction(id, scopes)),
    };
  };

  return connect<WithAuthStateProps, WithAuthDispatchProps, any>(mapStateToProps, mapDispatchToProps)(WithAuth);
};

export default Authorization;

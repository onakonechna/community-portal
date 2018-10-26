import every from 'lodash/every';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import GithubAuthButton, { User } from './GithubAuthButton';
import { LoadUserAction, UpdateUserScopesAction,} from '../actions';

interface WithAuthStateProps {
  user?: any;
}

interface WithAuthDispatchProps {
  loadUser?: any;
  updateUserScopes?: any;
}

const Authorization = (allowedRoles:any, compulsoryScopes?:any) => (WrappedComponent:any) => {
  const Login = GithubAuthButton(WrappedComponent);
  class WithAuth extends React.Component<any, {}> {
    render() {
      const { scopes } = this.props.user;
      const isAuthorized = !!this.props.user.id;

      // do not render if user has no required scopes
      if (
        typeof compulsoryScopes !== 'undefined'
        && Array.isArray(compulsoryScopes)
        && compulsoryScopes.length > 0
      ) {
        if (
          typeof scopes === 'undefined'
          || scopes.length === 0
          || !every(compulsoryScopes, (scope: string) => !!scopes.find((item:any) => item.scope === scope))
        ) {
          return null;
        }
      }

      if (!allowedRoles.includes(['guest']) && !isAuthorized) {
        return <Login
          className={this.props.className}
          user={this.props.user}
          loadUser={this.props.loadUser}
          updateUserScopes={this.props.updateUserScopes}
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
      loadUser: (user: User) => dispatch(LoadUserAction(user)),
      updateUserScopes: (id: string, scopes: string[]) => dispatch(UpdateUserScopesAction(id, scopes)),
    };
  };

  return connect<WithAuthStateProps, WithAuthDispatchProps, any>(mapStateToProps, mapDispatchToProps)(WithAuth);
};

export default Authorization;

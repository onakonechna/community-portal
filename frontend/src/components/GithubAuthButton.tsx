import * as React from 'react';
import axios from 'axios';
import GithubAuthModal, { toQuery } from './GithubAuthModal';
import { API } from './../api/Config';

declare const __FRONTEND__: string;
declare const GIT_ID: string;
export const gitId = GIT_ID;
export const frontEnd = __FRONTEND__;

interface GithubAuthButtonProps {
  label?: string;
  scope: string;
  className?: string;
  buttonText?: string;
  children?: any;
  onRequest?: any;
  user?: any;
  updateUserRole?: any;
  updateUserScopes?: any;
  getLikedProjects?: any;
  getBookmarkedProjects?: any;
  loadUser?: any;
}

export interface User {
  user_id?: string;
  name?: string;
  company?: string;
  avatar_url?: string;
  likedProjects?: string[];
  bookmarkedProjects?: string[];
}

const defaultUser: User = {
  user_id: '',
  name: '',
  company: '',
  avatar_url: '',
  likedProjects: [],
  bookmarkedProjects: [],
};

const withLogin = (WrappedCompoent: any) => {
  class GithubAuthButton extends React.Component<GithubAuthButtonProps, {}> {
    constructor(props: GithubAuthButtonProps) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
    }
    public static defaultProps: Partial<GithubAuthButtonProps> = {
      buttonText: 'Sign In',
      scope: 'user:email',
    };

    private popup: any;

    authorize(response: string) {
      return axios.post(`${API}/authorize`, { code: response });
    }

    processAuthorizeFailure(response: Error) {
      return new Promise((resolve, reject) => {
        console.error(response);
        resolve(response);
      });
    }

    handleLogin() {
      const search = toQuery({
        client_id: gitId,
        redirect_uri: `${frontEnd}/auth`,
        scope: '',
      });
      const popup = this.popup = GithubAuthModal.open(
        'github-oauth-authorize',
        `https://github.com/login/oauth/authorize?${search}`,
        { height: 1000, width: 600 },
      );
      popup.then(
        (data: string) => this.onSuccess(data),
        (error: Error) => this.onFailure(error),
      );
    }

    handleLogout() {
      localStorage.removeItem('oAuth');
      this.props.loadUser(defaultUser);
      this.props.updateUserRole(this.props.user.user_id, 'guest');
      this.props.updateUserScopes(this.props.user.user_id, []);
    }

    decodeToken(token: string) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decoded = JSON.parse(window.atob(base64));
      return {
        user_id: decoded.user_id,
        name: decoded.name,
        company: decoded.company,
        avatar_url: decoded.avatar_url,
        scopes: decoded.scopes,
      };
    }

    async saveToken(token: string) {
      await localStorage.setItem('oAuth', JSON.stringify(token));
    }

    onSuccess(code: string) {
      if (!code) {
        return this.onFailure(new Error('\'code\' not found'));
      }
      this.authorize(code)
        .then((res: any) => {
          const token = res.data.token;
          this.saveToken(token);
          const user = this.decodeToken(token);
          Promise.all([
            this.props.loadUser(user),
            this.props.updateUserRole(this.props.user.user_id, 'user'),
            this.props.updateUserScopes(this.props.user.user_id, this.props.user.scopes),
            this.props.getLikedProjects(),
            this.props.getBookmarkedProjects(),
          ])
            .catch((err: Error) => console.error(err));
        })
        .catch((err: Error) => console.error(err));
    }

    onFailure(error: Error) {
      this.processAuthorizeFailure(error)
        .then(() => this.props.updateUserRole(this.props.user.user_id, 'guest'));
    }

    render() {
      return <WrappedCompoent handler={this.handleLogin} logoutHandler={this.handleLogout} {...this.props} />;
    }
  }
  return GithubAuthButton;
};

export default withLogin;

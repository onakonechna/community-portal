import * as React from 'react';
import axios from 'axios';

import GithubAuthModal, { toQuery } from './GithubAuthModal';
import Message from './Message';
import { API } from './../api/Config';

declare const __FRONTEND__: string;
declare const GITHUB_CLIENT_ID: string;
export const gitId = GITHUB_CLIENT_ID;
export const frontEnd = __FRONTEND__;

console.log(gitId);

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

interface GithubAuthButtonState {
  errorMessage: string;
  messageOpen: boolean;
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
  class GithubAuthButton extends React.Component<GithubAuthButtonProps, GithubAuthButtonState> {
    constructor(props: GithubAuthButtonProps) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.handleMessageClose = this.handleMessageClose.bind(this);
      this.state = {
        errorMessage: 'hola amigos, que tal?',
        messageOpen: false,
      };
    }

    public static defaultProps: Partial<GithubAuthButtonProps> = {
      buttonText: 'Sign In',
      scope: 'user:email',
    };

    private popup: any;

    authorize(response: string) {
      return axios.post(`${API}/authorize`, { code: response });
    }

    processAuthorizeFailure(response: string) {
      return new Promise((resolve, reject) => {
        this.handleMessageChange(response);
        resolve(response);
      });
    }

    handleMessageClose() {
      this.setState({
        messageOpen: false,
      });
    }

    handleMessageChange(message: string) {
      this.setState((prevState: GithubAuthButtonState) => ({
        errorMessage: message,
        messageOpen: true,
      }));
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
      this.clearToken();
      Promise.all([
        this.props.loadUser(defaultUser),
        this.props.updateUserRole(this.props.user.user_id, 'guest'),
        this.props.updateUserScopes(this.props.user.user_id, []),
      ])
      .catch((err: Error) => this.onFailure(err));
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

    async clearToken() {
      await localStorage.removeItem('oAuth');
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
          .catch((err: Error) => this.onFailure(err));
        })
        .catch((err: Error) => this.onFailure(err));
    }

    onFailure(error: Error) {
      this.processAuthorizeFailure(error.message)
        .then(() => this.props.updateUserRole(this.props.user.user_id, 'guest'));
    }

    render() {
      return <div className="auth">
        <WrappedCompoent handler={this.handleLogin} logoutHandler={this.handleLogout} {...this.props} />
        <Message
          message={this.state.errorMessage}
          open={this.state.messageOpen}
          handleClose={this.handleMessageClose}
        />
      </div>;
    }
  }
  return GithubAuthButton;
};

export default withLogin;

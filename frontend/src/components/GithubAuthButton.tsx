import * as React from 'react';
import GithubAuthModal, { toQuery } from './GithubAuthModal';

interface GithubAuthButtonProps {
  clientId: string;
  label?: string;
  redirectUri: string;
  scope: string;
  onSuccess: any;
  onFailure: any;
  className?: string;
  buttonText?: string;
  children?: any;
  onRequest?: any;
  user?: any;
  updateUserRole?: any;
  getLikedProjects?: any;
  loadUser?: any;
}

export interface User {
  user_id?: string;
  name?: string;
  company?: string;
  avatar_url?: string;
  likedProjects?: string[];
}

const defaultUser: User = {
  user_id: '',
  name: '',
  company: '',
  avatar_url: '',
  likedProjects: [],
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
      onFailure: () => { return; },
      onRequest: () => { return; },
      onSuccess: () => { return; },
      scope: 'user:email',
    };

    private popup: any;

    handleLogin() {
      const search = toQuery({
        client_id: this.props.clientId,
        redirect_uri: this.props.redirectUri,
        scope: this.props.scope,
      });
      const popup = this.popup = GithubAuthModal.open(
        'github-oauth-authorize',
        `https://github.com/login/oauth/authorize?${search}`,
        { height: 1000, width: 600 },
      );
      this.props.onRequest();
      popup.then(
        (data: string) => this.onSuccess(data),
        (error: Error) => this.onFailure(error),
      );
    }

    handleLogout() {
      localStorage.removeItem('oAuth');
      this.props.loadUser(defaultUser);
      this.props.updateUserRole(this.props.user.user_id, 'guest');
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
      };
    }

    async saveToken(token: string) {
      await localStorage.setItem('oAuth', JSON.stringify(token));
    }

    onSuccess(code: string) {
      if (!code) {
        return this.onFailure(new Error('\'code\' not found'));
      }
      this.props.onSuccess(code)
        .then((res:any) => {
          const token = res.data.token;
          this.saveToken(token);
          const user = this.decodeToken(token);
          Promise.all([
            this.props.updateUserRole(this.props.user.user_id, 'user'),
            this.props.updateUserScopes(this.props.user.user_id, this.props.user.scopes),
            this.props.loadUser(user),
            this.props.getLikedProjects(),
          ])
          .catch((err: Error) => console.error(err));
        })
        .catch((err: Error) => console.error(err));
    }

    onFailure(error: Error) {
      this.props.onFailure(error)
        .then((err:Error) => console.log(err))
        .then(() => this.props.updateUserRole(this.props.user.user_id, 'guest'));
    }

    render() {
      return <WrappedCompoent handler={this.handleLogin} logoutHandler={this.handleLogout} {...this.props} />;
    }
  }
  return GithubAuthButton;
};

export default withLogin;

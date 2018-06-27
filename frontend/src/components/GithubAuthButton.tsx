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
}

const withLogin = (WrappedCompoent: any) => {
  class GithubAuthButton extends React.Component<GithubAuthButtonProps, {}> {
    constructor(props: GithubAuthButtonProps) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
    }
    public static defaultProps: Partial<GithubAuthButtonProps> = {
      buttonText: 'LOGIN',
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
      this.props.updateUserRole(this.props.user.user_id, 'guest');
      localStorage.removeItem('oAuth');
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

    saveToken(token: string) {
      const user = this.decodeToken(token);
      console.log(user);
      localStorage.setItem('oAuth', JSON.stringify(token));
    }

    onSuccess(code: string) {
      if (!code) {
        return this.onFailure(new Error('\'code\' not found'));
      }
      this.props.onSuccess(code)
        .then((res:any) => {
          this.saveToken(res.data.token);
          this.props.updateUserRole(this.props.user.user_id, 'user');
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
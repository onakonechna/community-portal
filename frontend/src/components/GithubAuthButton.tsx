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

    onSuccess(code: string) {
      if (!code) {
        return this.onFailure(new Error('\'code\' not found'));
      }
      this.props.onSuccess(code)
        .then((res:any) => console.log(res))
        .catch((err: Error) => console.error(err));
      this.props.updateUserRole(this.props.user.user_id, 'user');
    }

    onFailure(error: Error) {
      this.props.onFailure(error)
        .then((err:Error) => console.log(err))
        .then(() => this.props.updateUserRole(this.props.user.user_id, 'guest'));
    }

    render() {
      return <WrappedCompoent handler={this.handleLogin} {...this.props} />;
    }
  }
  return GithubAuthButton;
};

export default withLogin;

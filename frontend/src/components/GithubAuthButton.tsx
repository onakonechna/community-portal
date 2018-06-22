import * as React from 'react';
import GithubAuthModal from './GithubAuthModal';

import Button from '@material-ui/core/Button';

const toQuery = (params: any, delimiter = '&') => {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < (keys.length - 1)) {
      query += delimiter;
    }

    return query;
  }, '');
};

interface GithubAuthButtonProps {
  clientId: string;
  redirectUri: string;
  scope: string;
  onSuccess: any;
  onFailure: any;
  className?: string;
  buttonText?: string;
  children?: any;
  onRequest?: any;
}

class GithubAuthButton extends React.Component<GithubAuthButtonProps, {}> {
  public static defaultProps: Partial<GithubAuthButtonProps> = {
    buttonText: 'LOGIN',
    onFailure: () => { return; },
    onRequest: () => { return; },
    onSuccess: () => { return; },
    scope: 'user:email',
  };

  private popup: any;

  onBtnClick() {
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

    this.onRequest();
    popup.then(
      (data: string) => this.onSuccess(data),
      (error: Error) => this.onFailure(error),
    );
  }

  onRequest(data?: any) {
    this.props.onRequest();
  }

  onSuccess(code: string) {
    if (!code) {
      return this.onFailure(new Error('\'code\' not found'));
    }

    this.props.onSuccess(code);
  }

  onFailure(error: Error) {
    this.props.onFailure(error);
  }

  render() {
    const { className, buttonText, children } = this.props;
    const attrs: any = { onClick: this.onBtnClick.bind(this) };

    if (className) {
      attrs.className = className;
    }

    return <Button {...attrs}>{children || buttonText}</Button>;
  }
}

export default GithubAuthButton;

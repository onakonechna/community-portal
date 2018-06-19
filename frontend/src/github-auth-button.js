import React, { Component } from 'react';
import GithubAuthModal from './github-auth-modal';

const toQuery = (params, delimiter = '&') => {
    const keys = Object.keys(params);

    return keys.reduce((str, key, index) => {
        let query = `${str}${key}=${params[key]}`;

        if (index < (keys.length - 1)) {
            query += delimiter;
        }

        return query;
    }, '');
};

class GitHubLogin extends Component {
    onBtnClick () {
        const { clientId, scope, redirectUri } = this.props,
            search = toQuery({
                client_id: clientId,
                scope: scope,
                redirect_uri: redirectUri,
            }),
            popup = this.popup = GithubAuthModal.open(
                'github-oauth-authorize',
                `https://github.com/login/oauth/authorize?${search}`,
                { height: 1000, width: 600 }
            );

        this.onRequest();
        popup.then(
            data => this.onSuccess(data),
            error => this.onFailure(error)
        );
    };

    onRequest (data) {
        this.props.onRequest();
    };

    onSuccess (code) {
        if (!code) {
            return this.onFailure(new Error('\'code\' not found'));
        }

        this.props.onSuccess(code);
    };

    onFailure (error) {
        this.props.onFailure(error);
    };

    render() {
        const { className, buttonText, children } = this.props;
        const attrs = { onClick: this.onBtnClick.bind(this) };

        if (className) {
            attrs.className = className;
        }

        return <button {...attrs}>{ children || buttonText }</button>;
    }
}

GitHubLogin.defaultProps = {
    buttonText: 'Sign in with GitHub',
    scope: 'user:email',
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {},
};

export default GitHubLogin;

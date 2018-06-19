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
        const { clientId, scope, redirectUri } = this.props;
        const search = toQuery({
            client_id: this.props.clientId,
            redirect_uri: this.props.redirectUri,
            scope: this.props.scope,
        });
        const popup = this.popup = GithubAuthModal.open(
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
    onFailure: () => { return; },
    onRequest: () => { return; },
    onSuccess: () => { return; },
    scope: 'user:email',
};

export default GitHubLogin;

import * as React from 'react';
import { connect } from 'react-redux';
import Message from './Message';
import { login, logout } from '../actions/user';

interface GithubAuthButtonProps {
  label?: string;
  login: any,
  logout: any,
  className?: string;
  children?: any;
  onRequest?: any;
  user?: any;
  updateUserScopes?: any;
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
  login?: string,
  email?: string,
  location?: string,
  upvoted_projects?: any,
  bookmarkedProjects?: any;
}

const withLogin = (WrappedCompoent: any) => {
  class GithubAuthButton extends React.Component<GithubAuthButtonProps, GithubAuthButtonState> {
    constructor(props: GithubAuthButtonProps) {
      super(props);

      this.handleMessageChange = this.handleMessageChange.bind(this);
      this.handleMessageClose = this.handleMessageClose.bind(this);
      this.state = {
        errorMessage: 'hola amigos, que tal?',
        messageOpen: false,
      };
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

    render() {
      return <div className={this.props.className}>
        <WrappedCompoent handler={this.props.login} logoutHandler={this.props.logout} {...this.props} />
        <Message
          message={this.state.errorMessage}
          open={this.state.messageOpen}
          handleClose={this.handleMessageClose}
        />
      </div>;
    }
  }
  return connect(null, { login, logout })(GithubAuthButton);
};

export default withLogin;

import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';

interface IAuthState {
  size: number;
}

class Auth extends React.Component<{}, IAuthState> {
  constructor(props: any) {
    super(props);

    this.state = {
      size: 150,
    };
  }

  componentDidMount() {
    this.setState({
      size: window.innerWidth / 3,
    });
  }

  render() {
    return (
      <CircularProgress
        style={{
          position: 'absolute',
          top: (window.innerHeight / 2) - (this.state.size / 2),
          left: (window.innerWidth / 2) - (this.state.size / 2),
        }}
        size={this.state.size}
        color="primary"
      />
    );
  }
}

export default Auth;

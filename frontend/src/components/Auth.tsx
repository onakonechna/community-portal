import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import { connect } from 'react-redux';

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

const mapStateToProps = (state: any) => {
  return {
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  };
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Auth);

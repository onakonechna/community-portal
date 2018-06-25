import * as React from 'react';
import { connect } from 'react-redux';

interface WithAuthProps {
  user?: any;
  handler: any;
}

const Authorization = (allowedRoles:any) => (WrappedComponent:any) => {
  class WithAuth extends React.Component<WithAuthProps, {}> {
    constructor(props: WithAuthProps) {
      super(props);
    }
    render() {
      const { role } = this.props.user;
      if (allowedRoles.includes(role)) {
        return <WrappedComponent handler={this.props.handler} />;
      }
      return null;
    }
  }
  const mapStateToProps = (state: any) => {
    return {
      user: state.user,
    };
  };
  return connect(mapStateToProps, null)(WithAuth);
};

export default Authorization;

import React from 'react';
import { CircularProgress } from 'material-ui/Progress';

const style = {
    size: window.screen.height / 10,
    progressWidth: window.screen.width / 2,
    progressHeight: window.screen.width / 2
};

class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            size: 150
        }
    }

    componentDidMount() {
        this.setState({
            size: window.innerWidth / 3
        });
    }

    render() {
        return (
            <CircularProgress
                style={{
                    position: 'absolute',
                    top: (window.innerHeight / 2) - (this.state.size / 2),
                    left: (window.innerWidth / 2) - (this.state.size / 2)
                }}
                size={this.state.size}
                color="primary"
            />
        );
    }
}

export default Auth;


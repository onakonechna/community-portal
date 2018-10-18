import { connect } from 'react-redux';
import * as React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { login } from '../../actions/user';

class AuthorizedUserRole extends React.Component<any, any> {
  static defaultProps = {
    requestLogin: false,
    disabled: false
  };

  constructor(props:any) {
    super(props);

    this.state = {
      open: false
    }
  }

  getChildComponent = () => React.cloneElement(this.props.children as React.ReactElement<any>, { isAuthorized: this.props.isAuthorized });
  openDialog = () => this.setState({open: true});
  closeDialog = () => this.setState({open: false});
  login = () => {
    this.closeDialog();
    this.props.login();
  };
  prevent = (cb:any) => (e:any) => {
    e.stopPropagation();
    e.preventDefault();

    cb();
  };

  getNotAuthorizedHtml = () => {
    if (this.props.requestLogin) {
      return (
        <div>
          <Dialog open={this.state.open}>
            <DialogContent>
              <Typography>
                  Please sign in to perform this action.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Cancel</Button>
              <Button onClick={this.login}>Sign In</Button>
            </DialogActions>
          </Dialog>
          <div onClickCapture={this.prevent(this.openDialog)}>
            {React.cloneElement(this.props.children as React.ReactElement<any>, { isAuthorized: this.props.isAuthorized })}
          </div>
        </div>
      );
    }

    return null
  };

  render() {
    return this.props.isAuthorized ? (this.getChildComponent()) : (this.getNotAuthorizedHtml())
  }
}

const mapStateToProps = (state:any) => ({
  isAuthorized: !!state.user.id
});

export default connect(mapStateToProps, {login})(AuthorizedUserRole)
import { connect } from 'react-redux';
import compose from "recompose/compose";
import * as _ from "lodash";
import * as React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { unjoinProject, joinProject } from '../../actions/project';
import JoinButton from '../buttons/JoinButton';

const styles = {
  joinText: {
    'font-size': '0.9rem',
  },
};


class Join extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      success: false,
      loading: false
    };
  }

  handleUnjoinProject = () => {
    this.props.unjoinProject(this.props.project, this.props.user)
      .then(this.handleCloseDialog)
  };

  handleJoinProject = () => {
    this.props.joinProject(this.props.project, this.props.user)
      .then(this.handleCloseDialog)
  };

  handleOpenDialog = () => this.setState({open: true});

  handleCloseDialog = () => this.setState({open: false});

  render() {
    return this.props.isAuthorized ? (
      <div>
        <Dialog open={this.state.open}>
          {this.props.isJoined ?
            <span>
              <DialogContent>
                <Typography className={this.props.classes.joinText}>
                  Are you sure you want to exit from the project?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseDialog}>Cancel</Button>
                <Button onClick={this.handleUnjoinProject}>Yes</Button>
              </DialogActions>
            </span>
            : <span>
              <DialogContent>
                <Typography className={this.props.classes.joinText}>
                  By joining this project, you'll commit to making active
                  contributions to this project and working with project owners
                  and fellow developers through online meetings and chats. If you're
                   willing to make this commitment, please click the 'Count Me In'
                    button. We look forward to working with you!
                </Typography>
                <h3>{this.props.project.goal}</h3>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseDialog}>Cancel</Button>
                <Button onClick={this.handleJoinProject}>Join</Button>
              </DialogActions>
            </span>
          }
        </Dialog>
        <JoinButton handler={this.handleOpenDialog} label={this.props.isJoined ? 'Leave' : 'Join' } />
      </div>
    ) : null
  }
}

const mapStateToProps = (state:any, props:any) => ({
  user: state.user,
  isJoined: !!props.project.contributors[state.user.user_id],
  isAuthorized: !_.isEmpty(state.user)
});

export default compose<{}, any>(
  withStyles(styles, {name: 'JoinProject'}),
  connect<{}, any, any>(mapStateToProps, {unjoinProject, joinProject}),
)(Join);
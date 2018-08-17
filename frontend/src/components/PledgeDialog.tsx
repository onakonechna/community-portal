import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Message from './Message';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import { pledgeProjectAction } from '../actions';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  pledgeText: {
    'font-size': '0.9rem',
  },
};

interface PledgeProps {
  classes?: any;
  project?: any;
  open: boolean;
  toggle: () => void;
  join: () => void;
  joined: boolean;
}

interface PledgeDispatchProps {
  pledgeProject: any;
}

interface PledgeState {
  success: boolean;
  loading: boolean;
  message: string;
  messageOpen: boolean;
}

export interface PledgeBody {
  project_id: string;
}

export class PledgeDialog extends React.Component<PledgeProps & PledgeDispatchProps, PledgeState> {
  constructor(props: PledgeProps & PledgeDispatchProps) {
    super(props);
    this.state = {
      success: false,
      loading: false,
      messageOpen: false,
      message: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  handleMessageChange(message: string) {
    this.setState({
      message,
      messageOpen: true,
    });
  }

  onFailure(error: Error) {
    this.handleMessageChange(error.message);
  }

  handleMessageClose() {
    this.setState({
      messageOpen: false,
    });
  }

  handleSubmit(event: any) {
    const body = {
      project_id: this.props.project.project_id,
    };
    this.props.pledgeProject(body)
      .then((res: any) => {
        this.setState((prevState: PledgeState) => ({
          success: true,
          loading: false,
        }), () => {
          this.props.toggle();
          this.props.join();
          this.setState((prevState: PledgeState) => ({
            success: false,
          }));
        });
      })
      .catch((err: Error) => {
        this.onFailure(new Error('Pledging is unsuccessful'));
        this.setState((prevState: PledgeState) => ({
          success: false,
          loading: false,
        }));
      });
    return;
  }

  render() {
    const { classes, joined, project } = this.props;
    return (
      <div>
        <Dialog open={this.props.open}>
          {joined ?
            <span>
              <DialogContent>
                <Typography className={classes.pledgeText}>
                  Thank you, you've already joined this project!
                </Typography>
              </DialogContent>
              <DialogActions>
                  <Button onClick={this.props.toggle}>
                    {this.state.success ? 'Done' : 'Exit'}
                  </Button>
              </DialogActions>
            </span>
            : <span>
              <DialogContent>
                <Typography className={classes.pledgeText}>
                  By joining this project, you'll commit to making active
                  contributions to this project and working with project owners
                  and fellow developers through online meetings and chats. If you're
                   willing to make this commitment, please click the 'Count Me In'
                    button. We look forward to working with you!
                </Typography>
                <h3>{project.goal}</h3>
                <Snackbar
                  open={this.state.messageOpen}
                >
                  <SnackbarContent message="That\'s beyond the expectation!" />
                </Snackbar>
              </DialogContent>
              <DialogActions>
                {this.state.loading && <LinearProgress
                  style={{ display: 'block', width: '60%' }}
                  variant="indeterminate" />}
                <Button onClick={this.props.toggle}>
                  {this.state.success ? 'Done' : 'Cancel'}
                </Button>
                <Button onClick={this.handleSubmit}>
                  {this.state.success ? 'Pledged' : 'Count Me In!'}
                </Button>
              </DialogActions>
            </span>
          }
        </Dialog>
        <Message
          message={this.state.message}
          open={this.state.messageOpen}
          handleClose={this.handleMessageClose}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    pledgeProject: (body: PledgeBody) => dispatch(pledgeProjectAction(body)),
  };
};

export default compose<{}, PledgeProps>(
  withStyles(styles, {
    name: 'PledgeDialog',
  }),
  connect<{}, PledgeDispatchProps, PledgeProps>(null, mapDispatchToProps),
)(PledgeDialog);

import * as React from 'react';
import { connect } from 'react-redux';

import Message from './Message';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';
import { pledgeProjectAction } from '../actions';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

interface PledgeProps {
  classes?: any;
  project?: any;
  open: boolean;
  toggle: () => void;
}

interface PledgeDispatchProps {
  pledgeProject: any;
}

interface PledgeState {
  hours?: number;
  success: boolean;
  loading: boolean;
  messageOpen: boolean;
}

export interface PledgeBody {
  project_id: string;
  hours: number;
}

export class PledgeDialog extends React.Component<PledgeProps & PledgeDispatchProps, PledgeState> {
  constructor(props: PledgeProps & PledgeDispatchProps) {
    super(props);
    this.state = {
      hours: 0,
      success: false,
      loading: false,
      messageOpen: false,
    };
    this.handlePledgeChange = this.handlePledgeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  handlePledgeChange(event: any) {
    if (event.target.value === null) {
      this.setState({ hours: 0 });
    } else {
      this.setState({ hours: parseInt(event.target.value, 10) });
    }
  }

  handleMessageClose() {
    this.setState({
      messageOpen: false,
    });
  }

  handleSubmit(event: any) {
    const { pledged, estimated } = this.props.project;
    if (pledged + this.state.hours > estimated) {
      this.setState({ messageOpen: true });
      return;
    }
    const body = {
      project_id: this.props.project.project_id,
      hours: this.state.hours,
    };
    if (body.hours != null && body.hours !== 0) {
      this.props.pledgeProject(body)
        .then((res: any) => {
          this.setState((prevState: PledgeState) => ({
            success: true,
            loading: false,
          }), () => {
            this.props.toggle();
            this.setState((prevState: PledgeState) => ({
              hours: 0,
              success: false,
            }));
          });
        })
        .catch((err: Error) => {
          this.setState((prevState: PledgeState) => ({
            success: false,
            loading: false,
          }));
        });
    }
  }

  render() {
    const { project } = this.props;
    return (
      <div>
      <Dialog open={this.props.open}>
        <DialogTitle>Pledge a Project</DialogTitle>
        <DialogContent>
          <h3>{project.goal}</h3>
          <TextField
            id="hours_pledged"
            label="hours to pledge"
            type="number"
            value={this.state.hours || ''}
            onChange={this.handlePledgeChange}
            fullWidth
          />
          <Snackbar
            open={this.state.messageOpen}
          >
           <SnackbarContent message="That\'s beyond the expectation!"/>
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
              {this.state.success ? 'Pledged' : 'Pledge'}
            </Button>
          </DialogActions>
        </Dialog>
        <Message
          message={'Actually, we don\'t need that much commitment :)'}
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

export default connect<{}, PledgeDispatchProps, PledgeProps>(null, mapDispatchToProps)(PledgeDialog);

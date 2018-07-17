import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { scheduleMeetingAction } from '../../actions';

interface ScheduleMeetingProps {
  classes?: any;
  project?: any;
  open: boolean;
  toggle: () => void;
}

interface ScheduleMeetingDispatchProps {
  scheduleMeeting: any;
}

interface ScheduleMeetingState {
  title: string;
  description: string;
  zoom_link: string;
  date: string;
  success: boolean;
  loading: boolean;
  messageOpen: boolean;
  [key: string]: boolean | string | number | string[];
}

export interface ScheduleMeetingBody {
  project_id: string;
  title: string;
  description: string;
  zoom_link: string;
  date: string;
}

export class ScheduleMeetingDialog extends React.Component<ScheduleMeetingProps & ScheduleMeetingDispatchProps, ScheduleMeetingState> {
  constructor(props: ScheduleMeetingProps & ScheduleMeetingDispatchProps) {
    super(props);
    this.state = {
      title: '',
      description: '',
      zoom_link: '',
      date: this.handleReadTime(),
      success: false,
      loading: false,
      messageOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(field: string) {
    return (event: any) => {
      const newItem = event.target.value;
      this.setState({
        [field]: newItem,
      });
    };
  }

  handleSubmit(event:any) {
    // const { pledged, estimated } = this.props.project;
    // if (pledged + this.state.hours > estimated) {
    //   this.setState({ messageOpen: true });
    //   return;
    // }
    const body = {
      project_id: this.props.project.project_id,
    };
    // if (body.hours != null && body.hours !== 0) {
    if (true) {
      this.props.scheduleMeeting(body)
        .then((res: any) => {
          this.setState((prevState:ScheduleMeetingState) => ({
            success: true,
            loading: false,
          }), () => {
            this.props.toggle();
            this.setState((prevState:ScheduleMeetingState) => ({
              success: false,
            }));
          });
        })
        .catch((err: Error) => {
          this.setState((prevState:ScheduleMeetingState) => ({
            success: false,
            loading: false,
          }));
        });
    }
  }

  handleReadTime() {
    return new Date().toISOString().substr(0, 10);
  }

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Schedule a Meeting</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Meeting Title"
            type="text"
            onChange={this.handleChange('title')}
            value={this.state.title}
            fullWidth
          />
          <TextField
            margin="dense"
            id="description"
            label="Meeting Description"
            type="text"
            multiline
            rows="4"
            onChange={this.handleChange('description')}
            value={this.state.description}
            fullWidth
          />
          <TextField
            required
            margin="dense"
            id="zoom_link"
            label="Zoom Link"
            type="text"
            onChange={this.handleChange('zoom_link')}
            value={this.state.zoom_link}
            fullWidth
          />
          <TextField
            required
            id="date"
            label="Date"
            type="date"
            onChange={this.handleChange('date')}
            value={this.state.date}
            InputLabelProps={{
              shrink: true,
            }}
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
              variant="indeterminate"/>}
          <Button onClick={this.props.toggle}>
            {this.state.success ? 'Done' : 'Cancel'}
          </Button>
          <Button onClick={this.handleSubmit}>
            {this.state.success ? 'Scheduled' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    scheduleMeeting: (body: ScheduleMeetingBody) => dispatch(scheduleMeetingAction(body)),
  };
};

export default connect<{}, ScheduleMeetingDispatchProps, ScheduleMeetingProps>(null, mapDispatchToProps)(ScheduleMeetingDialog);

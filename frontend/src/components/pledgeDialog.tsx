import * as React from 'react';

import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

interface PledgeProps {
  classes?: any;
  project?: any;
  open: boolean;
  toggle?: () => void;
}

interface PledgeState {
  hours?: number;
}

export default class PledgeDialog extends React.Component<PledgeProps, PledgeState> {
  constructor(props: PledgeProps) {
    super(props);
    this.state = { hours: 0 };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    if (event.target.value === null) {
      this.setState({ hours: 0 });
    } else {
      this.setState({ hours: parseInt(event.target.value, 10) });
    }
  }

  render() {
    const { project } = this.props;
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Pledge a Project</DialogTitle>
        <DialogContent>
          <h3>{project.goal}</h3>
          <TextField
            id="hours_pledged"
            label="hours to pledge"
            type="number"
            value={this.state.hours || ''}
            onChange={this.handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.toggle}>
            Cancel
          </Button>
          <Button>
            Pledge
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';
import { pledgeProjectAction } from '../actions';

interface PledgeProps {
  classes?: any;
  project?: any;
  open: boolean;
  toggle?: () => void;
}

interface PledgeDispatchProps {
  pledgeProject: any;
}

interface PledgeState {
  hours?: number;
}

export interface PledgeBody {
  project_id: string;
  hours: number;
}

export class PledgeDialog extends React.Component<PledgeProps & PledgeDispatchProps, PledgeState> {
  constructor(props: PledgeProps & PledgeDispatchProps) {
    super(props);
    this.state = { hours: 0 };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    if (event.target.value === null) {
      this.setState({ hours: 0 });
    } else {
      this.setState({ hours: parseInt(event.target.value, 10) });
    }
  }

  handleSubmit(event:any) {
    const body = {
      project_id: this.props.project.project_id,
      hours: this.state.hours,
    };
    if (body.hours != null && body.hours !== 0) {
      this.props.pledgeProject(body);
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
          <Button onClick={this.handleSubmit}>
            Pledge
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    pledgeProject: (body: PledgeBody) => dispatch(pledgeProjectAction(body)),
  };
};

export default connect<{}, PledgeDispatchProps, PledgeProps>(null, mapDispatchToProps)(PledgeDialog);

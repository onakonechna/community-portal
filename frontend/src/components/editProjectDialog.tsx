import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';

import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
// import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
// import { FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';

// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';

const styles = (theme: any) => ({
  chip: {
    margin: '5px 5px',
  },
  textField: {
    width: 200,
  },
});

interface EditDialogProps {
  classes?: any;
  open: boolean;
  toggleEdit?: () => void;
  project?: any;
}

interface EditDialogState {
  open: boolean;
  success: boolean;
  loading: boolean;
  technologies: Technology[];
  technologiesString: string;
  size: string;
  name: string;
  description: string;
  due: string;
  goal: number;
  github: string;
  slack: string;
  [key: string]: boolean | string | number | Technology[];
}

interface Technology {
  key?: number;
  type: string;
}

export class EditProjectDialog extends React.Component<EditDialogProps, EditDialogState> {
  constructor(props: EditDialogProps) {
    super(props);
    this.state = {
      open: false,
      success: false,
      loading: false,
      technologies: [],
      technologiesString: '',
      size: '',
      name: this.props.project.name,
      description: '',
      due: '',
      goal: 0,
      github: '',
      slack: '',
      key: 0,
    };
  }

  handleChange(field: string) {
    return (event: any) => {
      if (field === 'technologies') {
        if (event.target.value.slice(-1) === ' ') {
          const technologies = this.state.technologies;
          technologies[technologies.length] =
          { key: technologies.length, type: event.target.value.slice(0, -1) };
          this.setState({
            technologies,
            technologiesString: '',
          });
        } else {
          this.setState({
            technologiesString: event.target.value,
          });
        }
      } else if (field === 'goal') {
        if (event.target.value === 'NaN') {
          this.setState({ goal: 0 });
        } else {
          this.setState({ goal: parseInt(event.target.value, 10) });
        }
      } else {
        this.setState({
          [field]: event.target.value,
        });
      }
    };
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          fullWidth={false}
          maxWidth={'sm'}
        >
          <DialogTitle id="edit-dialog-title">Edit Project</DialogTitle>
          <DialogContent>
            <Button onClick={this.props.toggleEdit}>Close Me</Button>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Input Project Title"
              onChange={this.handleChange('name')}
              type="text"
              value={this.state.name}
              fullWidth
            />
          </DialogContent>
        </Dialog>
      </div>
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

export default compose<{}, EditDialogProps>(
  withStyles(styles, {
    name: 'EditProjectDialog',
  }),
  connect<{}, {}, EditDialogProps>(mapStateToProps, mapDispatchToProps),
)(EditProjectDialog);

import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { editProjectBody } from '../actions';

import { withStyles } from '@material-ui/core/styles';

import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';

const styles = (theme: any) => ({
  chip: {
    margin: '5px 5px',
  },
  textField: {
    width: 200,
  },
});

interface DispatchProps {
  editProject: any;
}

interface EditDialogProps {
  classes?: any;
  open: boolean;
  toggleEdit: () => void;
  project?: any;
}

interface EditDialogState {
  success: boolean;
  loading: boolean;
  technologies: string[];
  technologiesString: string;
  size: string;
  name: string;
  description: string;
  due: string;
  goal: number;
  github: string;
  slack: string;
  [key: string]: boolean | string | number | string[];
}

export class EditProjectDialog extends React.Component<DispatchProps & EditDialogProps, EditDialogState> {
  constructor(props: DispatchProps & EditDialogProps) {
    super(props);
    const { project } = this.props;
    this.state = {
      success: false,
      loading: false,
      technologies: project.technologies,
      technologiesString: '',
      size: project.size,
      name: project.name,
      description: project.description,
      due: this.handleReadTime(project.due),
      goal: project.estimated,
      github: project.github_address,
      slack: project.slack_channel,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoalChange = this.handleGoalChange.bind(this);
    this.handleTechChange = this.handleTechChange.bind(this);
  }

  handleChange(field: string) {
    return (event: any) => {
      const newItem = event.target.value;
      this.setState({
        [field]: newItem,
      });
    };
  }

  handleTechChange() {
    return (event: any) => {
      const newItem = event.target.value;
      this.setState({
        technologiesString: newItem,
      });
    };
  }

  handleGoalChange() {
    return (event: any) => {
      const newItem = event.target.value;
      if (newItem === 'NaN') {
        this.setState({ goal: 0 });
      } else {
        this.setState({ goal: parseInt(newItem, 10) });
      }
    };
  }

  handleDelete(tech: string) {
    return () => {
      const technologies = _.without(this.state.technologies, tech);
      this.setState({ technologies });
    };
  }

  handleKeyPress(event: any) {
    const newItem = event.target.value;
    if (event.key === 'Enter') {
      const technologies = this.state.technologies;
      if (technologies.indexOf(newItem) !== -1) return;
      this.setState((prevState: EditDialogState) => ({
        technologies: [
          ...prevState.technologies,
          newItem,
        ],
        technologiesString: '',
      }));
    }
  }

  handleReadTime(timestamp: number) {
    return new Date(timestamp).toISOString().substr(0, 10);
  }

  handleSubmit() {
    const { project_id } = this.props.project;
    const body = {
      project_id,
      name: this.state.name,
      description: this.state.description,
      size: this.state.size,
      due: new Date(this.state.due).getTime(),
      technologies: this.state.technologies,
      github_address: this.state.github,
      estimated: this.state.goal,
      slack_channel: this.state.slack,
    };
    this.props.editProject(body)
      .then((res: any) => {
        this.setState((prevState: EditDialogState) => ({
          success: true,
          loading: false,
        }), () => {
          this.props.toggleEdit();
          this.setState((prevState: EditDialogState) => ({
            success: false,
          }));
        });
      })
      .catch((err: Error) => {
        this.setState({
          success: false,
          loading: false,
        });
      });
  }

  render() {
    const { classes, open } = this.props;
    const { project_id } = this.props.project;
    return (
      <div>
        <Dialog
          className={classes.dialog}
          open={open}
          fullWidth={false}
          maxWidth={'md'}
        >
          <DialogTitle id="edit-dialog-title">Edit Project</DialogTitle>
          <DialogContent>
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
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Input Project Description"
              onChange={this.handleChange('description')}
              type="text"
              value={this.state.description}
              fullWidth
            />
            {this.state.technologies.map(technology => (
              <Chip
                className={classes.chip}
                onDelete={this.handleDelete(technology)}
                key={`${project_id}-${technology}`}
                label={technology} />
            ))}
            <TextField
              required
              margin="dense"
              id="technologies"
              label="Input Technologies for this Project (Separate by Enter)"
              onChange={this.handleTechChange()}
              onKeyPress={this.handleKeyPress}
              value={this.state.technologiesString}
              type="text"
              fullWidth
            />
            <TextField
              required
              id="due"
              label="Due Date"
              type="date"
              className={classes.textField}
              onChange={this.handleChange('due')}
              value={this.state.due}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              margin="dense"
              id="goal"
              label="Goal (total hours)"
              type="number"
              onChange={this.handleGoalChange()}
              value={this.state.goal}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Size</FormLabel>
              <RadioGroup
                aria-label="size"
                name="size"
                value={this.state.size}
                onChange={this.handleChange('size')}
                style={{ flexDirection: 'row' }}
              >
                <FormControlLabel value="S" control={<Radio />} label="Small" />
                <FormControlLabel value="M" control={<Radio />} label="Medium" />
                <FormControlLabel value="L" control={<Radio />} label="Large" />
                <FormControlLabel value="XL" control={<Radio />} label="Extra Large" />
              </RadioGroup>
            </FormControl>
            <TextField
              required
              margin="dense"
              id="github"
              label="Input GitHub Address"
              onChange={this.handleChange('github')}
              value={this.state.github}
              type="text"
              fullWidth
            />
            <TextField
              required
              margin="dense"
              id="slack"
              label="Input Slack Channel"
              type="text"
              onChange={this.handleChange('slack')}
              value={this.state.slack}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            {this.state.loading && <LinearProgress
              style={{ display: 'block', width: '60%' }}
              variant="indeterminate" />}
            <Button onClick={this.props.toggleEdit}>
              {this.state.success ? 'Done' : 'Cancel'}
            </Button>
            <Button onClick={this.handleSubmit}>
              {this.state.success ? 'Saved' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    editProject: (project: any) => dispatch(editProjectBody(project)),
  };
};

export default compose<{}, EditDialogProps>(
  withStyles(styles, {
    name: 'EditProjectDialog',
  }),
  connect<{}, DispatchProps, EditDialogProps>(null, mapDispatchToProps),
)(EditProjectDialog);

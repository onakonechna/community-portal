import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { addProject } from '../actions';
import AddProjectButton from './AddProjectButton';

import { withStyles } from '@material-ui/core/styles';

import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, FormControlLabel, FormLabel,
} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  addProject: any;
}

interface DialogProps {
  classes?: any;
}

interface DialogState {
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

export class AddProjectDialog extends React.Component<DispatchProps & DialogProps, DialogState> {
  constructor(props: DispatchProps & DialogProps) {
    super(props);
    const state = {
      open: false,
      technologies: [],
      technologiesString: '',
      size: 'S',
      success: false,
      loading: false,
      name: '',
      description: '',
      due: '',
      goal: 0,
      github: '',
      slack: '',
    };
    this.state = state;
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleTechSubmission = this.handleTechSubmission.bind(this);
  }

  handleChange(field: string) {
    return (event: any) => {
      const newItem = event.target.value;
      if (field === 'technologies') {
        if (newItem.slice(-1) === ' ') {
          const technologies = this.state.technologies;
          const techList = technologies.map(t => t.type);
          if (techList.indexOf(newItem.slice(0, -1)) !== -1) return;
          this.setState((prevState:DialogState) => ({
            technologies: [
              ...prevState.technologies,
              { key: prevState.technologies.length, type: newItem.slice(0, -1) },
            ],
            technologiesString: '',
          }));
        } else {
          this.setState({
            technologiesString: newItem,
          });
        }
      } else if (field === 'goal') {
        if (newItem === 'NaN') {
          this.setState({ goal: 0 });
        } else {
          this.setState({ goal: parseInt(newItem, 10) });
        }
      } else {
        this.setState({
          [field]: newItem,
        });
      }
    };
  }

  handleDelete(tech:string) {
    return () => {
      const technologies = this.state.technologies.filter((t) => {
        return t.type !== tech;
      });
      this.setState({ technologies });
    };
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }
  handleTechSubmission(technologies: Technology[]) {
    return technologies.map((tech) => {
      return tech.type;
    });
  }

  handleSave() {
    if (!this.state.loading) {
      this.setState((prevState:DialogState) => ({
        success: false,
        loading: true,
      }));

      const tech: Technology[] = [];
      this.state.technologies.map((technology) => {
        tech.push({ type: technology.type });
      });

      const data = {
        name: this.state.name,
        description: this.state.description,
        size: this.state.size,
        due: new Date(this.state.due).getTime() / 1000,
        technologies: this.handleTechSubmission(tech),
        github_address: this.state.github,
        estimated: this.state.goal,
        slack_channel: this.state.slack,
      };
      this.props.addProject(data)
        .then((response: any) => {
          this.setState({
            success: true,
            loading: false,
          });
          const state = {
            open: false,
            technologies: [],
            technologiesString: '',
            size: 'S',
            success: false,
            loading: false,
            name: '',
            description: '',
            due: '',
            goal: 0,
            github: '',
            slack: '',
          };
          this.setState(state);
        })
        .catch((error: any) => {
          this.setState({
            success: false,
            loading: false,
          });
          console.log(error);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { loading, success } = this.state;
    return (
      <div>
        <AddProjectButton onClick={this.handleClickOpen} />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth={true}
          maxWidth={'md'}
        >
          <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Input Project Title"
              type="text"
              value={this.state.name}
              onChange={this.handleChange('name')}
              fullWidth
            />
            <TextField
              required
              id="description"
              label="Input Project Description"
              multiline
              rows="4"
              value={this.state.description}
              onChange={this.handleChange('description')}
              margin="normal"
              fullWidth
            />
            {this.state.technologies.map(technology => (
              <Chip
                className={classes.chip}
                onDelete={this.handleDelete(technology.type)}
                key={technology.key}
                label={technology.type}
                />
            ))}
            <TextField
              required
              margin="dense"
              id="technologies"
              label="Input Technologies for this Project (Separate by space)"
              onChange={this.handleChange('technologies')}
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
              onChange={this.handleChange('goal')}
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
            <Button onClick={this.handleClose} color="primary">
              {success ? 'Done' : 'Cancel'}
            </Button>
            <Button
              color="primary"
              disabled={loading}
              onClick={this.handleSave}
            >
              {success ? 'Saved' : 'Save'}
            </Button>
            {loading && <CircularProgress size={24} />}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addProject: (project: any) => dispatch(addProject(project)),
  };
};

export default compose<{}, DialogProps>(
  withStyles(styles, {
    name: 'AddProjectDialog',
  }),
  connect<{}, DispatchProps, DialogProps>(null, mapDispatchToProps),
)(AddProjectDialog);
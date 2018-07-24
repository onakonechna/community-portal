import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { editProjectBody } from '../actions';

import { withStyles, Theme } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Calendar from '@material-ui/icons/DateRange';
import Close from '@material-ui/icons/Close';

const styles = (theme: Theme) => ({
  actions: {

  },
  addButton: {
    'margin-left': 'auto',
  },
  cardButton: {
    color: '#27A2AA',
  },
  calendarIcon: {
    position: 'absolute' as 'absolute',
    right: '1rem',
    top: '2rem',
    width: '1.5rem',
    height: '1.5rem',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  saveButton: {
    'background-color': '#F16321',
    color: '#FFFFFF',
    'margin-left': '1rem',
  },
  content: {
    margin: 'auto 1rem 1rem 1rem',
  },
  exitButton: {
    'line-height': '1rem',
    'margin-left': 'auto',
    'min-width': '2rem',
    padding: 0,
  },
  chip: {
    'background-color': '#DBEFEE',
    'border-radius': '5px',
    'font-size': '1rem',
    'font-weight': '300',
    margin: '5px 5px',
    'text-transform': 'capitalize',
  },
  input: {
    border: '0.1rem solid #E0E0E0',
    'border-radius': '5px',
  },
  goalInput: {
    border: '0.1rem solid #E0E0E0',
    'border-radius': '5px',
    'text-align': 'center',
  },
  label: {
    'font-family': 'system-ui',
    'font-size': '0.875rem',
    'font-weight': '500',
    margin: '0.3rem auto',
  },
  row: {
    'flex-wrap': 'wrap',
    'flex-direction': 'row',
  },
  rowItem: {
    display: 'inline-block',
    width: '33.3%',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      'margin-right': '1rem',
    },
  },
  select: {
    border: '0.1rem solid #E0E0E0',
    'border-radius': '5px',
    width: '90%',
  },
  textField: {
    width: 200,
  },
  title: {
    display: 'flex',
    'font-weight': '300',
    'font-size': '1.75rem',
    'font-family': 'system-ui',
    width: '40rem',
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
          maxWidth={'md'}
        >
         <div className={classes.content}>
          <DialogTitle
            disableTypography
            id="form-dialog-title"
            className={classes.title}>
            New Project
            <Button
              className={classes.exitButton}
              onClick={this.props.toggleEdit}
            >
              <Close />
           </Button>
           </DialogTitle>
          <DialogContent>
            <Typography className={classes.label}>Project Name*</Typography>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              InputProps={{ className:classes.input }}
              required
              type="text"
              value={this.state.name}
              onChange={this.handleChange('name')}
              fullWidth
              />
            <Typography className={classes.label}>Description</Typography>
            <TextField
              id="description"
              InputProps={{ className:classes.input }}
              multiline
              rows="4"
              value={this.state.description}
              onChange={this.handleChange('description')}
              margin="normal"
              fullWidth
            />
            <Typography className={classes.label}>Technologies (separated by Enter)</Typography>
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
<<<<<<< HEAD
              label="Input Technologies for this Project (Separate by Enter)"
              onChange={this.handleTechChange()}
=======
              onChange={this.handleChange('technologies')}
>>>>>>> c1a9b57ed9113cdd1df47fac39d2f6f57ef2ff9b
              onKeyPress={this.handleKeyPress}
              value={this.state.technologiesString}
              type="text"
              fullWidth
            />
<<<<<<< HEAD
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
=======

              <div className={classes.row}>
                <div className={classes.rowItem} style={{ position: 'relative' }}>
                  <Typography className={classes.label}>Due Date*</Typography>
                  <Calendar className={classes.calendarIcon}/>
                  <TextField
                    required
                    id="due"
                    type="date"
                    InputProps={{ className:classes.input }}
                    className={classes.textField}
                    onChange={this.handleChange('due')}
                    value={this.state.due}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className={classes.rowItem}>
                  <Typography className={classes.label}>Goal(total hours)*</Typography>
                  <TextField
                    required
                    id="goal"
                    type="number"
                    InputProps={{ className:classes.goalInput }}
                    onChange={this.handleChange('goal')}
                    value={this.state.goal}
                  />
                </div>
                <div className={classes.rowItem}>
                  <Typography className={classes.label}>Size</Typography>
                  <Select
                    className={classes.select}
                    value={this.state.size}
                    onChange={this.handleChange('size')}
                  >
                    <MenuItem value="S">Small</MenuItem>
                    <MenuItem value="M">Medium</MenuItem>
                    <MenuItem value="L">Large</MenuItem>
                    <MenuItem value="XL">Extra Large</MenuItem>
                  </Select>
                </div>
              </div>
            <Typography className={classes.label}>GitHub Address*</Typography>
              <TextField
                required
                margin="dense"
                id="github"
                type="text"
                InputProps={{ className:classes.input }}
                onChange={this.handleChange('github')}
                value={this.state.github}
                fullWidth
              />
              <Typography className={classes.label}>Slack Channel*</Typography>
              <TextField
                required
                margin="dense"
                id="slack"
                type="text"
                InputProps={{ className:classes.input }}
                onChange={this.handleChange('slack')}
                value={this.state.slack}
                fullWidth
              />
>>>>>>> c1a9b57ed9113cdd1df47fac39d2f6f57ef2ff9b
          </DialogContent>
          <DialogActions>
            {this.state.loading && <LinearProgress
              style={{ display: 'block', width: '60%' }}
<<<<<<< HEAD
              variant="indeterminate" />}
            <Button onClick={this.props.toggleEdit}>
=======
              variant="indeterminate"/>}
            <Button
              onClick={this.props.toggleEdit}
              className={classes.cardButton}
            >
>>>>>>> c1a9b57ed9113cdd1df47fac39d2f6f57ef2ff9b
              {this.state.success ? 'Done' : 'Cancel'}
            </Button>
            <Button
              onClick={this.handleSubmit}
              className={classes.saveButton}
              >
              {this.state.success ? 'Saved' : 'Save'}
            </Button>
          </DialogActions>
          </div>
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

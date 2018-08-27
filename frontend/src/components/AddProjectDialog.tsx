import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { addProject } from '../actions';
import AddProjectButton from './buttons/AddProjectButton';
import Message from './Message';
import { loadStarredProjects } from '../actions/user'

import { withStyles, Theme } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Close from '@material-ui/icons/Close';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

import RichEditor from './RichEditor';

const styles = (theme: Theme) => ({
  actions: {

  },
  addButton: {
    'margin-left': 'auto',
  },
  cardButton: {
    color: '#27A2AA',
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
    'border-radius': '5px',
  },
  goalInput: {
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
  addProject: any;
  loadStarredProjects: any;
}

interface DialogProps {
  classes?: any;
  className?: any;
  handler?: any;
  style?: any;
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
  richDescription: any;
  due: Date;
  goal: number;
  github: string;
  slack: string;
  [key: string]: boolean | Date | string | number | Technology[];
  errorMessage: string;
  messageOpen: boolean;
}

interface Technology {
  key?: number;
  type: string;
}

const state = {
  open: false,
  technologies: [],
  technologiesString: '',
  size: 'S',
  success: false,
  loading: false,
  name: '',
  description: '',
  richDescription: {} as any,
  due: new Date(),
  goal: 0,
  github: '',
  slack: '',
  errorMessage: '',
  messageOpen: false,
};

export class AddProjectDialog extends React.Component<DispatchProps & DialogProps, DialogState> {
  constructor(props: DispatchProps & DialogProps) {
    super(props);
    this.state = state;
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleGoalChange = this.handleGoalChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleTechChange = this.handleTechChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleTechSubmission = this.handleTechSubmission.bind(this);
    this.setLoadingState = this.setLoadingState.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
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

  handleDescriptionChange(description:string) {
    this.setState({
      description,
    });
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

  handleDateChange(setDate: Date) {
    this.setState({
      due: setDate,
    });
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

  handleKeyPress(event: any) {
    const newItem = event.target.value;
    if (event.key === 'Enter') {
      const technologies = this.state.technologies;
      const techList = technologies.map(t => t.type);
      if (techList.indexOf(newItem) !== -1) return;
      this.setState((prevState:DialogState) => ({
        technologies: [
          ...prevState.technologies,
          { key: prevState.technologies.length, type: newItem },
        ],
        technologiesString: '',
      }));
    }
  }

  handleTechSubmission(technologies: Technology[]) {
    return technologies.map((tech) => {
      return tech.type;
    });
  }

  handleSave() {
    if (!this.state.loading) {
      this.setLoadingState(false, true);
      const data = this.prepareData();
      this.props.addProject(data)
        .then((response: any) => {
          this.props.loadStarredProjects();
          this.setLoadingState(true, false);
          this.setState(state);
        })
        .catch((error: Error) => {
          this.setLoadingState(false, false);
          this.onFailure(new Error('Something went wrong while saving this project'));
        });
    }
  }

  prepareData() {
    const tech: Technology[] = [];
    this.state.technologies.map((technology) => {
      tech.push({ type: technology.type });
    });

    const data = {
      name: this.state.name,
      description: this.state.description,
      size: this.state.size,
      due: this.state.due.getTime(),
      technologies: this.handleTechSubmission(tech),
      github_address: this.state.github,
      estimated: this.state.goal,
      slack_channel: this.state.slack,
    };

    return data;
  }

  setLoadingState(success:boolean, loading:boolean) {
    this.setState({
      success,
      loading,
    });
  }

  handleMessageChange(message: string) {
    this.setState({
      messageOpen: true,
      errorMessage: message,
    });
  }

  handleMessageClose() {
    this.setState({
      messageOpen: false,
    });
  }

  onFailure(error: Error) {
    this.handleMessageChange(error.message);
  }

  render() {
    const { classes } = this.props;
    const { loading, success } = this.state;
    return (
      <div className={classes.addButton}>
        <AddProjectButton onClick={this.props.handler || this.handleClickOpen} />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
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
                onClick={this.handleClose}
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
              <RichEditor update={(output:string) => this.handleDescriptionChange(output)}/>
              <Typography className={classes.label}>Technologies (separated by Enter)</Typography>
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
                InputProps={{ className:classes.input }}
                id="technologies"
                onChange={this.handleTechChange()}
                onKeyPress={this.handleKeyPress}
                value={this.state.technologiesString}
                type="text"
                fullWidth
              >
              </TextField>
              <div className={classes.row}>
                <div className={classes.rowItem} style={{ position: 'relative' }}>
                  <Typography className={classes.label}>Due Date*</Typography>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      id="due"
                      onChange={this.handleDateChange}
                      value={this.state.due}
                      format="YYYY/MM/DD"
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className={classes.rowItem}>
                  <Typography className={classes.label}>Goal(total pledgers)*</Typography>
                  <TextField
                    required
                    id="goal"
                    type="number"
                    InputProps={{ className:classes.goalInput }}
                    onChange={this.handleGoalChange()}
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
            </DialogContent>
            <DialogActions className={classes.actions}>
              {loading && <LinearProgress
                style={{ display: 'block', width: '60%' }}
                variant="indeterminate"/>}
              <Button
                onClick={this.handleClose}
                className={classes.cardButton}
              >
                {success ? 'Done' : 'Cancel'}
              </Button>
              <Button
                className={classes.saveButton}
                disabled={loading}
                onClick={this.handleSave}
              >
                {success ? 'Saved' : 'Save'}
              </Button>
            </DialogActions>
          </div>
        </Dialog>
        <Message
          message={this.state.errorMessage}
          open={this.state.messageOpen}
          handleClose={this.handleMessageClose}
        />
      </div>
    );
  }
}

export default compose<{}, DialogProps>(
  withStyles(styles, {
    name: 'AddProjectDialog',
  }),
  connect<{}, DispatchProps, DialogProps>(null, {loadStarredProjects, addProject}),
)(AddProjectDialog);

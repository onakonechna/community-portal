import * as React from 'react';

// import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
// import { Input, InputLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
// import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
// import green from '@material-ui/core/colors/green';

// import { withStyles } from '@material-ui/core';
// import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';

// import CheckIcon from '@material-ui/icons/Check';
// import SaveIcon from '@material-ui/icons/Save';

const styles = {
	textField: {
    width: 200,
	}
};

  interface IProps {
      classes: any
  }

  interface IState {
      open: boolean,
      success: boolean,
      loading: boolean,
      technologies: ITech[],
      technologiesString: string,
			size: string,
			name: string,
			description: string,
			due: string,
			goal: number,
			github: string,
			slack: string,
			[key: string]: boolean | string | number | ITech[]
  }

  interface ITech {
      key: number,
      label: string
  }

  class AddProjectDialog extends React.Component<IProps, IState> {
      constructor(props: IProps) {
					super(props);
          const state = {
            open: true,
            technologies: [
              { key: 0, label: 'Angular' },
              { key: 1, label: 'jQuery' },
              { key: 2, label: 'Polymer' },
              { key: 3, label: 'React' },
              { key: 4, label: 'Vue.js' },
            ],
            "technologiesString": "",
            "size": "S",
            success: false,
						loading: false,
						name: '',
						description: '',
						due: '',
						goal: 0,
						github: '',
						slack: ''
          };
					this.state = state;
					this.handleChange = this.handleChange.bind(this);
					this.handleClose = this.handleClose.bind(this);
			}

			handleChange(field: string) {
				return (event: any) => {
					if (field === "technologies") {
						if (event.target.value.slice(-1) === " ") {
							const technologies = this.state.technologies;
							technologies[technologies.length] = {key: technologies.length, label: event.target.value}
							this.setState({
									technologies,
									"technologiesString": "",
								});
						} else {
							this.setState({
								"technologiesString": event.target.value,
							});
						}
					} else {
						console.log(event.target.value);
						this.setState({
							[field]: event.target.value,
						});
					}
				}
			}

			handleClose() {
				this.setState({ open: false });
			}

      render() {
					const { classes } = this.props;
					const { loading, success } = this.state;
          return (
            <Dialog
							open={this.state.open}
							onClose={this.handleClose}
							fullWidth={true}
							maxWidth={'md'}
            >
							<DialogTitle id="fyorm-dialog-title">Create Project</DialogTitle>
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
								<TextField
									required
									margin="dense"
									id="technologies"
									label="Input Technologies for this Project"
									onChange={this.handleChange("technologies")}
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
									onChange={this.handleChange("due")}
									value={this.state.due}
									InputLabelProps={{
										shrink: true,
									}}
								/>
								 <TextField
        					required
									margin="dense"
									id="name"
									label="Goal (total hours)"
									type="text"
									onChange={this.handleChange("goal")}
									value={this.state.goal}
								/>
								<FormControl component="fieldset">
									<FormLabel component="legend">Size</FormLabel>
									<RadioGroup 
										aria-label="size"
										name="size"
										value={this.state.size}
										onChange={this.handleChange("size")}
									>
										<FormControlLabel value="S" control={<Radio />} label="Small"/>
										<FormControlLabel value="M" control={<Radio />} label="Medium"/>
										<FormControlLabel value="L" control={<Radio />} label="Large"/>
										<FormControlLabel value="XL" control={<Radio />} label="Extra Large"/>
									</RadioGroup>
								</FormControl>
								 <TextField
									required
										margin="dense"
										id="github"
										label="Input GitHub Address"
										onChange={this.handleChange("github")}
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
										onChange={this.handleChange("slack")}
										value={this.state.slack}
										fullWidth
									/>
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleClose} color="primary">
									{success ? "Done" : "Cancel"}
								</Button>
								<Button
									color="primary"
									disabled={loading}
								>
									{success ? "Saved" : "Save"}
								</Button>
								{loading && <CircularProgress size={24} />}

							</DialogActions>
            </Dialog>    
          )
      }
  }

  export default withStyles(styles)(AddProjectDialog);


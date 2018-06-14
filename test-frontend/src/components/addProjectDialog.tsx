import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import axios from 'axios';

import { addProject } from '../actions';
import AddProjectButton from './addProjectButton';

import { withStyles } from '@material-ui/core/styles';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
// import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
// import ChipInput from 'material-ui-chip-input'

const styles = (theme: any) => ({
	textField: {
    width: 200,
	}
});

   interface IDispatchProps {
	  addProject: any
   }

  interface IProps {
	classes?: any,
	handler: () => void
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
      key?: number,
      label: string
  }

  class AddProjectDialog extends React.Component<IDispatchProps & IProps, IState> {
      constructor(props: IDispatchProps & IProps) {
					super(props);
          const state = {
            open: false,
            technologies: [],
            technologiesString: '',
            size:'S',
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
					this.handleClickOpen = this.handleClickOpen.bind(this);
					this.handleChange = this.handleChange.bind(this);
					this.handleClose = this.handleClose.bind(this);
					this.handleSave = this.handleSave.bind(this);
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
						this.setState({
							[field]: event.target.value,
						});
					}
				}
			}

			handleClickOpen() {
				this.setState({ open: true });
			};

			handleClose() {
				this.setState({ open: false });
			}

			handleSave() {
				console.log(this.state)
				if (!this.state.loading) {
					this.setState({
							success: false,
							loading: true,
					});

					const tech: ITech[] = [];
					this.state.technologies.map(technology => {
						tech.push({"label":technology.label})
					})

					const data = {
						"name": this.state.name,
						"description": this.state.description,

						"slack": this.state.slack,
						"github": this.state.github,
						"size": this.state.size,
						"created": this.state.created,

						"due": this.state.due,
						"estimate": this.state.goal,
						"child_List": [
						],
						"technologies_List": tech
					}
					this.props.addProject(data);
					const headers = {
						headers:
						{
							'Authorization': 'CALiveAPICreator thS3Wxrp2n9mnjVDQ0ap:1',
							'Content-Type': 'application/json'
						}
					}
					axios.post('http://localhost:3030/rest/default/mkeze/v1/project_with_contributors', JSON.stringify(data), headers)
					.then(response => {
						this.setState({
								success: true,
								loading: false,
							});
							this.props.handler();
							const state = {
								open: false,
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
							};
							this.setState(state);
						})
					.catch(error => {
						this.setState(
							{
								success: false,
								loading: false,
							})
						console.log(error);
					});
				}
			};

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
								label="Input Technologies for this Project (Separate by space)"
								onChange={this.handleChange("technologies")}
								value={this.state.technologiesString}
								type="text"
								fullWidth
							/>
							{/* <ChipInput
								required
								margin="dense"
								id="technologies1"
								label="Input Technologies for this Project (Separate by space)"
								onChange={this.handleChange("technologies")}
								value={this.state.technologiesString}
								type="text"
								fullWidth
							/> */}
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
								onClick={this.handleSave}
							>
								{success ? "Saved" : "Save"}
							</Button>
							{loading && <CircularProgress size={24} />}
						</DialogActions>
					</Dialog>
				</div>
		)
      }
  }

const mapStateToProps = (state: any) => {
	return {

	}
}

const mapDispatchToProps = (dispatch: any) => {
	return {
		addProject: (project: any) => dispatch(addProject(project))
	}
}


export default compose<{}, IProps>(
	withStyles(styles, {
		name: 'AddProjectDialog'
	}),
	connect<{}, IDispatchProps, IProps>(mapStateToProps, mapDispatchToProps)
)(AddProjectDialog);

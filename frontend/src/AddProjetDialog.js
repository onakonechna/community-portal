import React from 'react';
import AddProjectButton from './AddProjectButton'
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input, { InputLabel } from 'material-ui/Input';
import green from 'material-ui/colors/green';
import CheckIcon from 'material-ui-icons/Check';
import SaveIcon from 'material-ui-icons/Save';
import { CircularProgress } from 'material-ui/Progress';
import axios from 'axios'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
  dialog: {
    paperWidthMd: 480,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class AddProjetDialog extends React.Component {
   constructor(props) {
      super(props);
      console.log('here are the props:', props.handler)
      let state = {
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
      this.state = state;
      this.handleClickOpen = this.handleClickOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleChange = this.handleChange.bind(this)
      this.handleSave = this.handleSave.bind(this)
      this.updateParent = props.handler
    };

    handleChange(name) {
      return (event) => {
        if (name == "technologies") {
          if (event.target.value.slice(-1) == " ") {
            let technologies = this.state.technologies;
            technologies[technologies.length] = {key: technologies.length, label: event.target.value}
            this.setState({
                technologies: technologies,
                "technologiesString": "",
              });
          } else {
            this.setState({
              "technologiesString": event.target.value,
            });
          }
        } else {
          this.setState({
            [name]: event.target.value,
          });
        }
      }
      //console.log(this.state)
      
      //console.log(event.target.vale);
      // if (name == 'technologies') {
      //   console.log(event);
      // }
      // this.setState({
      //   [name]: event.target.value,
      // });
    };
  
    handleClickOpen() {
      this.setState({ open: true });
    };
  
    handleClose() {
      this.setState({ open: false });
    };

    handleSave() {
      console.log(this.state)
      //this.setState({ open: false });
      if (!this.state.loading) {
        this.setState(
          {
            success: false,
            loading: true,
          },
          
          // () => {
          //   this.timer = setTimeout(() => {
          //     this.setState({
          //       loading: false,
          //       success: true,
          //     });
          //   }, 2000);
          // },
        );

        var tech = []
        this.state.technologies.map(technology => {
          tech.push({"name":technology.label})
        })

        var data = {
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
        
        var headers = {
          headers:  
          {
            'Authorization': 'CALiveAPICreator thS3Wxrp2n9mnjVDQ0ap:1', 
            'Content-Type': 'application/json'
          }
        }
        axios.post('http://localhost:8080/rest/default/mkeze/v1/project_with_contributors', JSON.stringify(data), headers)
        .then(response => {
          this.setState(
            {
              success: true,
              loading: false,
            })

          // var tech = []
          // this.state.technologies.map(technology => {
          //   tech.push({"name":technology.label, "project_ident": response.data.txsummary[0].ident})
          // })
          // axios.post('http://localhost:8080/rest/default/mkeze/v1/main:technologies', JSON.stringify(tech), headers)
          // .then(response => {this.setState(
          //   {
          //     success: true,
          //     loading: false,
          //   })
            this.updateParent()
            var state = {
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
            this.setState(state)
          
          })
          // .catch(error => {
          //     this.setState(
          //       {
          //         success: false,
          //         loading: false,
          //       })
          //     console.log(error);
          //   });
        //})
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

    handleDelete(data) {
      return () => {
        const techhnologies = [...this.state.technologies];
        const chipToDelete = techhnologies.findIndex((element) => {
           return element == data});
        techhnologies.splice(chipToDelete, 1);
        this.setState({ "technologies": techhnologies });
      }
    };

    // handleChange = name => event => {
    //   this.setState({
    //     [name]: event.target.value,
    //   });
    // };
  
    render() {
      const { classes } = this.props;
      const loading = this.state.loading;
      const success = this.state.success;
      const buttonClassname = classNames({
        [classes.buttonSuccess]: success,
      });
      return (
        <div>
        <AddProjectButton onClick={this.handleClickOpen} />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth = {'md'}
        >
          <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
          <DialogContent>
          {/* <div className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="name-simple">Name</InputLabel>
              <Input id="name-simple" value={this.state.name} onChange={this.handleChange} />
            </FormControl>
            <FormControl className={classes.formControl} aria-describedby="name-helper-text">
              <InputLabel htmlFor="name-helper">Name</InputLabel>
              <Input id="name-helper" value={this.state.name} onChange={this.handleChange} />
              <FormHelperText id="name-helper-text">Some important helper text</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} disabled>
              <InputLabel htmlFor="name-disabled">Name</InputLabel>
              <Input id="name-disabled" value={this.state.name} onChange={this.handleChange} />
              <FormHelperText>Disabled</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} error aria-describedby="name-error-text">
              <InputLabel htmlFor="name-error">Name</InputLabel>
              <Input id="name-error" value={this.state.name} onChange={this.handleChange} />
              <FormHelperText id="name-error-text">Error</FormHelperText>
            </FormControl>
          </div> */}
            {/* <DialogContentText>
              Fill the details of the project
            </DialogContentText> */}
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
              //placeholder="Description"
              value={this.state.description}
              onChange={this.handleChange('description')}
              margin="normal"
              fullWidth
            />
            <div>
              {this.state.technologies.map(data => {
                return (
                  <Chip
                    key={data.key}
                    label={data.label}
                    onDelete={this.handleDelete(data)}
                  />
                );
              })}
            </div>
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
      <br />
      <br />
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Size</FormLabel>
          <RadioGroup
            required
            aria-label="size"
            name="size"
            className={classes.group}
            value={this.state.size}
            onChange={this.handleChange("size")}
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
              label="Input Github Address"
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

        <div className={classes.wrapper}>
          <Button
            raised
            color="primary"
            className={buttonClassname}
            disabled={loading}
            onClick={this.handleSave}
          >
          {success ? "Saved" : "Save"}
          </Button>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
          </DialogActions>
        </Dialog>
      </div>
      )
    }
}

export default withStyles(styles)(AddProjetDialog);
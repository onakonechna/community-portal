import * as React from 'react';

// import axios from 'axios';

// import { withStyles } from '@material-ui/core/styles';

import { Dialog } from '@material-ui/core';
// import { FormControl, FormGroup, FormHelperText, FormLabel } from '@material-ui/core';
// import { Input, InputLabel } from '@material-ui/core';
// import Button from '@material-ui/core/Button';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import green from '@material-ui/core/colors/green';

// import { withStyles } from '@material-ui/core';
// import Paper from '@material-ui/core/Paper';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import TextField from '@material-ui/core/TextField';

// import CheckIcon from '@material-ui/icons/Check';
// import SaveIcon from '@material-ui/icons/Save';

// const styles = theme => ({

// })

  interface IProps {
      styles: any
  }

  interface IState {
      open: boolean,
      success: boolean,
      loading: boolean,
      technologies: ITech[],
      technologiesString: string,
      size: string,
    //   handleChange: VoidFunction,
    //   handleClickOpen: VoidFunction,
    //   handleClose: VoidFunction,
    //   handleSave: VoidFunction,
    //   updateParent: VoidFunction
  }

  interface ITech {
      key: number,
      label: string
  }

  class AddProjectDialog extends React.Component<IProps, IState> {
      constructor(props: IProps) {
          super(props);
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
          this.state = state;
			}
			handleClose() {
				this.setState({ open: false });
			}
      render() {
          return (
            <Dialog
							open={this.state.open}
							onClose={this.handleClose}
							fullWidth={true}
							maxWidth={'md'}
            >
                dr
            </Dialog>    
          )
      }
  }

  export default AddProjectDialog;


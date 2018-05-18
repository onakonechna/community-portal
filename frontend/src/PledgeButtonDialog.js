import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import axios from 'axios'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

export default class PledgeButtonDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false, pledged: 0};
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this)
  };

  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleSave() {
    
    
    var data = {
      "name": "vrann",
      "pledge": this.state.pledged,
      "project_ident": this.props.project
    }

    var headers = {
      headers:  
      {
        'Authorization': 'CALiveAPICreator thS3Wxrp2n9mnjVDQ0ap:1', 
        'Content-Type': 'application/json'
      }
    }

    console.log(data)
    axios.post('http://localhost:8080/rest/default/mkeze/v1/main:child', JSON.stringify(data), headers)
        .then(response => {
          this.setState(
            {
              success: true,
              loading: false,
            })
            //this.updateParent()
            this.setState({ open: false });
            this.props.handler()
          
          })
        .catch(error => {
          this.setState(
            {
              success: false,
              loading: false,
            })
          console.log(error);
        });
  };

  updatePledge(pledge) {
    return () => {
      var pledged = pledge
      if (pledge == "full") {
        pledged = this.props.estimated
      }
      this.setState({"pledged": pledged})
    }
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Pledge</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Pledge</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To pledge the hours you'd like to spend
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Pledged amount (in hours)"
              type="text"
              value={this.state.pledged}
              fullWidth
            />
            <Chip label="10 hours" onClick={this.updatePledge(10)}  />
            <Chip label="40 hours"  onClick={this.updatePledge(40)} />
            <Chip label="100 hours"  onClick={this.updatePledge(100)} />
            <Chip label="1oo %"  onClick={this.updatePledge("full")}  />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
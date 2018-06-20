import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ProjectsGrid from './ProjectsGrid';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui-icons/Add';
import MenuIcon from 'material-ui-icons/Menu';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import GitHubLogin from './github-auth-button';
import axios from 'axios';

const styles = {
    root: {
      width: '100%',
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    button: {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    },
  };

const onSuccess = response => {
    axios.post('https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev/authorize', {code: response}, {'Content-Type': 'application/json'})
        .then(data => {
            console.log(data);
        });
};
const onFailure = response => console.error(response);
const Crowdsourcing = () => (
    <div className={styles.root}>
    <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography type="title" color="inherit" className={styles.flex}>
            Magento Community Engineering Crowdsourcing
          </Typography>
          <Button color="inherit">Login</Button>
            <GitHubLogin
                clientId="" //Github auth application client_id
                scope="" //Github permission scopes
                redirectUri="" // Callback url, as example domain.com/auth
                onSuccess={onSuccess}
                onFailure={onFailure}/>
        </Toolbar>
      </AppBar>
    <ProjectsGrid />
    
    </div>

);

export default Crowdsourcing;


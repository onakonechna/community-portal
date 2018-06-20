import * as React from 'react';
import ProjectsGrid from './projectGrid';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';

import axios from 'axios';
import GitHubLogin from './github-auth-button';

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

const onSuccess = (response: any) => {
    axios.post('https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev/authorize', {code: response})
        .then(data => {
            console.log(data);
        });
};
const onFailure = (response: any) => console.error(response);
const Crowdsourcing = () => (
    <div style={styles.root}>
      <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton style={styles.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography color="inherit" style={styles.flex}>
              Magento Community Engineering Crowdsourcing
            </Typography>
            <Button color="inherit">Login</Button>
              <GitHubLogin
                  clientId="668e0b6c450cc783f267" // Github auth application client_id
                  scope="" // Github permission scopes
                  redirectUri="http://localhost:3030/auth" // Callback url, as example domain.com/auth
                  onSuccess={onSuccess}
                  onFailure={onFailure}/>
          </Toolbar>
        </AppBar>
      <ProjectsGrid />
    </div>

);

export default Crowdsourcing;

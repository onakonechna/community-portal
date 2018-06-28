import * as React from 'react';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

import AddProjectDialog from './AddProjectDialog';
import LoginButton from './buttons/LoginButton';
import UserAvatar from './UserAvatar';
import withAuth from './WithAuth';
import withLogin from './GithubAuthButton';
import { API } from './../api/config';

// callbacks for GithubAuthButton
export const onSuccess = (response: string) => {
  return axios.post(`${API}/authorize`, { code: response });
};
export const onFailure = (response: string) => console.error(response);

const Login = withAuth(['guest'])(withLogin(LoginButton));
const Avatar = withAuth(['user'])(UserAvatar);

const styles = {
};

const HeadBar = (props: any) => {
  const { classes } = props;
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography color="inherit" >
          Magento Opensource
        </Typography>
        <AddProjectDialog className={classes.addButton} />
        <Login
          clientId="668e0b6c450cc783f267" // Github auth application client_id
          scope="" // Github permission scopes
          redirectUri="http://localhost:3030/auth" // Callback url, as example domain.com/auth
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Avatar />
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(HeadBar);

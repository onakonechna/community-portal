import * as React from 'react';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

import AddProjectDialog from './AddProjectDialog';
import LoginButton from './buttons/LoginButton';
import withAuth from './WithAuth';
import withLogin from './GithubAuthButton';
import { API } from './../api/Config';
import Logo from './Logo';

declare const __FRONTEND__: string;
declare const GIT_ID: string;
export const gitId = GIT_ID;
export const frontEnd = __FRONTEND__;

export const onSuccess = (response: string) => {
  return axios.post(`${API}/authorize`, { code: response });
};
export const onFailure = (response: string) => console.error(response);

const AddProject = withAuth(['user', 'owner'])(AddProjectDialog);
const Login = withAuth(['guest'])(withLogin(LoginButton));

const styles = (theme:any) => ({
  appBar: {
    'font-family': 'system-ui',
    'box-shadow': 'none',
  },
});

const HeadBar = (props: any) => {
  const { classes } = props;
  return (
    <AppBar className={classes.appBar} position="static" color="secondary">
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Logo />
        <AddProject className={classes.addButton} />
        <Login
          clientId={gitId}
          scope=""
          redirectUri={`${frontEnd}/auth`}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(HeadBar);

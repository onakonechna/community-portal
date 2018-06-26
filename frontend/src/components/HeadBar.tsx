import * as React from 'react';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

import LoginButton from './buttons/LoginButton';
import withLogin from './GithubAuthButton';
import { API } from './../api/config';

// callbacks for GithubAuthButton
export const onSuccess = (response: any) => {
  return axios.post(`${API}/authorize`, { code: response });
};
export const onFailure = (response: any) => console.error(response);

const Login = withLogin(LoginButton);

const headBar = () => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography color="inherit" >
          Magento Opensource
            </Typography>
        <Login
          clientId="668e0b6c450cc783f267" // Github auth application client_id
          scope="" // Github permission scopes
          redirectUri="http://localhost:3030/auth" // Callback url, as example domain.com/auth
          onSuccess={onSuccess}
          onFailure={onFailure} />
      </Toolbar>
    </AppBar>
  </div>

);

export default headBar;

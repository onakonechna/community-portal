import * as React from 'react';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

import GithubAuthButton from './GithubAuthButton';
import { API } from './../api/config';

// callbacks for GithubAuthButton
const onSuccess = (response: any) => {
  axios.post(`${API}/authorize`, { code: response })
    .then((data: any) => {
      console.log(data);
    });
};
const onFailure = (response: any) => console.error(response);

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
            <GithubAuthButton
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

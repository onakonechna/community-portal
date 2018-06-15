import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

const HeadBar = () => (
    <div>
        <AppBar position="static" color="primary">
            <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
                <MenuIcon />
            </IconButton>
            <Typography color="inherit" >
                Magento Opensource
            </Typography>
            <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    </div>

);

export default HeadBar;


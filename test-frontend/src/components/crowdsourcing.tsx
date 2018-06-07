import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const MyTypography: any = Typography;

const Crowdsourcing = () => (
    <div>
        <AppBar position="static" color="primary">
            <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
                <MenuIcon />
            </IconButton>
            <MyTypography type="title" color="inherit" >
                -Magento Community Engineering Crowdsourcing
            </MyTypography>
            <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    </div>

);

export default Crowdsourcing;


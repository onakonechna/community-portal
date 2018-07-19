import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

import AddProjectDialog from './AddProjectDialog';
import LoginButton from './buttons/LoginButton';
import WithAuth from './WithAuth';
import withLogin from './GithubAuthButton';
import Logo from './Logo';
import SideBar from './SideBar';

const AddProject = WithAuth(['user', 'owner'])(AddProjectDialog);
const Login = WithAuth(['guest'])(withLogin(LoginButton));
const SideNav = WithAuth(['owner', 'user'])(SideBar);

const styles = (theme:any) => ({
  appBar: {
    'font-family': 'system-ui',
    'box-shadow': 'none',
  },
});

interface HeadBarProps {
  classes: any;
  history?: any;
}

interface HeadBarState {
  sideBarOpen: boolean;
}

class HeadBar extends React.Component<HeadBarProps, HeadBarState> {
  constructor(props: HeadBarProps & HeadBarState) {
    super(props);
    this.state = {
      sideBarOpen: false,
    },
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.toHome = this.toHome.bind(this);
    this.toProfile = this.toProfile.bind(this);
  }

  toggleSideBar() {
    this.setState((prevState: HeadBarState) => ({
      sideBarOpen: !prevState.sideBarOpen,
    }));
  }

  toHome() {
    this.props.history.push('.');
  }

  toProfile() {
    this.props.history.push('./profile');
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar className={classes.appBar} position="static" color="secondary">
        <Toolbar>
          <IconButton onClick={this.toggleSideBar} aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <SideNav
            open={this.state.sideBarOpen}
            toggleSideBar={this.toggleSideBar}
            toProfile={this.toProfile}
            toHome={this.toHome}
          />
          <Logo />
          <AddProject className={classes.addButton} />
          <Login />
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(HeadBar);

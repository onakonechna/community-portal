import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Home from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

import AddProjectDialog from './AddProjectDialog';
import LoginButton from './buttons/LoginButton';
import WithAuth from './WithAuth';
import withLogin from './GithubAuthButton';
import Logo from './Logo';
import SideBar from './SideBar';

const AddProject = WithAuth(['user', 'owner'], ['write:project'])(AddProjectDialog);
const Login = WithAuth(['guest'])(withLogin(LoginButton));
const SideNav = WithAuth(['owner', 'user'])(SideBar);

const styles = (theme:any) => ({
  appBar: {
    'font-family': 'system-ui',
    'box-shadow': 'none',
  },
  menuButton: {
    'margin-right': '1rem',
    [theme.breakpoints.down('sm')]: {
      'margin-right': '0',
    },
  },
  toolBar: {
    [theme.breakpoints.down('sm')]: {
      padding: '0',
    },
  },
  rightSide: {
    display: 'flex',
    'margin-left': 'auto',
  },
});

interface HeadBarProps {
  classes: any;
  location?: any;
  history?: any;
}

interface HeadBarStateProps {
  user: any;
}

interface HeadBarState {
  sideBarOpen: boolean;
}

class HeadBar extends React.Component<HeadBarProps & HeadBarStateProps, HeadBarState> {
  constructor(props: HeadBarProps & HeadBarStateProps & HeadBarState) {
    super(props);
    this.state = {
      sideBarOpen: false,
    },
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.toBookMark = this.toBookMark.bind(this);
    this.toHome = this.toHome.bind(this);
    this.toPledged = this.toPledged.bind(this);
    this.toProfile = this.toProfile.bind(this);
  }

  toggleSideBar() {
    this.setState((prevState: HeadBarState) => ({
      sideBarOpen: !prevState.sideBarOpen,
    }));
  }

  toBookMark() {
    this.props.history.push('./bookmarked');
  }

  toHome() {
    this.props.history.push('/');
  }

  toPledged() {
    this.props.history.push('./pledged');
  }

  toProfile() {
    this.props.history.push(`./profile/${this.props.user.user_id}`);
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar className={classes.appBar} position="static" color="secondary">
        <Toolbar id="toolbar">
          {this.props.user.role !== 'guest'
            // render the button if the user is logged in
            ? this.props.location.pathname === '/'
              ? <IconButton
                  className={classes.menuButton}
                  onClick={this.toggleSideBar}
                  aria-label="Menu"
                >
                  <MenuIcon />
                </IconButton>
              : <IconButton
                  className={classes.menuButton}
                  onClick={this.toHome}
                  aria-label="Home"
                >
                  <Home />
                </IconButton>
            : null //otherwise hide the button
          }
          <span>
            <SideNav
              open={this.state.sideBarOpen}
              toggleSideBar={this.toggleSideBar}
              toBookMark={this.toBookMark}
              toPledged={this.toPledged}
              toProfile={this.toProfile}
            />
          </span>
          <Logo />
            <div className={classes.rightSide}>
              <AddProject className={classes.addButton} />
              <Login />
            </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default compose<{}, HeadBarProps>(
  withStyles(styles, {
    name: 'HeadBar',
  }),
  connect<HeadBarStateProps, {}, HeadBarProps>(
    mapStateToProps, {},
  ),
)(HeadBar);

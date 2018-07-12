import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SignInIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';

import UserAvatar from '../UserAvatar';
import withAuth from '../WithAuth';

const Avatar = withAuth(['user'])(UserAvatar);

const retrieveFirstName = (name: string) => {
  return name ? name.split(' ')[0] : 'User';
};

const styles = (theme:any) => ({
  authWrapper: {
    display: 'flex',
    'align-items': 'center',
  },
  logoutButton: {
    // [theme.breakpoints.down('xs')]: {
    //   position: 'relative' as 'relative',
    //   bottom: '1rem',
    // },
  },
  signInIcon: {
    'margin-right': '0.5rem',
  },
  signInText: {
    'font-size': '0.8rem',
    [theme.breakpoints.down('md')]: {
      padding: '8px 0.2rem',
    },
  },
  welcomeText: {
    margin: '0 1rem 0.2rem 0',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
});

const loginButton = (props:any) => {
  const { classes } = props;
  return (
    <div>
      {props.user.role !== 'guest'
        ? 
          <div className={classes.authWrapper}>
            <Button className={classes.logoutButton} onClick={props.logoutHandler}>Logout</Button>
            <Typography className={classes.welcomeText}>{`Welcome, ${retrieveFirstName(props.user.name)}`}</Typography>
            <Avatar />
          </div>
        : <Button id={'login'} className={classes.signInText} onClick={props.handler}>
            <SignInIcon key={'signin'} className={classes.signInIcon}/>
            <Typography className={classes.welcomeText}>Sign In</Typography>
          </Button>
      }
    </div>
  );
};

export default withStyles(styles)(loginButton);

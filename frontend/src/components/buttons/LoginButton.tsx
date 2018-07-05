import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SignInIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';

const retrieveFirstName = (name: string) => {
  return name ? name.split(' ')[0] : 'User';
};

const styles = (theme:any) => ({
  logoutButton: {
    position: 'relative' as 'relative',
    bottom: '1rem',
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
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
});

const loginButton = (props:any) => {
  const { classes } = props;
  const buttonText = props.user.role !== 'guest'
    ? <Typography className={classes.welcomeText}>{`Welcome, ${retrieveFirstName(props.user.name)}`}</Typography>
    : [<SignInIcon key={'signin'} className={classes.signInIcon}/>, 'Sign In'];
  return (
    <div>
      <Button id={'login'} className={classes.signInText} onClick={props.handler}>
        {buttonText}
      </Button>
      {props.user.role !== 'guest'
        ? <Button className={classes.logoutButton} onClick={props.logoutHandler}>Logout</Button>
        : null
      }
    </div>
  );
};

export default withStyles(styles)(loginButton);

import * as React from 'react';
import Button from '@material-ui/core/Button';
import SignInIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';

const retrieveFirstName = (name: string) => {
  return name.split(' ')[0];
};

const styles = {
  signInIcon: {
    'margin-right': '0.5rem',
    'font-size': '36px',
  },
};

const loginButton = (props:any) => {
  const { classes } = props;
  const buttonText = props.user.role !== 'guest'
    ? `Welcome, ${retrieveFirstName(props.user.name)}`
    : [<SignInIcon key={'signin'} className={classes.signInIcon}/>, 'Sign In'];
  return (
    <div>
      <Button id={'login'} className={props.className} onClick={props.handler}>
        {buttonText}
      </Button>
      {props.user.role !== 'guest'
        ? <Button onClick={props.logoutHandler}>Logout</Button>
        : null
      }
    </div>
  );
};

export default withStyles(styles)(loginButton);

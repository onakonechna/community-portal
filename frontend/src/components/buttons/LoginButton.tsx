import * as React from 'react';
import Button from '@material-ui/core/Button';

const retrieveFirstName = (name: string) => {
  return name.split(' ')[0];
};

const loginButton = (props:any) => {
  const buttonText = props.user.role !== 'guest' ? `Welcome, ${retrieveFirstName(props.user.name)}` : 'LOGIN';
  return (
    <div>
      <Button className={props.className} onClick={props.handler}>{buttonText}</Button>
      {props.user.role !== 'guest'
        ? <Button onClick={props.logoutHandler}>Logout</Button>
        : null
      }
    </div>
  );
};

export default loginButton;

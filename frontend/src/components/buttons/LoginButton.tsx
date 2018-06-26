import * as React from 'react';
import Button from '@material-ui/core/Button';

function loginButton(props:any) {
  return <Button className={props.className} onClick={props.handler}>Login</Button>;
}

export default loginButton;

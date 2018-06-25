import * as React from 'react';
import Button from '@material-ui/core/Button';

export default function pledgeButton(props:any) {
  return (
    <Button onClick={props.passedProp}>Pledge</Button>
  );
}

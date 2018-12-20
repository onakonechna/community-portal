import * as React from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

export const styles = {
  submit: {
    color: '#27A2AA',
    'font-size': '1rem',
    'font-weight': '600',
    'text-transform': 'none',
    'margin': '0 auto'
  },
};

const submitButton = (props:any) => (
  <Button
      disabled={props.disabled}
      className={props.classes.submit}
      onClick={props.handler}
  >
      {props.label}
  </Button>
);

export default withStyles(styles)(submitButton);

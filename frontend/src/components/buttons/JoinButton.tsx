import * as React from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

export const styles = {
  join: {
    color: '#27A2AA',
    'font-size': '1rem',
    'font-weight': '600',
    'text-transform': 'none',
  },
};

const joinButton = (props:any) => (
  <Button className={props.classes.join} onClick={props.handler}>{props.label}</Button>
);

export default withStyles(styles)(joinButton);

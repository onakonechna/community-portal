import * as React from 'react';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

export const styles = {
  details: {
    color: '#27A2AA',
    'font-size': '1rem',
    'font-weight': '600',
    'text-transform': 'none',
  },
};

function detailButton(props: any) {
  const { classes } = props;
  return (
    <Button className={classes.details} onClick={props.handler}>Details</Button>
  );
}

export default withStyles(styles)(detailButton);

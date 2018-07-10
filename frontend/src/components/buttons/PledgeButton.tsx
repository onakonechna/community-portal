import * as React from 'react';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  pledge: {
    color: '#27A2AA',
    'font-size': '1rem',
    'font-weight': '600',
    'text-transform': 'none',
  },
};

function pledgeButton(props:any) {
  const { classes } = props;
  return (
    <Button className={classes.pledge} onClick={props.handler}>Pledge</Button>
  );
}

export default withStyles(styles)(pledgeButton);

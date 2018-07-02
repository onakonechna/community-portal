import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

interface IProps {
  classes: any;
  onClick: () => void;
}

const styles = {
  button: {
    width: '150px',
    float: 'right' as 'right',
    'font-size': '1rem',
    'text-transform': 'capitalize',
  },
};

function addProjectButton(props: IProps) {
  const { classes } = props;
  return (
    <div>
      <Button
        style={{
          backgroundColor: '#F16321',
        }}
        color="secondary"
        aria-label="add"
        onClick={props.onClick}
        className={classes.button}>
        New Project
      </Button>
    </div>
  );
}

export default withStyles(styles)(addProjectButton);

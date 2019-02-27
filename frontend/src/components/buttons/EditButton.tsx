import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';

import Edit from '@material-ui/icons/Edit';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  editButton: {
    color: '#27A2AA',
    position: 'relative' as 'relative',
    bottom: '0.1rem'
  },
});

const editButton = (props:any) => {
  return (
    <IconButton
      aria-label="Edit"
      onClick={props.handler}
      className={props.classes.editButton}
    >
      <Edit />
    </IconButton>
  );
};

export default withStyles(styles)(editButton);

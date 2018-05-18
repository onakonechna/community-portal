import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Icon from 'material-ui/Icon';
import DeleteIcon from 'material-ui-icons/Delete';

/** 
title
description
technologies
size
created date
due date

// pledgers + hours + avatars
// number of hours == goal
// number of pledged hours
// slack address
// github address
// to pledge
// to view details
// to archive
*/

const styles = {
    button: {
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    },
  };
  
  function AddProjetButton(props) {
      console.log(props)
    const { classes } = props;
    return (
      <div>
        <Button onClick={props.onClick} fab color="primary" aria-label="add" className={classes.button}>
          <AddIcon />
        </Button>
        
      </div>
    );
  }
  

  
  export default withStyles(styles)(AddProjetButton);
import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import { withStyles } from '@material-ui/core/styles';

const  styles = (theme:any) => ({
  field: {
    'width': '100%',
    'margin': '0 10px 0 0',
  },
  fieldsContainer: {
    'display': 'flex',
    'justify-content': 'space-between',
    'margin-top': '15px'
  },
  button: {
    'width': '100%',
    'margin': '0 0 0 10px',
  },
  chipsContainer: {
    'margin': '20px 0'
  },
  chipsLabel: {
    'display': 'inline-flex',
    'margin-right': '15px'
  },
  chips: {
    'vertical-align': 'middle',
    'margin': '0 5px'
  }
});

const FieldWithChips = (props:any) => {
  return (
    <div>
      <div className={props.classes.fieldsContainer}>
        <TextField
          className={props.classes.field}
          id={props.name}
          label={props.fieldLabel}
          value={props.value}
          onChange={props.handleFieldChange}
          margin="normal"
        />
        <Button
          className={props.classes.button}
          variant="contained"
          color="primary"
          size="medium"
          onClick={props.handleButtonClick}>
          {props.buttonLabel}
        </Button>
      </div>
      {
        props.collection.length ? (
          <div className={props.classes.chipsContainer}>
            <div className={props.classes.chipsLabel}>{props.chipsLabelExist}:</div>
            { props.collection.map((item:any, i:any)=>(<Chip
              className={props.classes.chips}
              key={i}
              avatar={
                <Avatar>
                  <FaceIcon />
                </Avatar>
              }
              label={item.login || item}
              onDelete={props.handleChipsDelete.bind(null, item)}
            />)) }
          </div>
        ) : (
          <div className={props.classes.chipsContainer}>
            <div className={props.classes.chipsLabel}>{props.chipsLabelNoExist}</div>
          </div>
        )
      }
    </div>
  )
};

export default withStyles(styles)(FieldWithChips);
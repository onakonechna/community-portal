import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';

import Edit from '@material-ui/icons/Edit';

export default function editButton(props:any) {
  return (
    <IconButton
    aria-label="Edit"
    onClick={props.passedProp}
    >
      <Edit />
    </IconButton>
  );
}

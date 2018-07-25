import * as React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

interface MessageProp {
  open: boolean;
  handleClose: () => void;
  message?: string;
}

const Message = (props: MessageProp) => {
  const { open } = props;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={5000}
      onClose={props.handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{props.message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          onClick={props.handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />);
};

export default Message;

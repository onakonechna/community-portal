import * as React from 'react';
import _isEmpty from 'lodash/isEmpty';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import { connect } from 'react-redux';
import { deleteMessage } from '../actions/messages';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';
import withStyles from '@material-ui/core/styles/withStyles';
import classnames from 'classnames';


function TransitionUp(props:any) {
  return <Slide {...props} direction="up" />;
}

const styles = (theme:any) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const MySnackbarContent = (props:any) => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classnames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classnames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

const MySnackbarContentWrapper = withStyles(styles)(MySnackbarContent);


class MessageBar extends React.Component<any, any> {
  type = 'success';

  handleClose = () => this.props.deleteMessage();

  render() {
    this.type = this.props.messages.type || this.type;

    return (
      <Snackbar
        open={!_isEmpty(this.props.messages)}
        onClose={this.handleClose}
        TransitionComponent={TransitionUp}
      >
        <MySnackbarContentWrapper
          onClose={this.handleClose}
          variant={this.props.messages.type || this.type}
          message={this.props.messages.massage}
        />
      </Snackbar>
    );
  }
}

const mapStateToProps = (state:any) => ({
  messages: state.messages
});

export default connect(mapStateToProps, { deleteMessage })(MessageBar);
import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Slack from '-!svg-react-loader!./../../static/images/icons/slack_icon.svg';

export const styles = {
  slack: {
    "width": '70%',
    "height": '70%',
    "margin-top": '2px',
  },
  bottomButtons: {
    position: 'relative' as 'relative',
    bottom: '0.1rem',
  },
};

const slackButton = (props:any) => (
  <a href={props.url} target="_blank">
    <IconButton aria-label="slack" className={props.classes.bottomButtons}>
      <Slack className={props.classes.slack}/>
    </IconButton>
  </a>
);

export default withStyles(styles)(slackButton);

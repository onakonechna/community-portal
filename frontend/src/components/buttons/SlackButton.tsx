import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Slack from '-!svg-react-loader!./../../static/images/slack.svg';

export const styles = {
  slack: {
    width: '3rem',
    height: '3rem',
    fill: '##27A2AA',
  },
  bottomButtons: {
    position: 'relative' as 'relative',
    bottom: '0.1rem',
  },
};

const slackButton = (props:any) => (
  <a href={props.url} target="_blank">
    <IconButton aria-label="slack" className={props.classes.bottomButtons}>
      <SvgIcon className={props.classes.slack}>
        <Slack />
      </SvgIcon>
    </IconButton>
  </a>
);

export default withStyles(styles)(slackButton);

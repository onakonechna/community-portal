import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Github from '-!svg-react-loader!./../../static/images/icons/github.svg';


export const styles = {
  github: {
    'margin-left': 'auto',
  },
  icon: {
    "width": "55%",
    "height": "55%"
  }
};

const githubButton = (props:any) => (
  <a className={props.classes.github} href={props.url} target="_blank">
    <IconButton style={{ color: '#27A2AA' }} aria-label="Git">
      <Github className={props.classes.icon}/>
    </IconButton>
  </a>
);

export default withStyles(styles)(githubButton);

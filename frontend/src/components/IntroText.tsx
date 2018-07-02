import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  header: {
    'font-weight': '700',
    'font-size': '2.5rem',
    margin: '0 0 0.5rem 4rem',
  },
  subheader: {
    margin: '0 0 4rem 8rem',
    'font-weight': '300',
    'font-size': '1.5rem',
    'white-space': 'pre-wrap',
    'border-left': '0.1rem solid #ffa500',
    'padding-left': '1rem',
  },
  text: {
    margin: '1rem 0',
    'font-weight': '500',
    'text-align': 'center',
    'font-size': '1.5rem',
  },
  subtext: {
    'margin-bottom': '3rem',
    'font-weight': '300',
    'text-align': 'center',
    'font-size': '1rem',
  },
};

const IntroText = (props: any) => {
  const { classes } = props;
  return (
    <div>
      <Typography className={classes.header}>Shape the future of Magento</Typography>
      <Typography className={classes.subheader}>
        Join thousands of community developers{'\n'}
        working on different projects
      </Typography>
      <Typography className={classes.text}>Ongoing Projects</Typography>
      <Typography className={classes.subtext}>Pick a project that you like, pledge hours, start working and have fun!</Typography>
    </div>
  );
};

export default withStyles(styles)(IntroText);

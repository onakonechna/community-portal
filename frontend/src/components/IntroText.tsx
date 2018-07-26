import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  header: {
    'font-family': 'system-ui',
    'font-weight': '500',
    'font-size': '3.5rem',
    margin: '0.5rem 0 1rem 5vw',
    [theme.breakpoints.down('md')]: {
      'font-size': '1.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      'font-size': '1.2rem',
    },
  },
  subheader: {
    margin: '0 0 4rem 8vw',
    'font-weight': '300',
    'font-size': '1.5rem',
    'white-space': 'pre-wrap',
    'border-left': '0.1rem solid #ffa500',
    'padding-left': '1rem',
    [theme.breakpoints.down('md')]: {
      'font-size': '0.875rem',
      'margin-bottom': '2rem',
    },
  },
});

const IntroText = (props: any) => {
  const { classes } = props;
  return (
    <Grid>
      <Typography className={classes.header}>Shape the future of Magento</Typography>
      <Typography className={classes.subheader}>
        Join thousands of community developers{'\n'}
        working on different projects
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(IntroText);

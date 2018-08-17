import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

interface ProfileText {
  totalPR: number;
  openPR: number;
  mergedPR: number;
  classes?: any;
}

const styles = {
  grid: {
    'margin-top': '2rem',
  },
  rightGrid: {
    'margin-top': '2rem',
    'margin-left': '1rem',
  },
  layout: {
    display: 'flex',
  },
  text: {
    'font-family': 'system-ui',
    'font-size': '1rem',
    'font-weight': '300',
  },
  textNumber: {
    'font-family': 'system-ui',
    'font-size': '1rem',
    'font-weight': '300',
    'margin-left': 'auto',
  },
};

const ProfileText = (props: ProfileText) => {
  const { totalPR, openPR, mergedPR, classes } = props;
  return (
    <div className={classes.layout}>
      <Grid className={classes.grid}>
        <Typography className={classes.text}>
          {`Pull Requests: `}
        </Typography>
        <Typography className={classes.text}>
          {`Merged: `}
        </Typography>
        <Typography className={classes.text}>
          {`Open: `}
        </Typography>
      </Grid>
      <Grid className={classes.rightGrid}>
        <Typography className={classes.textNumber}>{totalPR}</Typography>
        <Typography className={classes.textNumber}>{mergedPR}</Typography>
        <Typography className={classes.textNumber}>{openPR}</Typography>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(ProfileText);

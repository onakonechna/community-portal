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
  text: {
    'font-family': 'system-ui',
    'font-size': '1.5rem',
    'font-weight': '300',
  },
};

const ProfileText = (props: ProfileText) => {
  const { totalPR, openPR, mergedPR, classes } = props;
  return (
    <Grid className={classes.grid}>
      <Typography className={classes.text}>
        {`Total Pull Requests: ${totalPR}`}
      </Typography>
      <Typography className={classes.text}>
        {`Merged: ${mergedPR}`}
      </Typography>
      <Typography className={classes.text}>
        {`Open: ${openPR}`}
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(ProfileText);

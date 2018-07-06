import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import mLogo from './../static/images/m-logo.svg';
import magentoLogo from 'svg-inline-loader?classPrefix!././../static/images/magento-logo.svg';

const styles = (theme:any) => ({
  logo: {
    alignItems: 'start',
    display: 'flex',
    webkitUserSelect: 'none',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
    },
  },
  mLogo: {
    width: '34px',
  },
  magentoLogo: {
    width: '100px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logoText: {
    alignSelf: 'center',
    color: '#4e4e4e',
    fontSize: '24px',
    lineHeight: '1',
    padding: '0 10px 0 0',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
    },
  },
  divider: {
    alignSelf: 'center',
    height: '40px',
    borderLeft: '2px solid #4e4e4e',
    margin: '0 10px',
  },
});

const Logo = (props: any) => {
  const { classes } = props;
  return (
    <span className={classes.logo}>
      <img src={mLogo} className={classes.mLogo} />
      <img src={magentoLogo} className={classes.magentoLogo} />
      <span className={classes.divider}></span>
      <span className={classes.logoText}>Community Portal</span>
    </span>
  );
};

export default withStyles(styles)(Logo);

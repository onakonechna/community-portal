import * as React from 'react';
import Favorite from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, Theme } from '@material-ui/core/styles';
import classnames from "classnames";

interface StarringProjectProps {
  starred: boolean;
  handler: any;
  classes: any;
}

const styles = (theme: Theme) => ({
  Button: {
    position: 'relative' as 'relative',
    bottom: '0.1rem',
  },
  starredButton: {
    color: '#FF2B00',
  },
  unstarredButton: {
    color: '#27A2AA',
  }
});

const StarringProjectButton = (props: StarringProjectProps) => {
  const { classes, starred } = props;

  return (
    <IconButton
      aria-label="star"
      className={classes.Button}
      onClick={props.handler}>
      <Favorite className={classnames({
        [classes.starredButton]: starred,
        [classes.unstarredButton]: !starred
      })}/>
    </IconButton>
  );
};

export default withStyles(styles)(StarringProjectButton);

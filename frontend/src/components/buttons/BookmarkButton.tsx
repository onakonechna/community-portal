import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';

import Bookmark from '@material-ui/icons/Bookmark';

import withStyles from '@material-ui/core/styles/withStyles';

interface BookmarkProjectProps {
  bookmarked: boolean;
  handler?: any;
  classes?: any;
  className?: string;
}

const styles = theme => ({
  bookmarked: {
    color: '#FF2B00',
  },
  unbookmarked: {
    color: '#27A2AA',
  },
});

const BookmarkButton = (props: BookmarkProjectProps) => {
  const { classes } = props;
  return (
    <IconButton
      aria-label="Bookmark"
      className={props.className}
      onClick={props.handler}
    >
      <Bookmark
        className={props.bookmarked ? classes.bookmarked : classes.unbookmarked}
      />
    </IconButton>
  );
};

export default withStyles(styles)(BookmarkButton);

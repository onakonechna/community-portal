import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';

import Bookmark from '@material-ui/icons/Bookmark';

// import { withStyles, Theme } from '@material-ui/core/styles';

interface BookmarkProjectProps {
  bookmarked: boolean;
  project_id: string;
  user?: any;
  role?: string;
  toggleBookmark: () => void;
  bookmarkProject?: any;
  handler?: any;
  classes?: any;
  className: string;
}

// const styles = (theme:Theme) => ({
//   bookmark: {
//     'margin-left': 'auto',
//     position: 'relative' as 'relative',
//     left: '1rem',
//   },
// });

const BookmarkButton = (props: BookmarkProjectProps) => {
  // const { classes } = props;
  return (
    <IconButton
      aria-label="Bookmark"
      className={props.className}
      onClick={props.handler}
    >
      <Bookmark
        style={{ color: props.bookmarked ? '#FF2B00' : '#27A2AA' }}
      />
    </IconButton>
  );
};

export default BookmarkButton;

// export default withStyles(styles)(BookmarkButton);

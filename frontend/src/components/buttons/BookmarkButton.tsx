import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';

import Bookmark from '@material-ui/icons/Bookmark';

interface BookmarkProjectProps {
  bookmarked: boolean;
  project_id: string;
  user?: any;
  role?: string;
  toggleBookmark: () => void;
  bookmarkProject?: any;
  handler?: any;
}

const BookmarkButton = (props: BookmarkProjectProps) => {
  return (
    <IconButton
      aria-label="Bookmark"
      onClick={props.handler}
    >
      <Bookmark
        style={{ color: props.bookmarked ? '#f16321' : '#27A2AA' }}
      />
    </IconButton>
  );
};

export default BookmarkButton;

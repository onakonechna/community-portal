import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

interface LikeProjectProps {
  classes?: any;
  liked: boolean;
  project_id: string;
  upvotes: number;
  user?: any;
  role?: string;
  toggleLike: () => void;
  likeProject?: any;
  handler?: any;
}

const styles = {
  likeButton: {
    width: '2rem',
  },
};

const LikeProjectButton = (props: LikeProjectProps) => {
  const { classes } = props;
  return (
    <IconButton
      aria-label="like"
      className={classes.likeButton}
      onClick={props.handler}>
      <Favorite
        style={{ color: props.liked ? '#FF2B00' : '#27A2AA' }}
      />
    </IconButton>
  );
};

export default withStyles(styles)(LikeProjectButton);

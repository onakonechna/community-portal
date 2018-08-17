import * as React from 'react';

import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

import { withStyles, Theme } from '@material-ui/core/styles';
import { Classes } from '../../../node_modules/@types/jss';

interface LikeProjectProps {
  liked: boolean;
  project_id: string;
  upvotes: number;
  user?: any;
  role?: string;
  toggleLike: () => void;
  likeProject?: any;
  handler?: any;
  classes: Classes;
}

const styles = (theme: Theme) => ({
  Button: {
    position: 'relative' as 'relative',
    bottom: '0.1rem',
  },
  likedButton: {
    color: '#FF2B00',
  },
  unlikedButton: {
    color: '#27A2AA',
  },
});

const LikeProjectButton = (props: LikeProjectProps) => {
  const { classes, liked } = props;
  return (
    <IconButton
      aria-label="like"
      className={classes.Button}
      onClick={props.handler}>
      <Favorite
        className={liked ? classes.likedButton : classes.unlikedButton}
      />
    </IconButton>
  );
};

export default withStyles(styles)(LikeProjectButton);

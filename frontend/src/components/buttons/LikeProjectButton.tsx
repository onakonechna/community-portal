import * as React from 'react';

import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

interface LikeProjectProps {
  liked: boolean;
  project_id: string;
  upvotes: number;
  user?: any;
  role?: string;
  toggleLike: () => void;
  likeProject?: any;
  handler?: any;
}

const LikeProjectButton = (props: LikeProjectProps) => {
  return (
    <IconButton
      aria-label="like"
      onClick={props.handler}>
      <Favorite
        style={{ color: props.liked ? '#FF2B00' : '#27A2AA' }}
      />
    </IconButton>
  );
};

export default LikeProjectButton;

import * as React from 'react';
// import { connect } from 'react-redux';
// import compose from 'recompose/compose';

// import { likeProject } from '../actions';
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
    'margin-left': 'auto',
  },
};

const LikeProjectButton = (props: LikeProjectProps) => {
  const { classes } = props;
  // const likeProject = () => {
  //   const { project_id } = props;
  //   if (!props.liked) {
  //     props.handler(project_id)
  //       .then((response: any) => {
  //         props.toggleLike();
  //       })
  //       .catch((error: any) => {
  //         console.log(error);
  //       });
  //   }
  // };
  return (
    <IconButton
      aria-label="like"
      className={classes.likeButton}
      onClick={props.handler}>
      <Favorite
        style={{ color: props.liked ? '#FF2B00' : 'gray' }}
      />
    </IconButton>
  );
};

export default withStyles(styles)(LikeProjectButton);

// const mapDispatchToProps = (dispatch: any) => {
//   return {
//     likeProject: (id: string) => dispatch(likeProject(id)),
//   };
// };

// export default compose<{}, LikeProjectProps>(
//   withStyles(styles, {
//     name: 'LikeProjectButton',
//   }),
//   connect<{}, DispatchProps, LikeProjectProps>(null, mapDispatchToProps),
// )(LikeProjectButton);

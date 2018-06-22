import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { likeProject } from '../actions';
import { withStyles } from '@material-ui/core/styles';

import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

interface LikeProjectProps {
  classes?: any;
  liked: boolean;
  project_id: string;
  upvotes: number;
}

interface LikeProjectState {
  liked: boolean;
}

interface DispatchProps {
  likeProject: any;
}

const styles = {
  likeButton: {},
};

class LikeProjectButton extends React.Component<LikeProjectProps & DispatchProps, LikeProjectState> {
  constructor(props: LikeProjectProps & DispatchProps) {
    super(props);
    this.state = {
      liked: this.props.liked,
    };
    this.likeProject = this.likeProject.bind(this);
  }

  likeProject() {
    const { project_id } = this.props;
    if (!this.state.liked) {
      this.props.likeProject(project_id)
      .then((response: any) => {
        this.setState({ liked: true });
      })
      .catch((error: any) => {
        console.log(error);
      });
    }
  }

  render() {
    const { upvotes } = this.props;
  	return (
      <IconButton
        aria-label="like"
        onClick={this.likeProject}>
        <Favorite
          style={{ color: this.state.liked ? '#FF2B00' : 'gray' }}
        />
        <span>{upvotes}</span>
      </IconButton>
  	);
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    likeProject: (id: string) => dispatch(likeProject(id)),
  };
};

export default compose<{}, LikeProjectProps>(
  withStyles(styles, {
    name: 'LikeProjectButton',
  }),
  connect<{}, DispatchProps, LikeProjectProps>(null, mapDispatchToProps),
)(LikeProjectButton);

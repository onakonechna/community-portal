import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { likeProject } from '../actions';
import { withStyles } from '@material-ui/core/styles';

import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

interface LikeProjectProps {
  classes?: any;
  project_id: string;
  upvotes: number;
}

interface DispatchProps {
  likeProject: any;
}

const styles = {
  span: {
    'margin-left': '5px',
  },
};

class LikeProjectButton extends React.Component<LikeProjectProps & DispatchProps, {}> {
  constructor(props: LikeProjectProps & DispatchProps) {
    super(props);
    this.likeProject = this.likeProject.bind(this);
  }

  likeProject() {
    const { project_id } = this.props;
    this.props.likeProject(project_id)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  render() {
    const { upvotes } = this.props;
  	return (
      <IconButton
        aria-label="like"
        onClick={this.likeProject}>
        <Favorite />
        <span>{upvotes}</span>
      </IconButton>
  	);
  }
}

const mapStateToProps = (state: any) => {
  return {

  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    likeProject: (id: string) => dispatch(likeProject(id)),
  };
};

export default compose<{}, LikeProjectProps>(
  withStyles(styles, {
    name: 'LikeProjectButton',
  }),
  connect<{}, DispatchProps, LikeProjectProps>(mapStateToProps, mapDispatchToProps),
)(LikeProjectButton);

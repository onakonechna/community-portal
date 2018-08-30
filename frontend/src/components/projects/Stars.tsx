import { connect } from 'react-redux';
import * as _ from "lodash";
import * as React from "react";

import { addStarredProject, removeStarredProject } from '../../actions/user';
import { likeProject } from '../../actions';
import { updateProjectStars } from '../../actions/project';
import StarringProjectButton from '../buttons/StarringProjectButton';

class Stars extends React.Component<any, any> {
  handler = () => {
    this.props.likeProject(this.props.project.github_project_id)
      .then(() => {
        let upvotes = this.props.project.upvotes;

        if (this.props.isProjectStarred) {
          --upvotes;
          this.props.removeStarredProject(this.props.project.github_project_id);
        } else {
          ++upvotes;
          this.props.addStarredProject({project_id: this.props.project.github_project_id});
        }

        this.props.updateProjectStars(this.props.project.github_project_id, upvotes);
      })
      .catch(() => {});
  };

  render() {
    return (
      <StarringProjectButton
        starred={this.props.isProjectStarred}
        handler={this.handler}
      />
    )
  }
}

const mapStateToProps = (state:any, props:any) => ({
  isProjectStarred: !!_.find(
    state.user['upvoted_projects'],
    (project:any) => project.project_id === props.project.github_project_id
  )
});

export default connect(mapStateToProps, {
  addStarredProject,
  removeStarredProject,
  likeProject,
  updateProjectStars
})(Stars)
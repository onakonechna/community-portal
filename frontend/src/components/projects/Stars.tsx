import { connect } from 'react-redux';
import * as _ from "lodash";
import * as React from "react";

import { starProject, unstarProject, updateProjectStars } from '../../actions/projectStars';
import StarringProjectButton from '../buttons/StarringProjectButton';
import { loadingProcessStart, loadingProcessEnd } from '../../actions/loading';


class Stars extends React.Component<any, any> {
  handler = () => {
    this.props.loadingProcessStart('stars_project', true);
		let upvotes = this.props.project.stargazers_count;

		const promise = this.props.isProjectStarred ?
			--upvotes && this.props.unstarProject(this.props.project.id) :
			++upvotes && this.props.starProject(this.props.project.id);

		promise.then(() => {
			this.props.loadingProcessEnd('stars_project');
			this.props.updateProjectStars(this.props.project.id, upvotes);
		});
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
    (project:any) => project.id === props.project.id
  )
});

export default connect(mapStateToProps, {
	starProject,
	unstarProject,
  updateProjectStars,
  loadingProcessStart,
  loadingProcessEnd
})(Stars)
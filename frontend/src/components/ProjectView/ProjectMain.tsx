import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { loadProject } from '../../actions';

import { withStyles } from '@material-ui/core/styles';

const styles = {};

interface IProject {
  id: string;
  name: string;
  title?: string;
  description: string;
  technologies: [string];
  estimated: number;
  pledged?: number;
  due_date?: string;
  hours_goal?: number;
  github: string;
  slack?: string;
  size?: string;
  backers: [{
    name?: string,
    pledge?: number;
  }];
  created_date: string;
}

interface DispatchProps {
  loadProject: (project_id: string) => void;
}

interface ProjectMainProps {
  project?: any;
  user?: any;
}

interface ProjectMainState {
  projects: IProject[];
}

export class ProjectMain extends React.Component<ProjectMainProps & DispatchProps, ProjectMainState> {
  constructor(props: ProjectMainProps & DispatchProps) {
    super(props);
  }

  update() {
    this.props.loadProject('test21');
  }

  componentDidMount() {
    this.update();
  }

  render() {
    return (
      <div>
        <h1>{this.props.project.name}</h1>
        <p>{this.props.project.description}</p>
        <p>Created at: {this.props.project.created}</p>
        <p>Updated at: {this.props.project.updated}</p>
        <p>Status: {this.props.project.status}</p>
        <p>Size: {this.props.project.size}</p>
        <p>Due: {this.props.project.due}</p>
        <p>Skills: {this.props.project.skills}</p>
        <p>Technologies: {this.props.project.technologies}</p>
        <p>Tags: {this.props.project.tags}</p>
        <p>Upvotes: {this.props.project.upvotes}</p>
        <p>Owner: {this.props.project.owner}</p>
        <p>Estimated: {this.props.project.estimated}</p>
        <p>Pledged: {this.props.project.pledged}</p>
        <p>Completed: {this.props.project.completed}</p>
        <p>GitHub: {this.props.project.github_address}</p>
        <p>Slack: {this.props.project.slack_channel}</p>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    project: state.oneproject,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadProject: (project_id: string) => dispatch(loadProject(project_id)),
  };
};

export default compose<{}, ProjectMainProps>(
  withStyles(styles, {
    name: 'ProjectMain',
  }),
  connect<{}, DispatchProps, ProjectMainProps>(mapStateToProps, mapDispatchToProps),
)(ProjectMain);

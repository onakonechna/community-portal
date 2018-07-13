import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { loadProject } from '../../actions';

import { withStyles } from '@material-ui/core/styles';

const styles = {};

interface DispatchProps {
  loadProject: (project_id: string) => void;
}

interface ProjectMainProps {
  project?: {};
  user?: any;
}

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

interface ProjectMainState {
  projects: IProject[];
}

export class ProjectMain extends React.Component<ProjectMainProps & DispatchProps, ProjectMainState> {
  constructor(props: ProjectMainProps & DispatchProps) {
    super(props);
  }

  update() {
    // this.props.loadProject(this.props.project.project_id);
    console.log('hey there');
    this.props.loadProject('test21');
  }

  componentDidMount() {
    this.update();
  }

  render() {
    return (
      <h1>MAIN</h1>
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

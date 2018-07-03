import * as React from 'react';
import { connect } from 'react-redux';

import { loadProjects } from '../actions';
import IntroText from './IntroText';
import ProjectCard from './ProjectCard';

import Grid from '@material-ui/core/Grid';

const projectsData = require('../data/projects.json');

const styles = {
  margin: '0 auto',
  width: '90%',
};

interface GridStateProps {
  projects: any;
}

interface GridProps {
  project?: {};
  user?: any;
  loadProjects: () => void;
  handler?: () => void;
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

interface GridState {
  projects: IProject[];
}

export class ProjectGrid extends React.Component<GridProps & GridStateProps, GridState> {

  public state: GridState = {
    projects: projectsData,
  };

  constructor(props: GridProps & GridStateProps) {
    super(props);
    this.updateGrid = this.updateGrid.bind(this);
  }

  checkLike(id: string) {
    return this.props.user.likedProjects.indexOf(id) !== -1;
  }

  updateGrid() {
    this.props.loadProjects();
  }

  componentDidMount() {
    this.updateGrid();
  }

  render() {
    return (
      <div style={{ padding: '40px 80px' }}>
      <IntroText />
        <Grid
          container
          direction="row"
          justify-content="center"
          alignItems="flex-start"
          spacing={32}
          style={styles}
        >
          {this.props.projects && this.props.projects.map((project: any) => (
            <Grid item key={project.project_id}>
              <ProjectCard
                project={project}
                handler={this.updateGrid}
                liked={this.checkLike(project.project_id)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    projects: state.project,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadProjects: () => dispatch(loadProjects()),
  };
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(ProjectGrid);

import * as React from 'react';
import { connect } from 'react-redux';

import { loadProjects } from '../actions';
import AddProjectDialog from './addProjectDialog';
import ProjectCard from './projectCard';

import Grid from '@material-ui/core/Grid';

const projectsData = require('../data/projects.json');

interface GridStateProps {
  projects: any;
}

interface GridProps {
  temp?: string;
  project?: {};
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

  updateGrid() {
    this.props.loadProjects();
  }

  componentDidMount() {
    this.updateGrid();
  }

  render() {
    return (
      <div style={{ padding: '40px 80px' }}>
        <Grid
          container
          direction="row"
          justify-content="center"
          alignItems="flex-start"
          spacing={32}
        >
          {this.props.projects && this.props.projects.map((project: any) => (
            <Grid item key={project.project_id}>
              <ProjectCard
                project={project}
                handler={this.updateGrid}
              />
            </Grid>
          ))}
        </Grid>
        <AddProjectDialog />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    projects: state.project,
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

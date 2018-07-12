import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import IntroText from './IntroText';
import ProjectCard from './ProjectCard';

import Grid from '@material-ui/core/Grid';

const projectsData = require('../data/projects.json');

const styles = {
  margin: '0 auto',
  justifyContent: 'center',
};

interface GridStateProps {
  projects: any;
}

interface GridProps {
  project?: {};
  user?: any;
  loadProjects: () => void;
  handler?: () => void;
  filter?: string;
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

  checkBookmark(id: string) {
    return this.props.user.bookmarkedProjects.indexOf(id) !== -1;
  }

  updateGrid() {
    this.props.loadProjects();
  }

  filter() {
    if (this.props.filter !== undefined) {
      if (this.props.user !== undefined || !Array.isArray(this.props.user[this.props.filter])){
        throw `The filter ${this.props.filter} must be an array on the user redux store`;
      }

      return _.pickBy(this.props.projects, (project: any) => {
        return _.includes(this.props.user[this.props.filter], project.project_id);
      });
    }
    return this.props.projects;
  }

  componentDidMount() {
    this.updateGrid();
  }

  render() {
    return (
      <div style={{ padding: '40px' }}>
      <IntroText />
        <Grid
          container
          direction="row"
          spacing={32}
          style={styles}
        >
          {this.props.projects && this.props.projects.map((project: any) => (
            <Grid item key={project.project_id}>
              <ProjectCard
                project={project}
                handler={this.updateGrid}
                liked={this.checkLike(project.project_id)}
                bookmarked={this.checkBookmark(project.project_id)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

const WithProjectGrid = (loadProjects: any) => {

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

  return connect(
    mapStateToProps, mapDispatchToProps,
  )(ProjectGrid);

};

export default WithProjectGrid;

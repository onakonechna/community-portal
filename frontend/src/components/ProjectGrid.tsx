
import _filter from 'lodash/filter';
import includes from 'lodash/includes';
import * as React from 'react';
import { connect } from 'react-redux';

import IntroText from './IntroText';
import ProjectCard from './ProjectCard';
import { loadProjects } from './../actions';

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
  pledgers: Pledger[];
  created_date: string;
}

interface Pledger {
  avatar_url?: string;
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
    if (typeof this.props.filter !== 'undefined') {
      if (this.props.filter === 'pledgedProjects') {
        return _filter(this.props.projects, (project: any) => {
          return includes(Object.keys(project.pledgers), this.props.user.user_id);
        });
      }

      if (typeof this.props.user === 'undefined' || !Array.isArray(this.props.user[this.props.filter])) {
        throw `The filter ${this.props.filter} must be an array in the user redux store`;
      }

      return _filter(this.props.projects, (project: any) => {
        const filter:any = this.props.filter;
        return includes(this.props.user[filter], project.project_id);
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
          {this.props.projects && this.filter().map((project: any) => (
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

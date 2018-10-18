import _filter from 'lodash/filter';
import includes from 'lodash/includes';
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withStyles, Theme } from '@material-ui/core/styles';

import IntroText from './IntroText';
import ProjectCard from './ProjectCard';
import { loadProjects } from './../actions';
import { loadStarredProjects } from './../actions/user';
import { loadingProcessStart, loadingProcessEnd } from './../actions/loading';

import Grid from '@material-ui/core/Grid';

const styles = (theme: Theme) => ({
  invisibleCard: {
    'background-color': '#FFFFFF',
    opacity: 0,
    height: '1rem',
    [theme.breakpoints.down('md')]: {
      width: '20rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '25rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '30rem',
    },
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'space-between',
  },
  hiddenGridSmall: {
    [theme.breakpoints.down(783)]: {
      display: 'none',
    },
  },
  hiddenGridLarge: {
    [theme.breakpoints.down(1615)]: {
      display: 'none',
    },
  },
});

interface GridStateProps {
  projects: any;
  user: any;
}

interface DispatchProps {
  loadProjects: any;
  loadingProcessStart: any;
  loadingProcessEnd: any;
  loadStarredProjects: () => any;
}

interface GridProps {
  project?: {};
  user?: any;
  authorized: any;
  handler?: () => void;
  filter?: string;
  classes?: any;
  history?: any;
}

interface IProject {
  id: string;
  name: string;
  title?: string;
  description: string;
  technologies: [string];
  estimated: number;
  due_date?: string;
  hours_goal?: number;
  github: string;
  slack?: string;
  size?: string;
  created_date: string;
}

interface GridState {
  projects: IProject[];
}

export class ProjectGrid extends React.Component<GridProps & GridStateProps & DispatchProps, GridState> {
  componentWillMount() {
    if (this.props.authorized) {
      this.props.loadingProcessStart('load_starred_projects', true);
      this.props.loadStarredProjects()
        .then(() => this.props.loadingProcessEnd('load_starred_projects'));
    }
  }

  componentWillReceiveProps(props:any) {
    if (!this.props.authorized && props.authorized) {
      this.props.loadingProcessStart('load_starred_projects', true);
      this.props.loadStarredProjects()
        .then(() => this.props.loadingProcessEnd('load_starred_projects'));
    }
  }

  constructor(props: GridProps & GridStateProps & DispatchProps) {
    super(props);
    this.updateGrid = this.updateGrid.bind(this);
  }

  updateGrid() {
    this.props.loadingProcessStart('load_projects', true);
    this.props.loadProjects()
      .then(() => this.props.loadingProcessEnd('load_projects'));
  }

  filter() {
    if (typeof this.props.filter !== 'undefined') {
      if (this.props.filter === 'userProjects') {
        return _filter(this.props.projects, (project: any) => {
          return includes(Object.keys(project.contributors), this.props.user.id);
        });
      }

      if (this.props.filter === 'bookmarkedProjects') {
        return _filter(this.props.projects, (project: any) => {
          return includes(Object.keys(project.bookmarked), this.props.user.id);
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
    const { classes } = this.props;
    return (
      <div>
      <IntroText />
        <Grid
          container
          direction="row"
          spacing={32}
          justify="center"
        >
          {this.props.projects &&
            this.filter()
              .sort((prev:any, next:any) => prev.upvotes < next.upvotes)
              .map((project: any) => (
                <Grid item key={project.id}>
                  <ProjectCard
                    project={project}
                    handler={this.updateGrid}
                    history={this.props.history}
                  />
                </Grid>
          ))}
          {classes && <Grid item className={classes.hiddenGridSmall}><div className={classes.invisibleCard} /></Grid>}
          {classes && <Grid item className={classes.hiddenGridLarge}><div className={classes.invisibleCard} /></Grid>}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    projects: state.project,
    user: state.user,
    authorized: state.user.id
  };
};

export default compose<GridStateProps, any>(
  withStyles(styles, {
    name: 'ProjectGrid',
  }),
  connect<GridStateProps, DispatchProps, any>(mapStateToProps, {
    loadStarredProjects,
    loadingProcessStart,
    loadingProcessEnd,
    loadProjects
  }),
)(ProjectGrid);

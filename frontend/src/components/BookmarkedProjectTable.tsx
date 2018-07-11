import * as React from 'react';
import { connect } from 'react-redux';

// import { getBookmarkedProjectsAction } from '../actions';
import { loadProjects } from '../actions';
// import BookmarkedProjectRow from './BookmarkedProjectRow';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
  getBookmarkedProjects: () => void;
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
    this.props.getBookmarkedProjects();
  }

  componentDidMount() {
    this.updateGrid();
  }

  render() {
    return (
      <div style={{ padding: '40px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
            </TableRow>
          </TableHead>
          {this.props.projects && this.props.projects.map((project: any) => (
            <Grid item key={project.project_id}>
              <BookmarkedProjectRow
                project_id={project.project_id}
                name={project.name}
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
    getBookmarkedProjects: () => dispatch(loadProjects()),
  };
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(ProjectGrid);

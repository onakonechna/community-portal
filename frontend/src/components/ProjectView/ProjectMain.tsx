import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { loadProject } from '../../actions';

import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Jumbotron from './Jumbotron';

const styles: any = (theme:any) => ({
  titleText: {
    fontWeight: 'normal',
    fontSize: '2em',
  },
});

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

interface StateProps: {
  project: IProject;
  user: any;
}

interface DispatchProps {
  loadProject: (project_id: string) => void;
}

interface ProjectMainProps {
  project_id: string;
  fieldMap?: any;
  chipMap?: any;
  project?: any;
  user?: any;
  classes?: any;
}

interface ProjectMainState {
  projects: IProject[];
}

export class ProjectMain extends React.Component<ProjectMainProps & DispatchProps, ProjectMainState> {
  constructor(props: ProjectMainProps & DispatchProps) {
    super(props);
  }

  update(project_id: string) {
    this.props.loadProject(project_id);
  }

  componentDidMount() {
    this.update(this.props.project_id);
  }

  getDate(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <p className={classes.titleText}>{this.props.project.name}</p>
        <Jumbotron>
          <p>{this.props.project.description}</p>
          <hr />
          <p>
            <span>Created at {this.getDate(this.props.project.created)}</span>&nbsp;
            <span>Updated at {this.getDate(this.props.project.updated)}</span>
          </p>
        </Jumbotron>
        <Table>
          <TableBody>
            {this.props.fieldMap.map((entry: string[]) => (
              <TableRow>
                <TableCell>{entry[1]}</TableCell>
                <TableCell>{this.props.project[entry[0]]}</TableCell>
              </TableRow>
            ))}
            {this.props.chipMap.map((entry: string[]) => (
              entry[0] in this.props.project ?
                <TableRow>
                  <TableCell>{entry[1]}</TableCell>
                  <TableCell>{this.props.project[entry[0]].map((chip: string) => (
                    <Chip className={classes.chip} key={chip} label={chip} />
                  ))}</TableCell>
                </TableRow>
              :
                null
            ))}
            <TableRow>
              <TableCell>Due</TableCell>
              <TableCell>{this.getDate(this.props.project.due)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
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

export default compose<StateProps, ProjectMainProps>(
  withStyles(styles, {
    name: 'ProjectMain',
  }),
  connect<StateProps, DispatchProps, ProjectMainProps>(mapStateToProps, mapDispatchToProps),
)(ProjectMain);

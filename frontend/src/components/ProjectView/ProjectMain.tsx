import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { loadProject } from '../../actions';

import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow }  from '@material-ui/core';

import DescriptionBox from './DescriptionBox';
import ScheduleMeetingDialog from './ScheduleMeetingDialog';
import ScheduleMeetingButton from './../buttons/ScheduleMeetingButton';
import WithAuth from './../WithAuth';

const ScheduleMeeting = WithAuth(['owner', 'user'], ['write:project'])(ScheduleMeetingButton);

const styles: any = (theme:any) => ({
  titleText: {
    fontWeight: 'normal',
    fontSize: '2em',
  },
});

interface IProject {
  id: string;
  name: string;
  created: number;
  updated: number;
  title?: string;
  description: string;
  technologies: [string];
  estimated: number;
  due: number;
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

interface StateProps {
  project: IProject;
  user: any;
}

interface DispatchProps {
  loadProject: (project_id: string) => void;
}

interface ProjectMainProps {
  project_id: string;
  fieldMap: any;
  chipMap: any;
  project?: IProject;
  user?: any;
  classes?: any;
}

interface ProjectMainState {
  scheduleMeetingOpen: boolean;
}

export class ProjectMain extends React.Component<ProjectMainProps & DispatchProps, ProjectMainState> {
  constructor(props: ProjectMainProps & DispatchProps) {
    super(props);
    this.state = {
      scheduleMeetingOpen: false,
    };
    this.toggleScheduleMeeting = this.toggleScheduleMeeting.bind(this);
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

  toggleScheduleMeeting() {
    this.setState((prevState: ProjectMainState) => ({
      scheduleMeetingOpen: !prevState.scheduleMeetingOpen,
    }));
  }

  render() {
    const { classes } = this.props;
    const project: any = this.props.project;
    return (
      <div>
        <ScheduleMeetingDialog
          open={this.state.scheduleMeetingOpen}
          project={project}
          toggle={this.toggleScheduleMeeting}
        />
        <p className={classes.titleText}>{project.name}</p>
        <DescriptionBox>
          <p>{project.description}</p>
          <hr />
          <p>
            <span>Created at {this.getDate(project.created)}</span>&nbsp;
            <span>Updated at {this.getDate(project.updated)}</span>
          </p>
        </DescriptionBox>
        <Table>
          <TableBody>
            {this.props.fieldMap.map((entry: string[]) => {
              const displayName = entry[1];
              const fieldName = entry[0];
              return (
                <TableRow>
                  <TableCell>{displayName}</TableCell>
                  <TableCell>{project[fieldName]}</TableCell>
                </TableRow>
              );
            })}
            {this.props.chipMap.map((entry: string[]) => {
              const displayName = entry[1];
              const fieldName = entry[0];
              return (
                fieldName in project ?
                  <TableRow>
                    <TableCell>{displayName}</TableCell>
                    <TableCell>{project[fieldName].map((chip: string) => (
                      <Chip className={classes.chip} key={chip} label={chip} />
                    ))}</TableCell>
                  </TableRow>
                :
                  null
              );
            })}
            <TableRow>
              <TableCell>Due</TableCell>
              <TableCell>{this.getDate(project.due)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <ScheduleMeeting handler={this.toggleScheduleMeeting} label="ScheduleMeeting" />
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
  connect<StateProps, DispatchProps, ProjectMainProps>(mapStateToProps, mapDispatchToProps),
)(ProjectMain);

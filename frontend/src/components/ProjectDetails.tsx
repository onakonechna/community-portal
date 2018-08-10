import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { loadProject } from '../actions';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles: any = (theme:any) => ({
  titleText: {
    fontWeight: '500',
    fontSize: '2em',
    textAlign: 'center',
    marginTop: '1em',
  },
  descriptionText: {
    fontSize: '1.25em',
  },
  card: {
    'background-color': '#F2F3F3',
    [theme.breakpoints.down('md')]: {
      width: '20rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '25rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '45rem',
    },
    display: 'flex',
    'flex-direction': 'column',
    margin: 'auto',
    'margin-top': '1rem',
  },
  content: {
    margin: '1rem',
  },
  contributorDiv: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '2rem',
  },
  contributorText: {
    'font-size': '1rem',
    'font-weight': '300',
    'margin-left': '1rem',
    'margin-top': 'auto',
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

interface StateProps {
  project: IProject;
  user: any;
}

interface DispatchProps {
  loadProject: (project_id: string) => void;
}

interface ProjectDetailsProps {
  project_id: string;
  project?: any;
  user?: any;
  classes?: any;
}

interface ProjectDetailsState {
  projects: IProject[];
}

export class ProjectDetails extends React.Component<ProjectDetailsProps & DispatchProps, ProjectDetailsState> {
  constructor(props: ProjectDetailsProps & DispatchProps) {
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

  countContributors(project: any) {
    const numOfPledgers = Object.keys(project.pledgers).length;
    switch (numOfPledgers) {
      case 0:
        return 'No contributors yet';
      case 1:
        return '1 Contributor';
      default:
        return `${numOfPledgers} Contributors`;
    }
  }

  render() {
    const { classes } = this.props;
    const { pledgers } = this.props.project;
    return (
      <div>
        <Typography className={classes.titleText}>
          {this.props.project.name}
        </Typography>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography className={classes.descriptionText}>{this.props.project.description}</Typography>

            {this.props.project.pledgers && <div className={classes.contributorDiv}>
              {Object.keys(pledgers).length > 0
                ? Object.keys(pledgers).map(pledger => (
                  <Avatar key={pledger} src={pledgers[pledger].avatar_url} />
                ))
                : null}
              <Typography className={classes.contributorText}>{this.countContributors(this.props.project)}</Typography>
            </div>}
          </CardContent>
        </Card>
      </div>
    );
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

export default compose<{}, ProjectDetailsProps>(
  withStyles(styles, {
    name: 'ProjectDetails',
  }),
  connect<StateProps, DispatchProps, ProjectDetailsProps>(mapStateToProps, mapDispatchToProps),
)(ProjectDetails);

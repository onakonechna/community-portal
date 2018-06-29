import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { likeProject } from '../actions';
import WithAuth from './WithAuth';
import EditProjectDialog from './EditProjectDialog';
import PledgeDialog from './PledgeDialog';
import EditButton from './buttons/EditButton';
import PledgeButton from './buttons/PledgeButton';

import LikeProjectButton from './buttons/LikeProjectButton';

import { withStyles } from '@material-ui/core/styles';

import { CardActions, CardContent, CardMedia } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  avatar: {
    margin: 10,
  },
  card: {
    'background-color': '#F2F3F3',
    height: '25rem',
    width: '25rem',
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'space-between',
  },
  cardContent: {
    'margin-bottom': 'auto',
  },
  centered: {
    display: 'flex',
    justifyContent: 'left',
    'font-size': '2rem',
    'margin-bottom': '1rem',
  },
  chip: {
    margin: '1.5rem 1rem 1rem 0',
    borderRadius: '5px',
  },
  description: {
    'max-width': '24rem',
    'text-align': 'justify',
    'font-size': '1rem',
    'font-family': 'system-ui',
  },
  progress: {
    'margin-left': 'auto',
    color: '#48BF61',
  },
  row: {
    display: 'flex',
  },
  sidebar: {
    display: 'flex',
    'flex-direction': 'column',
  },
  smallText: {
    'margin-bottom': '0.25rem',
  },
  upvotes: {
    'font-size': '1rem',
  },
};

interface CardProps {
  project: {
    project_id: string,
    name?: string,
    description: string,
    status: string,
    estimated?: number,
    pledged?: number,
    upvotes: number,
    owner: string,
    size?: string,
    tags: [string],
    technologies: [string],
    pledgers?: [{
      name?: string,
      pledge?: number,
    }],
    contributors?: [{
      name?: string,
      contributed?: number,
    }]
    completed?: number,
    due_date?: string,
    hours_goal?: number,
    github_address: string,
    slack?: string,
    created: number,
    pledge: any;
  };
  handler?: () => void;
  toggleEdit?: () => void;
  classes?: any;
  liked: boolean;
}

interface DispatchProps {
  likeProject: any;
}

interface CardState {
  editOpen: boolean;
  pledgeOpen: boolean;
  liked: boolean;
}

// function getPercentage(pledged: number, estimated: number) {
//   if (!pledged || !estimated || pledged === 0) { return 1; }
//   return (pledged / estimated) * 100;
// }

const Pledge = WithAuth(['owner', 'user'])(PledgeButton);
const Edit = WithAuth(['owner', 'user'])(EditButton);
const Like = WithAuth(['user'])(LikeProjectButton);

export class ProjectCard extends React.Component<CardProps & DispatchProps, CardState>{

  constructor(props: CardProps & DispatchProps) {
    super(props);
    this.state = {
      editOpen: false,
      pledgeOpen: false,
      liked: false,
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.togglePledge = this.togglePledge.bind(this);
  }

  calculateOpenTime(timestamp: number) {
    const now = +new Date();
    const dateDifference = ((now - timestamp) / 1000) / (3600 * 24);
    return Math.floor(dateDifference);
  }

  toggleEdit() {
    this.setState({ editOpen: !this.state.editOpen });
  }

  togglePledge() {
    this.setState({ pledgeOpen: !this.state.pledgeOpen });
  }

  toggleLike() {
    this.setState((prevState: CardState) => ({
      liked: !prevState.liked,
    }));
  }

  handleLike() {
    const { project_id } = this.props.project;
    if (!this.state.liked) {
      this.props.likeProject(project_id)
        .then((response: any) => {
          this.toggleLike();
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  }

  // checkLikeStatus() {
    // const { project_id } = this.props.project;
    // call redux action to trigger getLikedProject API
    // map a list of id of the projectList and check if that list contains this project's id
    // if yes, set local liked state to true, otherwise false
  // }

  render() {
    const { classes } = this.props;
    const openedFor = this.calculateOpenTime(this.props.project.created);
    return (
      <div>
        <EditProjectDialog
          open={this.state.editOpen}
          toggleEdit={this.toggleEdit}
          project={this.props.project}
        />
        <PledgeDialog
          open={this.state.pledgeOpen}
          project={this.props.project}
          toggle={this.togglePledge}
        />
        <Card className={classes.card}>
          <CardMedia
            image="static/images/cards/circuit.png"
            title="Contemplative Reptile"
          />
          <CardContent className={classes.cardContent}>
            <Typography className={classes.centered}>
              {this.props.project.name}
            </Typography>
            <Typography className={classes.description} component="p">
              {this.props.project.description}
            </Typography>
            {this.props.project.technologies.map(technology => (
              <Chip className={classes.chip} key={technology} label={technology} />
            ))}
            <div className={classes.row}>
              <div className={classes.sidebar}>
                <Typography className={classes.smallText}>
                  Opened {openedFor} days ago
                </Typography>
                <Typography className={classes.smallText}>
                  Size: {this.props.project.size}
                </Typography>
              </div>
              <CircularProgress
                className={classes.progress}
                variant="determinate"
                size={80}
                value={80}
                // value={getPercentage(this.props.project.pledged!, this.props.project.estimated!)}
              />
            </div>
          </CardContent>
          <CardActions>
            <Pledge handler={this.togglePledge} label="Pledge" />
            <a href={this.props.project.github_address}>
              <IconButton aria-label="Git">
                <SvgIcon>
                  <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
                </SvgIcon>
              </IconButton>
            </a>
            <Edit handler={this.toggleEdit} />
            <Like liked={this.state.liked} handler={this.handleLike} project_id={this.props.project.project_id} />
            <Typography className={classes.upvotes}>{this.props.project.upvotes}</Typography>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    likeProject: (id: string) => dispatch(likeProject(id)),
  };
};

export default compose<{}, CardProps>(
  withStyles(styles, {
    name: 'ProjectCard',
  }),
  connect<{}, DispatchProps, CardProps>(null, mapDispatchToProps),
)(ProjectCard);

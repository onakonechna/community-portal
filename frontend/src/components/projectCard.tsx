import * as React from 'react';

import LikeProjectButton from './likeProjectButton';

import { withStyles } from '@material-ui/core/styles';

import { CardActions, CardContent, CardMedia } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import Edit from '@material-ui/icons/Edit';
import Share from '@material-ui/icons/Share';

// import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  avatar: {
    margin: 10,
  },
  centered: {
    align: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  chip: {
    margin: '5px 10px',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  sidebar: {
    display: 'flex',
    'flex-direction': 'column',
    marginTop: 30,
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
    created_date?: string,
  };
  handler?: () => void;
  classes: any;
}

function getPercentage(pledged: number, estimated: number) {
  if (!pledged || !estimated || pledged === 0) { return 1; }
  return (pledged / estimated) * 100;
}

function projectCard(props: CardProps) {
  const { classes } = props;
  return (
    <Card>
      <CardMedia
        image="static/images/cards/circuit.png"
        title="Contemplative Reptile"
      />
      <CardContent>
        <Typography className={classes.centered}>
          {props.project.name}
        </Typography>
        <Typography component="p">
          {props.project.description}
        </Typography>
        {props.project.technologies.map(technology => (
          <Chip className={classes.chip} key={technology} label={technology} />
        ))}
        <div className={classes.row}>
          <div className={classes.sidebar}>
            <Typography>
              Project Size: {props.project.size}
            </Typography>
            <Typography>
              Current Contributors:
            </Typography>
            <Typography>
              Open for: days
            </Typography>
            <Typography>
              Goal: {props.project.estimated} hours
            </Typography>
            <Typography>
              Pledged: {props.project.pledged} hours
            </Typography>
            <Typography>
              Upvotes: {props.project.upvotes}
            </Typography>
          </div>

          <CircularProgress
            variant="determinate"
            color="secondary"
            size={150}
            value={getPercentage(props.project.pledged!, props.project.estimated!)}
          />
        </div>
      </CardContent>
      <CardActions>
        <Button>View</Button>
        <Button>Pledge</Button>
        <a href={props.project.github_address}>
          <IconButton aria-label="Git">
            <SvgIcon>
              <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
            </SvgIcon>
          </IconButton>
        </a>
        <IconButton aria-label="Edit">
          <Edit />
        </IconButton>
        <IconButton aria-label="Share">
          <Share />
        </IconButton>
        <IconButton aria-label="Like">
          <LikeProjectButton project_id={props.project.project_id} />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default withStyles(styles)(projectCard);

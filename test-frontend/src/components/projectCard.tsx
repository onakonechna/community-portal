import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import { CardActions, CardContent, CardMedia } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import Favorite from '@material-ui/icons/Favorite';
import Grade from '@material-ui/icons/Grade';
import Share from '@material-ui/icons/Share';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = {
  avatar: {
    margin: 10
  },
  centered: {
    align: 'center', 
    display: 'flex',
    justifyContent: 'center'
  },
  chip: {
    'margin': '5px 10px'
  },
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
  sidebar: {
    display: 'flex',
    'flex-direction': 'column', 
    marginTop: 30
  }
}

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
        pledge?: number
      }],
      contributors?: [{
        name?: string,
        contributed?: number
      }]
      completed?: number,
      due_date?: string,
      hours_goal?: number,
      github?: string,
      slack?: string,
      created_date?: string 
    },
    handler?: () => void,
    classes: any
}

function getPercentage(pledged: number, estimated: number) {
  if (!pledged || !estimated || pledged === 0) {return 1;}
  console.log((pledged / estimated) * 100);
  return (pledged / estimated) * 100;
}

function ProjectCard(props: CardProps) {
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
              </div>
            
              <CircularProgress 
                variant="determinate"
                color="secondary"
                size={150}
                value={getPercentage(props.project.pledged!, props.project.estimated!)}
              />
            </div>
            <div className={classes.row}>
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/uxceo-128.jpg")} className={classes.avatar}/>
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/mayer.jpg")} className={classes.avatar}/>
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/sheryl.jpg")} className={classes.avatar}/>
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/musk.jpeg")} className={classes.avatar}/>
            </div>
          </CardContent>
          <CardActions>
            <Button>View</Button>
            <Button>Pledge</Button>
            <a href={props.project.github}>
              <IconButton aria-label="edit">
                <SvgIcon>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />            
                </SvgIcon>
              </IconButton>
            </a>
            <IconButton aria-label="Bookmark">
              <Grade />
            </IconButton>
            <IconButton aria-label="Share">
              <Share />
            </IconButton>
            <IconButton aria-label="Add to Favorites"> 
              <Favorite />
            </IconButton>
          </CardActions>
      </Card>
    )
}


export default withStyles(styles)(ProjectCard);
import * as React from 'react';

// import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
// import SvgIcon from '@material-ui/core/SvgIcon';
// import Typography from '@material-ui/core/Typography';

// import Avatar from '@material-ui/core/Avatar';
// import Chip from '@material-ui/core/Chip';

interface IProps {
    project: {
        id: string,
        title: string,
        description: string,
        technologies: [string],
        due_date: string,
        hours_goal: number,
        git_link: string,
        slack_link: string,
        contributors: {},
        created_date: string 
    }
}

function ProjectCard(props: IProps) {
    return (
        <Card>
            <Typography>
                {props.project.title}
            </Typography>
        </Card>
    )
}


export default ProjectCard;
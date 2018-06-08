import * as React from 'react';

import Grid from '@material-ui/core/Grid';
// import axios from 'axios';
const projectsData = require('../data/projects.json');

interface IProps {
    temp?: string
}

interface IProject {
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

interface IState {
    projects: IProject[]
}

class ProjectsGrid extends React.Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
        temp: 'hola'
      };

    public state: IState = {
        projects: projectsData
    };

    constructor(props: IProps) {
        super(props);
        this.updateGrid.bind(this);
    }

    public updateGrid() {
        console.log('Updating Grid');
    }

   
    public render() {
        return (
            <Grid 
                container
                direction='row'
                justify='flex-start'
                alignItems='flex-start'
                spacing={8}
            >
                {this.state.projects.map(project => (
                    <Grid item key={project.id}>
                        <p>{project.title}</p>
                    </Grid>
                ))}
            </Grid>
        )
    }
}

export default ProjectsGrid;
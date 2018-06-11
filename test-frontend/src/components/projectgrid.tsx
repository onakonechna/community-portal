import * as React from 'react';

import AddProjectDialog from './addProjectDialog';
import ProjectCard from './projectCard';

import Grid from '@material-ui/core/Grid';
// import axios from 'axios';
const projectsData = require('../data/projects.json');
const samples = require('../data/sampleProjects.json');


interface IContributor {
	name: string,
	pledge?: number
}

interface IProps {
	temp?: string,
	project?: {}
}

interface IProject {
	id: string,
	name: string,
	title?: string,
	description: string,
	technologies: [string],
	estimated: number,
	pledged?: number,
	due_date?: string,
	hours_goal?: number,
	github: string,
	slack?: string,
	size?: string,
	backers: [{
		name?: string,
		pledge?: number
	}],
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
		// const headers = {
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// }
		const projects: any = [];
		samples.map((project: any) => {
			let pledged = 20;
		  project.child_List = project.child_List ? project.child_List : []
			project.child_List.map((contributor: IContributor) => {
				pledged += contributor.pledge!;
				project.backers.push({
					name: contributor.name,
					pledge: contributor.pledge
				})
			});
			project.pledged = pledged;
			projects.push(project);
		})
		this.setState({ projects }, () => {
			console.log(this.state);
		});
	}

	componentDidMount() {
		this.updateGrid();
	}
	
	render() {
		return (
			<div style={{ padding: '40px 80px'}}>
				<Grid 
					container
					direction='row'
					justify-content='center'
					alignItems='flex-start'
					spacing={32}
				>
					{this.state.projects.map(project => (
						<Grid item key={project.id}>
							<ProjectCard 
								project={project} 
								handler={this.updateGrid.bind(this)}
							/>
						</Grid>
					))}
				</Grid>
				<AddProjectDialog />
			</div>
		)
	}
}

export default ProjectsGrid;
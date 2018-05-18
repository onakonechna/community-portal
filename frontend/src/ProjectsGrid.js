import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ProjectCard from './ProjectCard';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
var data = require('../data/projects.json');
import axios from 'axios'
import AddProjetDialog from './AddProjetDialog'

class ProjectsGrid extends React.Component {
    
      constructor(props) {
        super(props);
        this.state = {
          projects: []
        };
        this.updateGrid.bind(this);
      }

      updateGrid() {
        console.log('Updating Grid')
        var headers = {
          headers:  
          {
            'Content-Type': 'application/json'
          }  
        }
        axios.get('https://3c0juindy8.execute-api.us-east-1.amazonaws.com/Prod/projects', headers)
        .then(response => {
          //var response = data
          console.log(response)
          var projects = [];
          console.log(response.hasOwnProperty('data'))
          response.data.map(project => {
            //console.log(project);
            var projectMap = {
              "id": project.ident,
              "name": project.name,
              "description": project.description,
              "estimated": project.estimate ? project.estimate : 0,
              "github": project.github,
              "slack": project.slack,
              "size": project.size,
              "technologies": [],
              "backers": []
            }
            var pledged = 0;
            project.child_List = project.child_List ? project.child_List : []
            project.child_List.map(contributor => {
              pledged += contributor.pledge;
              projectMap.backers.push({
                name: contributor.name,
                pledge: contributor.pledge
              })
            })
            projectMap["pledged"] = pledged
            project.technologies_List = project.technologies_List ? project.technologies_List : []
            project.technologies_List.map(technology => {
              projectMap.technologies.push({
                name: technology.name
              })
            })
            projects.push(projectMap)
          })
          
          this.setState(
            {
              projects: projects
            }
          )
          console.log(this.state)
        }).catch(error => {
            console.log(error)
            // this.setState(
            //   {
            //     success: true,
            //     loading: false,
            //   })
          })    
      }
    
      componentDidMount() {
        // var _this = this;
        // this.serverRequest = 
        //   axios
        //     .get("http://codepen.io/jobs.json")
        //     .then(function(result) {    
        //       _this.setState({
        //         jobs: result.data.jobs
        //       });
        //     })

        this.updateGrid()

        
      }
    
      componentWillUnmount() {
        //this.serverRequest.abort();
      }
    
      render() {
        return (
          <div style={{ padding: 10 }}>
          
            <Grid container 
            direction='row'
            justify='flex-start'
            alignments='flex-start'
            spacing={8}>
              
                  {this.state.projects.map((project) => {
                    return (
                      <Grid item >

                          <ProjectCard project={project} handler={this.updateGrid.bind(this)} />

                      </Grid>  
                    );
                  })}
                
            </Grid>
            <AddProjetDialog handler={this.updateGrid.bind(this)}  />
          </div>  
        )
      }
    }      
    

export default ProjectsGrid;
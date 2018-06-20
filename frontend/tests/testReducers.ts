import {  OtherAction, ProjectLoadedAction, TypeKeys } from '../src/actions';
import projectReducer from '../src/reducers/project';

describe("test reducer", () => {
  const projects = [
    {
      "name": "World Cup Project",
      "description": "Who will win the world cup?",
      "size": "M",
      "due": 1527811200,
      "technologies": ["soccer", "luck", "penalty"], 
      "github_address": "www.github.com", 
      "estimated": 50, 
      "slack_channel": "www.slack.com", 
      "project_id": "ffd3f336-ab48-46c1-a85a-888c42f4a0f4"
    },
    {
      "name": "AWS",
      "description": "Amazon Web Service",
      "size": "XL",
      "due": 1527811210,
      "technologies": ["Java", "Hadoop"], 
      "github_address": "www.github.com/aws", 
      "estimated": 5000, 
      "slack_channel": "www.slack.com/aws", 
      "project_id": "ffd3f336-ab48-49u1-a85a-888c42f4a0f4"
    }
  ];

  const loadAction: ProjectLoadedAction = {
    type: TypeKeys.PROJECTS_LOADED,
    projects
  }

  const defaultAction: OtherAction = {
    type: TypeKeys.OTHER_ACTION
  }

  it("test projectLoading reducer", () => {
    expect(projectReducer([], loadAction)).toEqual(projects);
  })

  it("test empty reducer", () => {
    expect(projectReducer([], defaultAction)).toEqual([]);
  })
})


import { TypeKeys } from '../src/actions';
import * as actions from '../src/actions';

import * as fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const API = 'https://boebm330qg.execute-api.us-east-1.amazonaws.com/demo';

describe("test actions", () => {
  const projectList = [
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
    }
  ];

  const store = mockStore({ projects: [] });

  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it("test projectsLoaded action", () => {
    const expectedAction = {
      type: TypeKeys.PROJECTS_LOADED,
      projects: projectList
    };
    expect(actions.projectsLoaded(projectList)).toEqual(expectedAction);
  })

  it("test addProject action", () => {
    fetchMock.get(`${API}/project/cards`, projectList);
    fetchMock.post(`${API}/project/create`, projectList[0]);
    
    const expectedAction = {
      type: TypeKeys.PROJECTS_LOADED
    }

    return store.dispatch<any>(actions.addProject(projectList[0]))
      .then(() => {
        expect(store.getActions()).toEqual(expectedAction);
      })
  })

  it("test loadProject action", () => {
    const expectedAction = {
      type: TypeKeys.PROJECTS_LOADED,
      projects: projectList
    };

    fetchMock.getOnce(`${API}/project/cards`, projectList);

    return store.dispatch<any>(actions.loadProjects())
      .then(() => {
        console.log(store.getActions());
        expect(store.getActions()[0]).toEqual(expectedAction);
      })
  })

})
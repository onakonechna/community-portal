import * as actions from '../src/actions';
import { API } from '../src/api/config';

import * as fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
//declare const API_ENDPOINT: string;
//const API = API_ENDPOINT; //'https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev';

describe('test actions', () => {
  const projectList = [
    {
      name: 'World Cup Project',
      description: 'Who will win the world cup?',
      size: 'M',
      due: 1527811200,
      technologies: '[soccer, luck, penalty]',
      github_address: 'www.github.com',
      estimated: 50,
      slack_channel: 'www.slack.com',
      project_id: 'ffd3f336-ab48-46c1-a85a-888c42f4a0f4',
    },
  ];

  const store = mockStore({ projects: [] });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('test projectsLoaded action', () => {
    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };
    expect(actions.projectsLoaded(projectList)).toEqual(expectedAction);
  });

  it('test addProject action', () => {
    fetchMock.get(`${API}/projects`, projectList);
    fetchMock.post(`${API}/project`, projectList);
    // const expectedAction = {
    //   type: actions.TypeKeys.PROJECTS_LOADED,
    // };
    const expectedAction: any = [];

    return store.dispatch<any>(actions.addProject(projectList))
      .then(() => {
        expect(store.getActions()).toEqual(expectedAction);
      });
  });

  it('test editProject action', () => {
    fetchMock.get(`${API}/projects`, projectList);
    fetchMock.put(`${API}/project`, projectList);

    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };

    return store.dispatch<any>(actions.editProjectBody(projectList[0]))
      .then(() => {
        expect(store.getActions()[0]).toEqual(expectedAction);
      });
  });

  it('test loadProject action', () => {
    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };

    fetchMock.getOnce(`${API}/projects`, projectList);

    return store.dispatch<any>(actions.loadProjects())
      .then(() => {
        expect(store.getActions()[0]).toEqual(expectedAction);
      });
  });
});

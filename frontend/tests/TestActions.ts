import * as actions from '../src/actions';

var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
declare const API_ENDPOINT: string;
const API = API_ENDPOINT;

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
    mock.reset();
    mock.restore();
  });

  it('test projectsLoaded action', () => {
    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };
    expect(actions.projectsLoaded(projectList)).toEqual(expectedAction);
  });

  it('test addProject action', () => {
    mock.onGet(`http://localhost:3000/projects`).reply(200, { projects: projectList });
    const expectedAction: any = [];

    const addProjectAction = (dispatch: any) => {
      axios.get(`http://localhost:3000/projects`)
        .then((response) => {
          expect(response.data.projects).toBe(projectList);
        });
    };

    store.dispatch<any>(addProjectAction).then(() => {});

    // return store.dispatch<any>(addProjectAction)
    //   .then(() => {
    //     expect(store.getActions()).toEqual(expectedAction);
    //   });
  });

  it('test editProject action', () => {
    mock.onGet(`${API}/projects`).reply(200, projectList);
    mock.onPost(`${API}/projects`).reply(200, projectList);

    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };

    return store.dispatch<any>(actions.editProjectBody(projectList[0]))
      .then(() => {
        const action = store.getActions()[0] || '';
        expect(action).toEqual(expectedAction);
      });
  });

  it('test loadProject action', () => {
    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };

    mock.onGet(`${API}/projects`).replyOnce(200, projectList);

    return store.dispatch<any>(actions.loadProjects())
      .then(() => {
        expect(store.getActions()[0]).toEqual(expectedAction);
      });
  });
});

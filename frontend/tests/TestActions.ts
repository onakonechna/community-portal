import * as actions from '../src/actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const API = process.env.API_ENDPOINT_HOST;

xdescribe('test actions', () => {
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

  it('test projectsLoaded action', () => {
    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };
    expect(actions.projectsLoaded(projectList)).toEqual(expectedAction);
  });

  it('test addProject action', () => {
    const axiosMock = new MockAdapter(axios);
    axiosMock.onGet(`${API}/projects`).reply(200, projectList);
    axiosMock.onPost(`${API}/project`).reply(200, projectList);
    const expectedAction: any = [];

    return store.dispatch<any>(actions.addProject(projectList))
      .then(() => {
        expect(store.getActions()).toEqual(expectedAction);
      });
  });

  it('test editProject action', () => {
    const axiosMock = new MockAdapter(axios);
    axiosMock.onGet(`${API}/projects`).reply(200, projectList);
    axiosMock.onPut(`${API}/project`).reply(200, projectList);

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
    const axiosMock = new MockAdapter(axios);
    const expectedAction = {
      type: actions.TypeKeys.PROJECTS_LOADED,
      projects: projectList,
    };

    axiosMock.onGet(`${API}/projects`).replyOnce(200, projectList);

    return store.dispatch<any>(actions.loadProjects())
      .then(() => {
        expect(store.getActions()[0]).toEqual(expectedAction);
      });
  });
});

import { mount, shallow } from 'enzyme';
import * as React from 'react';

jest.mock('../src/components/Logo');

import { addProject, loadProjects } from '../src/actions';
import { AddProjectDialog } from '../src/components/AddProjectDialog';
import HeadBar from '../src/components/HeadBar';

import store from '../src/store';

import { ProjectGrid } from '../src/components/ProjectGrid';
const samples = require('../src/data/sampleProjects.json');

describe('HeadBar Test Suite', () => {
  it('should render without throwing an error', () => {
    const hasButton = shallow(<HeadBar />).contains(<span/>);
    expect(hasButton).toBeFalsy();
  });

  it('should render the navigation bar', () => {
    const context = { store };
    const wrapper = mount(<HeadBar />, { context, childContextTypes: { store: jest.fn() } });
    const paper = wrapper.find('Paper');
    expect(paper.props().elevation).toBe(4);
  });
});

describe('ProjectGrid Test Suite', () => {
  it('should render the project grid', () => {
    const user = {
      likedProjects: {
        indexOf: jest.fn(),
      },
      bookmarkedProjects: {
        indexOf: jest.fn(),
      },
    };
    const wrapper = shallow(<ProjectGrid projects={samples} loadProjects={loadProjects} user={user} />);
    const grids = wrapper.findWhere(g =>
      g.name() === 'WithStyles(Grid)' && g.prop('item') === true);
    expect(grids.length).toEqual(10);
  });
});

describe('AddProjectGrid Test Suite', () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(<AddProjectDialog classes={classes} addProject={addProject}/>);
    const toggleButton = wrapper.findWhere((b: any) => b.name() === 'Button');
    toggleButton.simulate('click');
  });
  const classes = {
    chip: 'chip',
    textField: 'textfield',
  };

  it('test AddProjectDialog open button', () => {
    const allButtons = wrapper.findWhere((b: any) => b.name() === 'Button');
    const radio = wrapper.find('RadioGroup');
    expect(allButtons.length).toEqual(4);
    expect(radio).toBeTruthy();
  });

  it('goal input should work', () => {
    const goalInput = wrapper.findWhere(
      (n: any) => n.name() === 'input' && n.prop('id') === 'goal');
    goalInput.simulate('change', { target: { name: 'updateName', value: 20 } });
    expect(wrapper.state('goal')).toEqual(20);
  });

});

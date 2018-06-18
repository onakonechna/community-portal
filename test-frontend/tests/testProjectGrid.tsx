import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { addProject } from '../src/actions';
import { AddProjectDialog } from '../src/components/addProjectDialog';
import HeadBar from '../src/components/headBar';

// import { createMount } from '@material-ui/core/test-utils';

// import { ProjectsGrid } from '../src/components/projectGrid';
// const samples = require('../src/data/sampleProjects.json');


describe('HeadBar Test Suite', () => {
 
  it('should render without throwing an error', () => {
    const hasButton = shallow(<HeadBar />).contains(<span/>);
    expect(hasButton).toBeFalsy();
  });

  it('should render the navigation bar', () => {
    const wrapper = mount(<HeadBar />);
    const paper = wrapper.find('Paper');

    expect(paper.props().elevation).toBe(4);
  })
})

// describe('ProjectGrid Test Suite', () => {
//   it('should render the project grid', () => {
//     const wrapper = mount(<ProjectsGrid projects={samples} loadProjects={loadProjects} />);
//     const dialog = wrapper.find('Dialog');
//     console.log(dialog.debug());

//     expect(dialog).toBeTruthy();
//   })
// })

describe('AddProjectGrid Test Suite', () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(<AddProjectDialog classes={classes} addProject={addProject}/>);
    const toggleButton = wrapper.findWhere((b: any) => b.name() === 'Button');
    toggleButton.simulate('click');
  })
  const classes = {
    chip: 'chip',
    textField: 'textfield'
  };
  it('test AddProjectDialog open button', () => {
    const allButtons = wrapper.findWhere((b: any) => b.name() === 'Button');
    const radio = wrapper.find('RadioGroup');
    expect(allButtons.length).toEqual(3);
    expect(radio).toBeTruthy();
  })
})


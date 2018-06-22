import { shallow } from 'enzyme';
import * as React from 'react';

import { editProjectBody } from '../src/actions';
import { EditProjectDialog } from '../src/components/EditProjectDialog';
const samples = require('../src/data/sampleProjects.json');

describe('EditProjectDialog Test Suite', () => {
  let wrapper : any;
  const classes = {
    chip: 'chip',
    textField: 'textfield',
  };
  beforeAll(() => {
    wrapper = shallow(<EditProjectDialog
      toggleEdit={() => { console.log('placeholder'); }}
      classes={classes}
      open={true}
      project={samples[0]}
      editProject={editProjectBody}
    />);
  });
  it('should render without throwing an error', () => {
    expect(wrapper).toBeTruthy();
  });

  it('shoule be able to edit name', () => {
    const nameInput = wrapper.findWhere((i: any) => i.name() === 'TextField' && i.prop('id') === 'name');
    nameInput.simulate('change', { target: { value: 'changed name' } });
    expect(wrapper.state('name')).toEqual('changed name');
  });
});

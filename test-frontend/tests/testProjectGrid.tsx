import { mount, shallow } from 'enzyme';
import * as React from 'react';

import CrowdSourcing from '../src/components/crowdsourcing';

// test('Check if the GitHub link on project card works', () => {
//   const projectGrid = shallow(<ProjectGrid />);
// });

describe('CrowdSourcing Test Suite', () => {
 
  it('should render without throwing an error', () => {
    const hasButton = shallow(<CrowdSourcing />).contains(<span/>);
    expect(hasButton).toBeFalsy();
  });

  it('should render the navigation bar', () => {
    const wrapper = mount(<CrowdSourcing />);

    // const appBar = wrapper.find('button').debug();

    const span = wrapper.find('Paper');

    console.log(span.debug());

    expect(span.exists()).toBeTruthy();
  })

})


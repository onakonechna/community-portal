import { mount, shallow } from 'enzyme';
import * as React from 'react';

import HeadBar from '../src/components/headBar';
// import ProjectGrid from '../src/components/projectGrid';


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

  // it('should render the project grid', () => {
  //   const wrapper = mount(<ProjectGrid/>);
  //   const cards = wrapper.find('ProjectCard');
  //   console.log(cards.debug());

  //   expect(cards.length).toBe(4);
  // })

})


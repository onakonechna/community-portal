import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';

enzyme.configure({ adapter: new Adapter() });

import CrowdSourcing from '../src/components/crowdsourcing';

// test('Check if the GitHub link on project card works', () => {
//   const projectGrid = shallow(<ProjectGrid />);
// });

describe('CrowdSourcing Test Suite', () => {
  it('should render without throwing an error', () => {
    const hasButton = enzyme.shallow(<CrowdSourcing />).contains(<span/>);
    expect(hasButton).toBeFalsy();
  });
})


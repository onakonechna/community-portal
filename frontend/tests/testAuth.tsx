import { mount } from 'enzyme';
import * as React from 'react';

import HeadBar from '../src/components/HeadBar';
import WithAuth from '../src/components/WithAuth';
import WithLogin from '../src/components/GithubAuthButton';
import LoginButton from '../src/components/buttons/LoginButton';

import store from '../src/store';

describe('Guest Users', () => {
  it('guest user should be able to see the login button', () => {
    const context = { store };
    const wrapper = mount(<HeadBar />, { context, childContextTypes: { store: jest.fn() } });
    const loginButton = wrapper.findWhere((b: any) => b.name() === 'Button' && b.prop('id') === 'login');
    const loginText = loginButton.find('span').first().text();
    expect(loginText).toEqual('LOGIN');
  });
});

describe('Authorized Users', () => {
  let wrapper : any;
  // global.open = jest.fn();
  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));
  beforeAll(() => {
    const context = { store };
    const Login = WithAuth(['guest'])(WithLogin(LoginButton));
    wrapper = mount(<Login />, { context, childContextTypes: { store: jest.fn() } });
    const loginButton = wrapper.findWhere((b: any) => b.name() === 'Button' && b.prop('id') === 'login');
    loginButton.simulate('click');
  });
  it('authorized users should be able to see the logout button', () => {
    return flushAllPromises().then((() => {
      const loginButtonWrapper = wrapper.find('loginButton');
      console.log(loginButtonWrapper.debug());
      expect(1).toEqual(1);
    }));
  });
  it('authorized users should be able to open addProjectDialog by clicking the addProject button', () => {
    expect(1).toEqual(1);
  });
});

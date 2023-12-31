/**
 * @jest-environment jsdom
 */
import React from 'react';
import { EnzymeSelector, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SignIn } from '../../../../../client/src/components/signin/signin';

jest.useFakeTimers();

describe('The sign in component', () => {
  let props: React.ComponentProps<typeof SignIn>;
  const focus = jest.fn();
  beforeEach(() => {
    jest.spyOn(React, 'createRef').mockImplementation(() => ({
      current: {
        focus,
      },
    }));
    props = {
      removeSignin: jest.fn(),
    };
  });

  afterEach(() => {
    // props = null;
    jest.clearAllMocks();
    focus.mockClear();
  });

  test('will render', () => {
    const wrapper = shallow(<SignIn {...props} />);
    expect(focus).toHaveBeenCalled();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('will reset the guest user', async () => {
    const wrapper = shallow<SignIn>(<SignIn {...props} />);
    wrapper.setState({ show: true });
    const loginButtons: EnzymeSelector = wrapper.find('Connect(LoginButtons)');
    loginButtons.props().guest();
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(wrapper.state().show).toBe(false);
    expect(props.removeSignin).toHaveBeenCalledTimes(1);
  });

  test('will remove component on blur', async () => {
    const wrapper = shallow<SignIn>(<SignIn {...props} />);
    wrapper.setState({ show: true });
    const signInModal: EnzymeSelector = wrapper.find({ className: 'signinmodal signshow' });
    signInModal.props().onBlur();
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(wrapper.state().show).toBe(false);
    expect(props.removeSignin).toHaveBeenCalledTimes(1);
  });
});

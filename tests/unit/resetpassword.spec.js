import Vue from 'vue';
import Vuetify from 'vuetify';
import sinon from 'sinon';
import Router from 'vue-router';
import { mount } from '@vue/test-utils';
import ResetPassword from '@/components/ResetPassword.vue';

jest.mock('axios');
Vue.config.silent = true;
Vue.use(Router);
Vue.use(Vuetify);

let wrapper;

beforeEach(() => {
  wrapper = mount(ResetPassword, {
    stubs: {
      RouterLink: '<div></div>',
    },
  });
});

describe('ResetPassword.vue', () => {
  it('mounts without error', () => {
    expect(wrapper.vm.$el).toBeTruthy();
  });

  it('won\'t allow a click if no password entered', () => {
    // enter an example password into field
    // check to see if an error was rendered
    const handleResetPassword = sinon.stub();
    wrapper.setMethods({ handleResetPassword });
    wrapper.find('.login-button').trigger('click');
    expect(handleResetPassword.called).toBe(false);
  });

  it('has a password field', () => {
    const passwordField = wrapper.find('#password');
    expect(passwordField.exists()).toBe(true);
  });

  it('password value can be changed', () => {
    const passwordField = wrapper.find('#password');
    passwordField.element.value = '123qweQWE';
    passwordField.trigger('input');
    expect(passwordField.element.value).toBe('123qweQWE');
    expect(wrapper.vm.password).toBe('123qweQWE');
  });

  it('validates a good password', ( )=> {
    let test = wrapper.vm.disableSubmit('123qweQWE');
    expect(test).toBe(false);
  });

  it('invalidates bad passwords', ()=>{
    let test = wrapper.vm.disableSubmit('123');
    expect(test).toBe(true);
  });

  it('will allow a click with valid password entered', () => {
    /**
     * Stubs the submit function
     * - inserts a valid password in to the reset field
     * - clicks the submit button
     * - makes sure that handleResetPassword will be called
     */
    const handleResetPassword = sinon.stub();
    wrapper.setMethods({ handleResetPassword });
    const passwordField = wrapper.find('#password');
    passwordField.element.value = '123qweQWE';
    passwordField.trigger('input');
    expect(wrapper.vm.password).toBe('123qweQWE');
    const loginButton = wrapper.find('.login-button');
    loginButton.trigger('click');
    expect(handleResetPassword.called).toBe(true);
  });

  it('will NOT allow submission with invalid password entered', () => {
    /**
     * Stubs the submit function
     * - inserts an INVALID password in to the reset field
     * - clicks the submit button
     * - makes sure that handleResetPassword will be called
     */
    const handleResetPassword = sinon.stub();
    wrapper.setMethods({ handleResetPassword });
    const passwordField = wrapper.find('#password');
    // insufficient password
    passwordField.element.value = '123';
    passwordField.trigger('input');
    const loginButton = wrapper.find('.login-button');
    loginButton.trigger('click');
    expect(handleResetPassword.called).toBe(false);
  });

  it('will NOT submit without an input', () => {
    /**
     * Stubs the submit function
     * - enters no input into the password field
     * - clicks the submit button
     * - makes sure that handleResetPassword will be called
     */
    const handleResetPassword = sinon.stub();
    wrapper.setMethods({ handleResetPassword });
    // input step omitted
    const loginButton = wrapper.find('.login-button');
    loginButton.trigger('click');
    expect(handleResetPassword.called).toBe(false);
  });
});
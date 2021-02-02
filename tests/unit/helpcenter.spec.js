import Vue from 'vue';
import Vuetify from 'vuetify';
import sinon from 'sinon';
import { mount } from '@vue/test-utils';
import HelpCenter from '@/components/HelpCenter.vue';
Vue.config.silent = true;
Vue.use(Vuetify);

let wrapper;
beforeEach(() => {
  wrapper = mount(HelpCenter, {
    stubs: {
      RouterLink: '<div></div>',
    },
  });
});

describe('HelpCenter.vue', () => {
  it('mounts without error', () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it('has a help input field', () => {
    let inputField = wrapper.find('textarea[name="comments"]');
    expect(inputField).toBeTruthy();
  });

  it('will not submit a comment without a message', () => {
    let submitFunction = sinon.stub();
    wrapper.setMethods({submit: submitFunction});
    wrapper.find('button[name="send-comments"]').trigger('click');
    expect(submitFunction.called).toBe(false);
  });

  it('will submit comment with message', () => {
    let submitFunction = sinon.stub();
    wrapper.setMethods({submit: submitFunction});
    let inputField = wrapper.find('textarea[name="comments"]');
    inputField.setValue('This is a test comment');
    wrapper.find('button[name="send-comments"]').trigger('click');
    expect(submitFunction.called).toBe(true);
  });

  it('pressing clear removes a message', () => {
    /**
     * proves that the clear button works as expected
     */
    let submitFunction = sinon.stub();
    wrapper.setMethods({submit: submitFunction});
    let inputField = wrapper.find('textarea[name="comments"]');
    inputField.setValue('This is a test comment');
    expect(wrapper.vm.comments).toBeTruthy();
    wrapper.find('button[name="clear-comments"]').trigger('click');
    expect(wrapper.vm.comments).toBeFalsy();
  });

  it('has more than 3 faqs', () => {
    expect(wrapper.vm.faqs.length).toBeGreaterThan(3);
  });
});
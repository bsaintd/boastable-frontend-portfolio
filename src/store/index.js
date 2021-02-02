import Vue from 'vue';
import Vuex from 'vuex';
import actions from './modules/actions';
import account from './modules/account';
import auth from './modules/auth';
import customer from './modules/customer';
import help from './modules/help';
import notifications from './modules/notifications';
import payment from './modules/payment';
import register from './modules/register';
import questions from './modules/questions';
import survey from './modules/survey';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account,
    actions,
    auth,
    customer,
    help,
    notifications,
    payment,
    questions,
    register,
    survey,
  },
});

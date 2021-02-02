import _ from 'lodash';
import { apolloClient } from '@/graphql/apollo';
import { REGISTER_USER_MUTATION } from '@/graphql/mutations/userMutations';
import ApiService from '@/services/apiService';
import {
  CHECK_IS_NEW_ACCOUNT,
  CHECK_IS_NEW_PHONE,
  COLLECT_SIGNUP_DATA,
  REGISTER,
  LOGIN,
  HANDLE_INFO,
  HANDLE_ERROR,
} from '../actionTypes';
import {
  SET_SIGNUP_DATA,
} from '../mutationTypes';

const state = {
  signUpData: {
    auth: {
      email: '',
      password: '',
    },
    account: {
      first_name: '',
      last_name: '',
      company_name: '',
      phone: '',
    },
  },
};

const getters = {
  getSignUpData(state) {
    return state.signUpData;
  },
  getSignUpAccount(state) {
    return state.signUpData.account;
  },
  getSignUpEmail(state) {
    return state.signUpData.auth.email;
  },
};

const actions = {
  // send SignUp forms data {object} to mutation to add to state.signUpData {object}
  [CHECK_IS_NEW_ACCOUNT]({ dispatch }, email) {
    return ApiService.get(`/new-email/${email}`)
      .then(({ data }) => {
        if (!data.new) {
          dispatch(HANDLE_INFO, 'Cannot use that email address, already in use.');
        }
        return data.new;
      });
  },
  [CHECK_IS_NEW_PHONE]({ dispatch }, phone) {
    return ApiService.get(`/new-phone/${phone}`)
      .then(({ data }) => {
        if (!data.new) {
          dispatch(HANDLE_INFO, 'Cannot use that phone number, already in use.');
        }
        return data.new;
      });
  },
  // send SignUp forms data {object} to mutation to add to state.signUpData {object}
  [COLLECT_SIGNUP_DATA]({ commit }, signUpData) {
    commit(SET_SIGNUP_DATA, signUpData);
  },
  // submit Registration/SignUp data to the api

  [REGISTER]({ dispatch }) {
    const credentials = _.get(state, 'signUpData.auth');
    const user = _.merge(state.signUpData.auth, state.signUpData.account);
    return apolloClient.mutate({
      mutation: REGISTER_USER_MUTATION,
      variables: { user },
    })
      .then(() => dispatch(LOGIN, credentials))
      .catch((reason) => {
        dispatch(HANDLE_ERROR, _.get(reason, 'message'));
      });
  },
};

const mutations = {
  // add data inside the received SignUp forms data {object} to state.signUpData {object}
  [SET_SIGNUP_DATA](state, signUpData) {
    state.signUpData = Object.assign({}, state.signUpData, signUpData);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

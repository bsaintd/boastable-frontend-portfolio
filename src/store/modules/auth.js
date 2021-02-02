import ApiService from '@/services/apiService';
import JwtService from '@/services/jwtService';
import { CHECK_AUTH,
  LOGIN,
  LOGOUT,
  HANDLE_INFO,
  HANDLE_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_REQUEST } from '../actionTypes';
import { SET_AUTH, SET_HEADER, PURGE_AUTH, SET_AUTH_REGISTRATION } from '../mutationTypes';

const state = {
  user: {},
  payload: {},
  isAuthenticated: false,
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
};

const actions = {
  [LOGIN]({ dispatch, commit }, credentials) {
    return ApiService.post('/login', credentials)
      .then(({ data }) => {
        commit(SET_AUTH, data.token);
        return data;
      })
      .catch(() => {
        commit(PURGE_AUTH);
        dispatch(HANDLE_ERROR, 'Email or password is incorrect');
      });
  },
  [LOGOUT]({ commit }) {
    commit(PURGE_AUTH);
    return Promise.resolve();
  },
  [CHECK_AUTH]({ commit }) {
    if (JwtService.getToken()) {
      commit(SET_HEADER);
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  },
  [RESET_PASSWORD_REQUEST]({ dispatch }, payload) {
    return ApiService.post('/reset-password', payload)
      .then(() => dispatch(HANDLE_INFO, 'Password reset request sent'))
      .catch(() => dispatch(HANDLE_ERROR, 'There was a problem with your request'));
  },
  [RESET_PASSWORD]({ dispatch }, payload) {
    const { id, password } = payload;
    return ApiService.put(`/reset-password?shortid=${id}`, { password })
      .then(() => dispatch(HANDLE_INFO, 'Your password has been reset successfully'))
      .catch(() => dispatch(HANDLE_ERROR, 'There was a problem resetting your password'));
  },
};

const mutations = {
  [SET_AUTH](state, token) {
    Object.assign(state.user, { token });
    state.error = {};
    JwtService.saveToken(state.user.token);
    state.payload = JwtService.getTokenPayload();
    ApiService.setHeader();
    state.isAuthenticated = true;
  },
  [SET_AUTH_REGISTRATION](state, token) {
    Object.assign(state.user, { token });
    state.error = {};
    JwtService.saveToken(state.user.token);
    state.payload = JwtService.getTokenPayload();
    ApiService.setHeader();
  },
  [SET_HEADER](state) {
    ApiService.setHeader();
    state.payload = JwtService.getTokenPayload();
    state.isAuthenticated = true;
  },
  [PURGE_AUTH](state) {
    state.user = {};
    state.error = {};
    JwtService.destroyToken();
    ApiService.clearHeader();
    state.isAuthenticated = false;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

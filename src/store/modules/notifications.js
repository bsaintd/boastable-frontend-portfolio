import { CONSOLE_LOG_ONLY, HANDLE_ERROR, HANDLE_INFO } from '../actionTypes';
import { CLEAR_NOTIFIER, SET_CONSOLE_LOG, SET_ERROR, SET_INFO } from '../mutationTypes';

const state = {
  error: null,
  info: null,
  log: null,
};

const getters = {
  getError(state) {
    return state.error;
  },
  getInfo(state) {
    return state.info;
  },
  getLog(state) {
    return state.log;
  },
};

const actions = {
  // Receive message from another vuex store module
  [CONSOLE_LOG_ONLY]({ commit }, msgToLog) {
    commit(SET_CONSOLE_LOG, msgToLog);
    // set message variable for mutation to console log and delay action with setTimeout()
    const resetLog = () => {
      commit(CLEAR_NOTIFIER);
    };
    setTimeout(resetLog, 7000);
  },
  // Receive error from another vuex store module
  [HANDLE_ERROR](context, error) {
    context.commit(SET_ERROR, error);
    // set variable for mutation and delay action with setTimeout()
    const resetError = () => {
      context.commit(CLEAR_NOTIFIER);
    };
    setTimeout(resetError, 7000);
  },
  // Receive info from another vuex store module
  [HANDLE_INFO](context, info) {
    context.commit(SET_INFO, info);
    // set variable for mutation and delay action with setTimeout()
    const resetInfo = () => {
      context.commit(CLEAR_NOTIFIER);
    };
    setTimeout(resetInfo, 7000);
  },
};

const mutations = {
  [CLEAR_NOTIFIER](state) {
    state.error = null;
    state.info = null;
    state.log = null;
  },
  [SET_CONSOLE_LOG](state, msgToLog) {
    state.log = msgToLog;
    // eslint-disable-next-line no-console
    console.log(msgToLog);
  },
  [SET_ERROR](state, error) {
    state.error = error;
    // eslint-disable-next-line no-console
    console.log(state.error);
  },
  [SET_INFO](state, info) {
    state.info = info;
    // eslint-disable-next-line no-console
    console.info(state.info);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

import ApiService from '@/services/apiService';
import { SEND_COMMENT, HANDLE_ERROR, HANDLE_INFO } from '../actionTypes';
import { TOGGLE_MAIL_STATUS } from '../mutationTypes';

const state = {
  list: [],
  card: '',
  mailStatus: false,
};

const getters = {
  getMailStatus(state) {
    return state.mailStatus;
  },
};

const actions = {
  [SEND_COMMENT]({ dispatch, commit }, comment) {
    return ApiService.post('/comment', { comment })
      .then(() => {
        dispatch(HANDLE_INFO, 'Your comment was sent to headquarters!');
        commit(TOGGLE_MAIL_STATUS);
        const resetMailStatus = () => {
          commit(TOGGLE_MAIL_STATUS);
        };
        setTimeout(resetMailStatus, 7000);
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
};
const mutations = {
  [TOGGLE_MAIL_STATUS](state) {
    state.mailStatus = !state.mailStatus;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};

import ApiService from '@/services/apiService';
import { LIST_CUSTOMERS, HANDLE_ERROR } from '../actionTypes';
import { SET_CUSTOMERS } from '../mutationTypes';

const state = {
  list: [],
};

const getters = {
  getCustomers(state) {
    return state.list;
  },
};

const actions = {
  [LIST_CUSTOMERS]({ commit, dispatch }) {
    return ApiService.get('/customer/list')
      .then(({ data }) => {
        commit(SET_CUSTOMERS, data);
        return data;
      })
      .catch(({ response }) => {
        dispatch(
          HANDLE_ERROR,
          `${response.status} : ${response.statusText} : Please try again`,
        );
      });
  },
};

const mutations = {
  [SET_CUSTOMERS](state, data) {
    state.list = data;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

import _ from 'lodash';
import ApiService from '@/services/apiService';
import {
  GET_ACCOUNT,
  UPDATE_ACCOUNT,
  HANDLE_ERROR,
  HANDLE_INFO,
} from '../actionTypes';
import { SET_ACCOUNT } from '../mutationTypes';


const state = {
  first_name: '',
  last_name: '',
  company_name: '',
  phone: '',
  description: '',
  google_business_name: '',
  google_place_id: '',
  hide_place_id_reminder: false,
  boastable_name: '',
};

const getters = {
  getAccount(state) {
    return state;
  },
};

const actions = {
  [GET_ACCOUNT]({ commit, dispatch }) {
    return ApiService.get('/user')
      .then(({ data }) => {
        commit(SET_ACCOUNT, data);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
  [UPDATE_ACCOUNT]({ commit, dispatch }, payload) {
    return ApiService.put('/user', payload)
      .then(({ data }) => {
        commit(SET_ACCOUNT, data);
        dispatch(HANDLE_INFO, 'Updated account info successfully');
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, response.data.message || `${response.status} : ${response.statusText} : Please try again`);
      });
  },
};

const mutations = {
  [SET_ACCOUNT](state, payload) {
    _.merge(state, payload);
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

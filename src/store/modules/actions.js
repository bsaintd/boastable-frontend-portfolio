import ApiService from '@/services/apiService';
import {
  LIST_ACTIONS,
  HANDLE_ERROR,
} from '../actionTypes';
import { SET_ACTIONS } from '../mutationTypes';

const state = {
  list: [],
  google_reviews: 0,
  yelp_clicks: 0,
  open_survey: 0,
};

const actions = {
  [LIST_ACTIONS]({ commit, dispatch }, type) {
    let params = '';
    if (type) {
      params = `?type=${type}`;
    }
    return ApiService.get(`/action/list${params}`)
      .then(({ data }) => {
        commit(SET_ACTIONS, data);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
};

const mutations = {
  [SET_ACTIONS](state, payload) {
    state.list = payload;
    state.google_reviews = state.list.filter(({ action }) => action === 'CLICK_GOOGLE_REVIEW').length;
    state.yelp_clicks = state.list.filter(({ action }) => action === 'CLICK_YELP_REVIEW').length;
    state.open_survey = state.list.filter(({ action }) => action === 'OPEN_SURVEY').length;
  },
};

export default {
  state,
  actions,
  mutations,
};

import ApiService from '@/services/apiService';
import {
  LIST_QUESTIONS,
  ADD_QUESTION,
  REMOVE_QUESTION,
  UPDATE_QUESTION,
  HANDLE_ERROR,
  HANDLE_INFO,
} from '../actionTypes';
import { SET_QUESTIONS } from '../mutationTypes';

const state = {
  listOfQuestions: [],
};

const getters = {
  getListOfQuestions(state) {
    return state.listOfQuestions;
  },
};

const actions = {
  [LIST_QUESTIONS]({ commit, dispatch }) {
    return ApiService.get('/question/list')
      .then(({ data }) => {
        commit(SET_QUESTIONS, data);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
  [ADD_QUESTION]({ dispatch }, payload) {
    return ApiService.post('/question', payload)
      .then(({ data }) => {
        dispatch(HANDLE_INFO, 'Added new question successfully');
        dispatch(LIST_QUESTIONS);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
  [REMOVE_QUESTION]({ dispatch }, id) {
    return ApiService.delete(`/question?_id=${id}`)
      .then(({ data }) => {
        dispatch(HANDLE_INFO, 'Removed question successfully');
        dispatch(LIST_QUESTIONS);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
  [UPDATE_QUESTION]({ dispatch }, payload) {
    // eslint-disable-next-line
    return ApiService.put(`/question?_id=${payload._id}`, payload)
      .then(({ data }) => {
        dispatch(HANDLE_INFO, 'Updated question successfully');
        dispatch(LIST_QUESTIONS);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
};

const mutations = {
  [SET_QUESTIONS](state, listOfQuestions) {
    state.listOfQuestions = listOfQuestions;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

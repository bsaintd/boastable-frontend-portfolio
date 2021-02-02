import ApiService from '@/services/apiService';
import {
  ANSWER_YES,
  ANSWER_NO,
  CONSOLE_LOG_ONLY,
  GET_SURVEY,
  GET_SURVEY_TEMPLATE,
  UPDATE_SURVEY_TEMPLATE,
  SEND_FEEDBACK,
  SEND_SURVEY,
  TEST_SURVEY,
  LIST_SURVEYS,
  TRACK_ACTION,
  HANDLE_ERROR,
  HANDLE_INFO,
} from '../actionTypes';
import { SET_SURVEY, SET_SURVEY_LIST, SET_SURVEY_TEMPLATE } from '../mutationTypes';

const state = {
  survey: {
    answers: [],
    demo: false,
    settings: {
      ownerFeedback: null,
      introduction: '',
      farewell: '',
      backgroundImage: '',
      custom: {
        text: '',
        link: '',
      },
    },
    business: {
      company_name: '',
      google_place_id: '',
    },
  },
  customer: {},
  company: {
    company_name: '',
    phone: '',
    first_name: '',
    last_name: '',
  },
  auth: '',
  list: [],
  settings: {
    ownerFeedback: null,
    introduction: '',
    backgroundImage: '',
    farewell: '',
    custom: {
      text: '',
      link: '',
    },
  },
};

const getters = {
  getSurveys(state) {
    return state.list;
  },
  getSurveySettings(state) {
    return state.settings;
  },
  getAnswers(state) {
    return state.survey.answers;
  },
  getCustomer(state) {
    return state.customer;
  },
  getCustomerId(state) {
    return state.customer._id;
  },
  getAuthId(state) {
    return state.customer.auth;
  },
  getAnswerBody(state) {
    return {
      customer: state.customer._id,
      auth: state.customer.auth,
    };
  },
};

const actions = {
  [GET_SURVEY_TEMPLATE]({ commit, dispatch }) {
    return ApiService.get('/survey-template')
      .then(({ data }) => {
        commit(SET_SURVEY_TEMPLATE, data);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
  [UPDATE_SURVEY_TEMPLATE]({ dispatch }, payload) {
    return ApiService.put('/survey-template', payload)
      .then(({ data }) => {
        dispatch(HANDLE_INFO, 'Updated survey settings successfully');
        return data;
      })
      .then(() => {
        dispatch(GET_SURVEY_TEMPLATE);
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
  [SEND_FEEDBACK]({ dispatch }, message) {
    return ApiService.put(`/customer-message?shortid=${state.survey.shortid}`, {
      customer_message: message,
    })
      .then(({ data }) => {
        dispatch(CONSOLE_LOG_ONLY, 'Added feedback to survey');
        return data;
      })
      .catch(({ response }) => {
        dispatch(
          CONSOLE_LOG_ONLY,
          `${response.status} : ${response.statusText} : Please try again`,
        );
      });
  },
  [LIST_SURVEYS]({ commit, dispatch }) {
    return ApiService.get('/survey/list')
      .then(({ data }) => {
        commit(SET_SURVEY_LIST, data);
        return data;
      })
      .catch(({ response }) => {
        dispatch(HANDLE_ERROR, `${response.status} : ${response.statusText} : Please try again`);
      });
  },
  [TEST_SURVEY]({ dispatch }) {
    const testSurvey = ApiService.post('/survey').then(({ data }) => {
      dispatch(HANDLE_INFO, 'Test survey initiated');
      return data;
    });
    return testSurvey;
  },
  [SEND_SURVEY]({ dispatch }, payload) {
    let sendSurvey = null;
    if (payload.phone || payload.email) {
      sendSurvey = ApiService.post('/survey', payload)
        .then(() => {
          dispatch(HANDLE_INFO, 'Request for review successfully sent');
        })
        .catch(({ response }) => {
          if (response) {
            const { message } = response.data;
            dispatch(HANDLE_ERROR, message || `${response.status}: ${response.statusText}`);
          } else if (!response) {
            dispatch(HANDLE_ERROR, 'Error submitting review request to server');
          }
        });
    } else {
      sendSurvey = dispatch(
        HANDLE_ERROR,
        'Please enter in either a valid phone number or an email address to send review request',
      );
    }
    return sendSurvey;
  },
  [GET_SURVEY]({ commit, dispatch }, shortid) {
    return ApiService.get(`/survey/${shortid}`)
      .then(({ data }) => {
        commit(SET_SURVEY, data);
        return data;
      })
      .catch(({ response }) => {
        dispatch(
          CONSOLE_LOG_ONLY,
          `${response.status} : ${response.statusText} : Please try again`,
        );
      });
  },
  [ANSWER_YES]({ dispatch }, answerId) {
    const answerBody = {
      value: true,
    };
    return ApiService.put(`/answer?_id=${answerId}`, answerBody)
      .then(({ data }) => {
        dispatch(CONSOLE_LOG_ONLY, 'You answered "Yes"');
        return data;
      })
      .catch(({ response }) => {
        dispatch(
          CONSOLE_LOG_ONLY,
          `${response.status} : ${response.statusText} : Please try again`,
        );
      });
  },
  [ANSWER_NO]({ dispatch }, answerId) {
    const answerBody = {
      value: false,
    };
    return ApiService.put(`/answer?_id=${answerId}`, answerBody)
      .then(({ data }) => {
        dispatch(CONSOLE_LOG_ONLY, 'You answered "No"');
        return data;
      })
      .catch(({ response }) => {
        dispatch(
          CONSOLE_LOG_ONLY,
          `${response.status} : ${response.statusText} : Please try again`,
        );
      });
  },
  [TRACK_ACTION]({ dispatch, state }, action) {
    const payload = {
      customer: state.customer._id,
      auth: state.customer.auth,
      action,
    };
    return ApiService.post('/action', payload)
      .then(({ data }) => data)
      .catch(({ response }) => {
        dispatch(
          CONSOLE_LOG_ONLY,
          `${response.status} : ${response.statusText} : Please try again`,
        );
      });
  },
};

const mutations = {
  [SET_SURVEY](state, data) {
    state.survey = data.survey;
    state.auth = data.survey.auth;
    state.customer = data.customer;
    state.answers = data.survey.answers.reverse();
    state.company = data.company;
    state.settings = data.settings;
  },
  [SET_SURVEY_LIST](state, data) {
    state.list = data;
  },
  [SET_SURVEY_TEMPLATE](state, data) {
    state.settings = data;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

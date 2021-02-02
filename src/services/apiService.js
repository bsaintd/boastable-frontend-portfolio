import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import JwtService from './jwtService';
import { API_URL } from '../apiConfig';

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
  },

  setHeader() {
    Vue.axios.defaults.headers.common.Authorization = `bearer ${JwtService.getToken()}`;
  },

  clearHeader() {
    delete Vue.axios.defaults.headers.common.Authorization;
  },

  query(route, params) {
    return Vue.axios.get(route, params);
  },

  get(route) {
    return Vue.axios.get(route);
  },

  post(route, params) {
    return Vue.axios.post(route, params);
  },

  update(route, params) {
    return Vue.axios.put(route, params);
  },

  put(route, params) {
    return Vue.axios.put(route, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource);
  },
};

export default ApiService;

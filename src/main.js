// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import ApiService from '@/services/apiService';
import { CHECK_AUTH } from '@/store/actionTypes';
import App from './App';
import router from './router';
import store from './store';
import { apolloProvider } from './graphql/apollo';

Vue.use(Vuetify, {
  theme: {
    primary: '#0f3c59',
    ltprimary: '#295d80',
    secondary: '#ee6d58',
    accent: '#ee6d58',
    error: '#b71c1c',
    // error: '#FA0006',
    info: '#FFF',
    success: '#186B24',
    warning: '#FFC107',
    context: '#6F6F6F',
  },
});
Vue.use(require('vue-moment'));

ApiService.init();
Vue.config.productionTip = false;

// Prevent access to views that require authentication for access
router.beforeEach((to, from, next) => {
  store
    .dispatch(CHECK_AUTH, to)
    .then(() => {
      if (to.name === 'Login' || to.name === 'SignUp') {
        next({ name: 'Dashboard' });
      } else {
        next();
      }
    })
    .catch(() => {
      if (to.meta.auth) {
        next({ name: 'Login' });
      } else {
        next();
      }
    });
});

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  router,
  apolloProvider,
  components: { App },
  template: '<App/>',
});

import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import AccountSettings from '@/components/AccountSettings';
import Login from '@/components/Login';
import SignUpStepper from '@/components/SignUpStepper';
import SurveySetup from '@/components/survey-setup/SurveySetup';
import HelpCenter from '@/components/HelpCenter';
import Answers from '@/components/Answers';
import Survey from '@/components/survey/Survey';
import ResetPassword from '@/components/ResetPassword';
import ResetPasswordRequest from '@/components/ResetPasswordRequest';
import TermsConditions from '@/components/TermsConditions';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        auth: true, // authentication required
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        auth: false,
      },
    },
    {
      path: '/account',
      name: 'AccountSettings',
      component: AccountSettings,
      meta: {
        auth: true, // authentication required
      },
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUpStepper,
      meta: {
        auth: false,
      },
    },
    {
      path: '/terms-and-conditions',
      name: 'TermsConditions',
      component: TermsConditions,
      meta: {
        auth: false, // authentication required
      },
    },
    {
      path: '/survey-setup',
      name: 'SurveySetup',
      component: SurveySetup,
      meta: {
        auth: true, // authentication required
      },
    },
    {
      path: '/help',
      name: 'HelpCenter',
      component: HelpCenter,
      meta: {
        auth: true, // authentication required
      },
    },
    {
      path: '/answers',
      name: 'Answers',
      component: Answers,
      meta: {
        auth: true, // authentication required
      },
    },
    {
      path: '/swipe/:shortid',
      name: 'Survey',
      component: Survey,
      meta: {
        auth: false,
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPasswordRequest',
      component: ResetPasswordRequest,
      meta: {
        auth: false,
      },
    },
    {
      path: '/reset-password/:shortid',
      name: 'ResetPassword',
      component: ResetPassword,
      meta: {
        auth: false,
      },
    },
    {
      path: '*',
      redirect: '/',
      meta: {
        auth: false,
      },
    },
  ],
});

import ApiService from '@/services/apiService';
import _ from 'lodash';
import {
  GET_STRIPE_MEMBERSHIP,
  CHANGE_STRIPE_DATA,
  CANCEL_MEMBERSHIP,
  RESUBSCRIBE,
  COLLECT_CURRENT_BILLING_INFO,
  COLLECT_STRIPE_DATA,
  HANDLE_ERROR,
  HANDLE_INFO,
  SUBSCRIBE_STRIPE,
  ACTIVATE_MEMBERSHIP,
  CONFIRM_MEMBERSHIP_PLAN,
} from '../actionTypes';
import {
  SET_CURRENT_BILLING_INFO,
  SET_MEMBERSHIP_DATA,
  TOGGLE_CHANGE_PLAN_MODAL,
  SET_STRIPE_DATA,
} from '../mutationTypes';

const state = {
  membership: {
    start_date: null,
    next_billing_date: null,
    amount: 0,
    active: false,
    status: '',
    planType: '',
    smsRemaining: 0,
    hasCard: false,
  },
  currentBillingInfo: {
    address_city: '',
    address_line1: '',
    address_line2: '',
    address_state: '',
    address_zip: '',
    brand: '',
    last4: 'XXXX',
    name: '',
  },
  stripeData: {
    card: {
      address_city: '',
      address_line1: '',
      address_line2: '',
      address_state: '',
      address_zip: '',
      brand: '',
      last4: 'XXXX',
      name: '',
    },
  },
  subscription: {
    source: '',
  },
  changePlanVisible: false,
};

const getters = {
  getBillingInfo(state) {
    return state.currentBillingInfo;
  },
  getSignUpCard(state) {
    return state.stripeData.card;
  },
};

const actions = {
  [GET_STRIPE_MEMBERSHIP]({ commit }) {
    return ApiService.get('/membership')
      .then(({ data }) => {
        const subscription = _.get(data, 'customer.subscriptions.data[0]') || { plan: { amount: 0 } };
        // eslint-disable-next-line
        const { plan } = subscription;
        const {
          // eslint-disable-next-line
          current_period_end,
          created } = subscription;
          // eslint-disable-next-line
        const amount = Number(plan.amount / 100);
        // eslint-disable-next-line
        const next_billing_date = current_period_end ? new Date(current_period_end*1000) : null;
        // eslint-disable-next-line
        const start_date = created ? new Date(created*1000) : null;

        const active = subscription.status === 'active' || subscription.status === 'trialing';

        let { status, planType, smsRemaining, hasCard } = data;
        hasCard = hasCard || false;
        status = status || '';
        planType = planType || '';
        smsRemaining = (smsRemaining) ? Number(smsRemaining) : 0;

        commit(SET_MEMBERSHIP_DATA,
          { start_date,
            next_billing_date,
            amount,
            active,
            status,
            planType,
            smsRemaining,
            hasCard,
          });
      });
  },
  [COLLECT_STRIPE_DATA]({ commit }, stripeData) {
    commit(SET_STRIPE_DATA, stripeData);
  },
  [CHANGE_STRIPE_DATA]({ dispatch }) {
    let stripeChange;
    if (!state.subscription.source) {
      stripeChange = dispatch(HANDLE_ERROR, "Couldn't validate payment information");
    } else {
      stripeChange = ApiService.post('/stripe/change-card', state.subscription).then(() =>
        dispatch(HANDLE_INFO, 'Payment method successfully updated'),
      );
    }
    return stripeChange;
  },
  // get the current billing info from the api, which will get the data from stripe directly
  [COLLECT_CURRENT_BILLING_INFO]({ commit }) {
    ApiService.get('/card')
      .then(({ data }) => {
        commit(SET_CURRENT_BILLING_INFO, data);
      })
      .catch(() => {
        // dispatch(HANDLE_INFO, 'No card on file.');
      });
  },
  [SUBSCRIBE_STRIPE]({ dispatch }) {
    const subscribe = ApiService.post('/subscription', state.subscription)
      .then(() => dispatch(HANDLE_INFO, 'Account successfully created'))
      .catch(() => dispatch(HANDLE_ERROR, 'Was not able to complete subscription'));
    return subscribe;
  },
  [CANCEL_MEMBERSHIP]({ dispatch }) {
    return ApiService.delete('/membership')
      .then(() => dispatch(HANDLE_INFO, 'Subscription cancelled successfully.'))
      .catch(() => dispatch(HANDLE_ERROR, 'Unable to cancel subscription. Contact us.'));
  },
  [RESUBSCRIBE]({ dispatch }) {
    return ApiService.post('/renew/subscription')
      .then(() => dispatch(HANDLE_INFO, 'Subscription activated successfully.'))
      .catch(() => dispatch(HANDLE_ERROR, 'There was a problem activating your subscription. Contact us.'));
  },
  [ACTIVATE_MEMBERSHIP]({ dispatch }) {
    const deleteTrialMembership = () => ApiService.delete('/membership');
    const addPaidMembership = () => ApiService.post('/renew/subscription');
    return deleteTrialMembership()
      .then(addPaidMembership)
      .then(() => dispatch(HANDLE_INFO, 'Subscription activated successfully.'))
      .catch(() => dispatch(HANDLE_ERROR, 'There was a problem activating your subscription. Contact us.'));
  },
  [CONFIRM_MEMBERSHIP_PLAN]({ dispatch }, plan) {
    // establish default plan
    const subscription = { plan: 'basic' };
    if (plan) {
      subscription.plan = plan;
    }
    const deleteTrialMembership = () => ApiService.delete('/membership');
    const addPaidMembership = () => ApiService.post('/renew/subscription', subscription);
    return deleteTrialMembership()
      .then(addPaidMembership)
      .then(() => dispatch(GET_STRIPE_MEMBERSHIP))
      .then(() => dispatch(HANDLE_INFO, 'Subscription activated successfully.'))
      .catch(() => dispatch(HANDLE_ERROR, 'There was a problem activating your subscription. Contact us.'));
  },
};

const mutations = {
  [TOGGLE_CHANGE_PLAN_MODAL](state) {
    state.changePlanVisible = !state.changePlanVisible;
  },
  // set state.currentBillingInfo to the data returned from COLLECT_CURRENT_BILLING_INFO
  [SET_CURRENT_BILLING_INFO](state, data) {
    // variable shorthand for "state.currentBillingInfo"
    const billing = state.currentBillingInfo;
    billing.address_city = data.address_city;
    billing.address_line1 = data.address_line1;
    billing.address_line2 = data.address_line2;
    billing.address_state = data.address_state;
    billing.address_zip = data.address_zip;
    billing.brand = data.brand;
    billing.last4 = data.last4;
    billing.name = data.name;
  },
  // add data from SignUp Stripe Elements form's returned data {object} to state.stripeData {object}
  [SET_STRIPE_DATA](state, stripeData) {
    state.stripeData = stripeData;
    state.subscription.source = stripeData.id;
  },
  [SET_MEMBERSHIP_DATA](state, payload) {
    state.membership = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

<template>
<div>
  <div v-if="plan === 'pro'">
    <div v-if="!newSubscriber">
      <h2>You have selected the Pro plan</h2>
      <p>
        Click confirm to finish upgrading your subscription.
      </p>
    </div>
    <div v-else-if="newSubscriber">
      <h2>Thank you for your order!</h2>
      <p>
        We sent you an email confirmation for your records.
      </p>
      <p>
        Your card ending in {{last4}} will be charged {{subscriptionRate}} each
        month on the date of subscription.
      </p>
    </div>
  </div>
  <enterprise-inquiry-block v-if="plan === 'enterprise'" />
</div>
</template>
<script>
import { CONFIRM_MEMBERSHIP_PLAN } from '@/store/actionTypes';
import EnterpriseInquiryBlock from '@/components/blocks/EnterpriseInquiryBlock';

export default {
  name: 'ConfirmPlanBlock',
  props: ['plan', 'trigger', 'newSubscriber'],
  components: { EnterpriseInquiryBlock },
  computed: {
    last4() {
      return this.$store.state.payment.currentBillingInfo.last4;
    },
    subscriptionRate() {
      let result;
      switch (this.$props.plan) {
        case 'pro':
          result = '$24.99';
          break;
        case 'enterprise':
          result = '$174.99';
          break;
        default:
          result = '$24.99';
          break;
      }
      return result;
    },
  },
  watch: {
    trigger(newVal) {
      if (newVal) {
        this.$store.dispatch(CONFIRM_MEMBERSHIP_PLAN, this.$props.plan)
          .then(() => {
            this.$emit('subscribed', true);
          });
      }
    },
  },
  data() {
    return {
      confirmed: false,
    };
  },
  filters: {
    capitalize(value) {
      if (!value) return '';
      const sValue = value.toString();
      return sValue.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>

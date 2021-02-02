<!--
Component Name: MembershipInfoBlock
Description : Displays membership information
-->
<template>
<section class="px-3">
  <div class="blue-titlebar pa-2 elevation-1">
    <h3>Membership Information</h3>
  </div>
  <div class="white pa-3 mb-3 elevation-1">
    <h3>Membership status</h3>
    <p style="text-transform: capitalize;">{{ membershipStatus }}</p>
    <h3>Membership plan</h3>
    <p style="text-transform: capitalize;">{{ membershipPlan }}</p>
    <h3>SMS Messages Remaining</h3>
    <p style="text-transform: capitalize;">{{ smsRemaining }}</p>
    <div v-if="startDate">
      <h3>Start date</h3>
      <p>{{ startDate | moment("dddd, MMMM Do YYYY") }}</p>
    </div>
    <div v-if="nextBillingDate">
      <h3>Next billing date</h3>
      <p>{{ nextBillingDate | moment("dddd, MMMM Do YYYY") }}</p>
    </div>
    <div v-if="amount">
      <h3>Amount</h3>
      <p>{{ '$' + amount.toFixed(2) }}</p>
    </div>
    <v-btn
      depressed
      @click="toggleChangePlanModal">
      Change Plan
    </v-btn>
    <v-btn
      v-if="membershipStatus == 'active' || membershipStatus == 'trial'"
      color="accent"
      flat
      depressed
      @click="showCancelDialog = true">
      Cancel Subscription
    </v-btn>
    <!-- <v-btn
      v-if="membershipStatus == 'inactive' || membershipStatus == 'canceled'"
      color="primary"
      :disabled="!allowSubscribe"
      depressed
      @click="reSubscribe"
      >
      Subscribe
    </v-btn> -->
    <v-flex v-if="membershipStatus == 'trial' && billingInfo.brand" xs12>
      <p>
        Convert to a paying membership to increase SMS limit to 1000 surveys per month.
      </p>
      <v-btn
        color="primary"
        depressed
        @click="activateMembership">
        Activate Subscription
      </v-btn>
    </v-flex>
    <confirm-dialog
      :confirmationMsg="{
        title: 'Cancel Subscription',
        body: 'Are you sure you want to cancel \
        your subscription? You will not be able to send surveys or see \
        survey answer data while your subscription is inactive.',
      }"
      :showConfirmDialog="showCancelDialog"
      @confirmDialogYes="cancelMembership"
      @closeConfirmDialog="showCancelDialog = $event"/>
  </div>
</section>
</template>

<script>
import {
  GET_STRIPE_MEMBERSHIP,
  CANCEL_MEMBERSHIP,
  ACTIVATE_MEMBERSHIP,
} from '@/store/actionTypes';
import { TOGGLE_CHANGE_PLAN_MODAL } from '@/store/mutationTypes';
import ConfirmDialog from '@/components/global/ConfirmDialog';

export default {
  name: 'MembershipInfoBlock',
  props: {
    allowSubscribe: {
      type: Boolean,
      default: true,
    },
  },
  components: { ConfirmDialog },
  created() {
    this.$store.dispatch(GET_STRIPE_MEMBERSHIP);
  },
  data() {
    return {
      showCancelDialog: false,
    };
  },
  computed: {
    startDate() {
      return this.$store.state.payment.membership.start_date;
    },
    nextBillingDate() {
      return this.$store.state.payment.membership.next_billing_date;
    },
    amount() {
      return this.$store.state.payment.membership.amount;
    },
    membershipIsActive() {
      return this.$store.state.payment.membership.active;
    },
    membershipStatus() {
      return this.$store.state.payment.membership.status;
    },
    membershipPlan() {
      return this.$store.state.payment.membership.planType;
    },
    smsRemaining() {
      return this.$store.state.payment.membership.smsRemaining;
    },
    billingInfo() {
      return this.$store.getters.getBillingInfo;
    },
  },
  methods: {
    toggleChangePlanModal() {
      this.$store.commit(TOGGLE_CHANGE_PLAN_MODAL);
    },
    cancelMembership() {
      this.$store.dispatch(CANCEL_MEMBERSHIP)
        .then(() => this.$store.dispatch(GET_STRIPE_MEMBERSHIP));
    },
    // reSubscribe() {
    //   this.$store.dispatch(RESUBSCRIBE)
    //     .then(() => this.$store.dispatch(GET_STRIPE_MEMBERSHIP));
    // },
    activateMembership() {
      this.$store.dispatch(ACTIVATE_MEMBERSHIP)
        .then(() => this.$store.dispatch(GET_STRIPE_MEMBERSHIP));
    },
  },
};
</script>

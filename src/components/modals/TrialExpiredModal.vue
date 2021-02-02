<template>
  <v-dialog
  v-model="open"
  max-width="325px">
    <v-card class="pa-3">
      <v-card-text>
        <h2 class="text-xs-center">Your free trial has expired!</h2>
        <p class="text-xs-center font-weight-thin">To continue gathering valuable
          feedback and reviews from customers please review our monthly plans.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="primary"
          depressed
          @click.stop="changePlans">
          View Plans
        </v-btn>
        <v-btn
          depressed
          class="mr-2"
          @click.stop="close">
          Close
        </v-btn>
        <v-spacer/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { TOGGLE_CHANGE_PLAN_MODAL } from '@/store/mutationTypes';

export default {
  name: 'TrialExpiredModal',
  computed: {
    open() {
      return this.$store.state.payment.membership.status === 'canceled' && !this.forceClose;
    },
  },
  data() {
    return {
      forceClose: false,
    };
  },
  methods: {
    changePlans() {
      this.$store.commit(TOGGLE_CHANGE_PLAN_MODAL);
      this.close();
    },
    close() {
      this.forceClose = true;
    },
  },
};
</script>
<style>
.v-card-text{
  text-align:center;
}
</style>

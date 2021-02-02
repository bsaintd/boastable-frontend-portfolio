<template>
  <div>
    <v-tooltip left>
      <v-btn
        slot="activator"
        fab
        bottom
        right
        color="secondary"
        dark
        fixed
        @click.stop="dialog = !dialog"
      >
        <v-icon class="fix-md-add">send</v-icon>
      </v-btn>
      <span>Send a customer survey</span>
    </v-tooltip>
    <send-review-dialog
      v-bind:dialog="dialog"
      v-on:closeDialog="dialog = $event"/>
  </div>
</template>

<script>
import SendReviewDialog from './SendReviewDialog';

export default {
  name: 'SendReviewFab',
  components: {
    SendReviewDialog,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    dialogHandler() {
      this.dialog = !this.dialog;
    },
  },
  mounted() {
    this.$root.$on('sendSurvey', () => this.dialogHandler());
  },
};
</script>

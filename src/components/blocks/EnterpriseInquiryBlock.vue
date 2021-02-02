<!--
Component Name: Enterprise Inquiry Block
-->
<template>
<v-form ref="form"
  lazy-validation>
  <h2>Well let's get started</h2>
  <p>
    Feel free to drop us a line at
    <a href="mailto:hello@boastable.co">hello@boastable.co</a>,
    or send us an inquiry with this little form and we'll get back to you.
    We already have your contact info on file.
  </p>
  <v-textarea
    name="comments"
    auto-grow
    rows=1
    v-model="comments"
    label="Any details you'd like us to know to prepare for our call?">
  </v-textarea>
  <v-btn
    name="send-comments"
    class="primary"
    depressed
    prepend-icon="send"
    @click="submit">
    Send
  </v-btn>
</v-form>
</template>
<script>
import { SEND_COMMENT } from '@/store/actionTypes';

export default {
  name: 'EnterpriseInquiryBlock',
  computed: {
    contactInfo() {
      const firstName = this.$store.state.account.first_name;
      const lastName = this.$store.state.account.last_name;
      const companyName = this.$store.state.account.company_name;
      const phone = this.$store.state.account.phone;
      return `${firstName} ${lastName}, of ${companyName}, reachable at ${phone} is initiating an Enterprise membership inquiry.`;
    },
  },
  data() {
    return {
      comments: '',
    };
  },
  methods: {
    submit() {
      let combined = this.contactInfo;
      if (this.comments) {
        combined += ` In preparation for the call, they would like you to know the following: ${this.comments}`;
      }
      this.$store.dispatch(SEND_COMMENT, combined)
        .then(() => {
          this.clear();
        });
    },
    clear() {
      this.comments = '';
    },
  },
};
</script>

<style scoped>
</style>

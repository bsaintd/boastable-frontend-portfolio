<template>
  <v-dialog
    max-width="400px"
    v-model="showDialog">
    <v-form
    ref="sendSurveyForm"
    v-model="validSendSurvey"
    lazy-validation>
      <v-card class="send-survey-dialog">
        <v-card-title
          class="lt-context-color bg py-2">
          <h1 class="subheading">Send Survey</h1>
        </v-card-title>
        <v-container>
          <v-layout align-center justify-center row wrap>
            <v-flex xs12>
              <h3 class="pt-2 pb-4 text-xs-center">
                Choose one or both,
                <br>
                it's up to you!
              </h3>
            </v-flex>
            <v-flex xs12 pt-1 pl-3 pr-4 pb-4>
              <h4 class="snd-srvy-txt font-weight-light">
                Send survey by text:
              </h4>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                label="Phone"
                validate-on-blur
                mask="phone"
                v-model="phone"
                v-bind:rules="phoneRules"
                class="snd-srvy-txt-fld">
              </v-text-field>
            </v-flex>
            <v-flex xs12 pl-3 pr-4 pb-4>
              <h4 class="snd-srvy-txt font-weight-light">
                Send survey by email:
              </h4>
              <v-text-field
                prepend-icon="mail"
                label="Email"
                validate-on-blur
                v-model="email"
                v-bind:rules="emailRules"
                class="snd-srvy-txt-fld">
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="mx-3 px-5 pb-3">
          <v-btn
            color="primary"
            block
            depressed
            @click="sendSurvey">
            Send
          </v-btn>
          <v-btn
            block
            depressed
            @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { SEND_SURVEY } from '@/store/actionTypes';
import { isEmailAddress } from '@/store/validationTypes';
import { parseNumber } from 'libphonenumber-js';

export default {
  name: 'SendReviewDialog',
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      // form data
      validSendSurvey: false,
      email: '',
      phone: '',
      // form field rules
      emailRules: isEmailAddress,
      phoneRules: [
        v => this.validatePhoneNumber(v) === true || 'Please enter a valid phone number',
      ],
    };
  },
  computed: {
    showDialog: {
      get() {
        return this.$props.dialog;
      },
      set(value) {
        this.$emit('closeDialog', value);
      },
    },
  },
  methods: {
    // test phone number validity with libphonenumber-js dependency
    validatePhoneNumber(phoneNumber) {
      const testNumber = parseNumber(phoneNumber, 'US');
      return Object.keys(testNumber).length > 0 && testNumber.country === 'US';
    },
    sendSurvey() {
      const customer = {};
      if (this.email && this.phone) {
        Object.assign(customer, {
          email: this.email,
          phone: this.phone,
        });
      } else if (this.email) {
        Object.assign(customer, { email: this.email });
      } else if (this.phone) {
        Object.assign(customer, { phone: this.phone });
      }
      this.$store.dispatch(SEND_SURVEY, customer);
      this.closeDialog();
    },
    clearSurvey() {
      this.email = '';
      this.phone = '';
    },
    closeDialog() {
      this.clearSurvey();
      this.showDialog = false;
    },
  },
};
</script>

<style lang="scss">
.send-survey-dialog {
  .snd-srvy-txt {
    margin: 0 0 -4px 33px;
  }
  .snd-srvy-txt-fld {
    i.v-icon {
      color: #909090;
      font-size: 18px;
    }

    label.v-label {
      color: #909090 !important;
      font-size: 14px;
      font-weight: 300;
    }

    input.v-text-field {
      padding: 4px 0;
    }
  } // end .snd-srvy-txt-fld
} // end .send-survey-dialog
</style>

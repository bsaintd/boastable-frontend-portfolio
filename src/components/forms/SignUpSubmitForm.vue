<template>
  <v-form
    ref="submitform"
    v-model="validSubmitForm"
    lazy-validation
    class="mb-5 mx-2 pa-3">
    <!-- Data below needs to be made dynamic based on prior form data stored in Vuex -->
    <h2>Confirm Signup Info</h2>
    <h4 class="mt-4">Email Address</h4>
    <p>{{email}}</p>
    <h4>Name</h4>
    <p>{{business.first_name + ' ' + business.last_name}}</p>
    <h4>Company Name</h4>
    <p>{{business.company_name}} </p>
    <h4>Phone</h4>
    <p>{{ businessPhone }} </p>
    <!-- <h4>Payment Method</h4>
    <v-layout row align-center>
      <v-flex>
        XXXX-XXXX-XXXX-{{card.last4}}
      </v-flex>
      <v-flex>
        <credit-card-icon :brand="card.brand" />
      </v-flex>
    </v-layout>
    <h4>Billing Address</h4>
    <p>{{card.address_line1}}
      <br v-if="card.address_line2" />{{card.address_line2}}
      <br/>{{card.address_city}}, {{card.address_state}} {{card.address_zip}}
      <br/>{{card.address_country}}</p> -->
    <v-checkbox
      :label="`Agree to Terms &amp; Service Agreement`"
      v-model="agreeToTerms">
    </v-checkbox>
    <small>
      * <router-link target="_blank" to="/terms-and-conditions">Click Here</router-link>
      to review the Terms &amp; Service Agreement
    </small>
    <br>
    <v-btn
      color="primary"
      class="pay-with-stripe mt-4 mx-0 ml-2"
      :disabled="!agreeToTerms"
      @click="register()"
      >
      Finish Registration
    </v-btn>
    <loading-spinner :showLoader="isLoading" />
    <v-btn
      flat
      @click="backToPreviousStep()"
      class="mt-4">
      Back
    </v-btn>
  </v-form>
</template>

<script>
import { REGISTER } from '@/store/actionTypes';
import { formatNumber, parseNumber } from 'libphonenumber-js';
import LoadingSpinner from '@/components/LoadingSpinner';
import CreditCardIcon from '@/components/CreditCardIcon';

export default {
  name: 'SignUpSubmitForm',
  components: {
    LoadingSpinner,
    CreditCardIcon,
  },
  data() {
    return {
      isLoading: false,
      newStepperVal: 1,
      validSubmitForm: false,
      agreeToTerms: false,
    };
  },
  computed: {
    business() {
      return this.$store.getters.getSignUpAccount;
    },
    card() {
      return this.$store.getters.getSignUpCard;
    },
    email() {
      return this.$store.getters.getSignUpEmail;
    },
    businessPhone() {
      const parsedNumber = this.business.phone ? parseNumber(this.business.phone, 'US') : {};
      const formattedNumber = parsedNumber.phone ? formatNumber(parsedNumber, 'National') : 'Invalid Number';
      return formattedNumber;
    },
  },
  props: {
    stepperProgress: Number,
  },
  methods: {
    // change the value of the parent stepper's progress
    updateStepper(string) {
      this.newStepperVal = this.stepperProgress;
      if (string === 'forward') {
        this.newStepperVal += 1;
      } else if (string === 'back') {
        this.newStepperVal -= 1;
      }
      this.$emit('updateStepper', this.newStepperVal);
    },
    register() {
      const { dispatch } = this.$store;
      /**
       * @description assuming everything was validated in the last few steps
       * the state of the app at this point will have the following:
       * 1. a valid email and password
       * 2. business info
       * 3. a valid stripe token
       *
       * So when the user click to register, all of it will be processed
       * and they will be a subscribed member.
       */
      this.isLoading = true;
      dispatch(REGISTER)
        .then(() => {
          this.isLoading = false;
          this.$router.push({ name: 'Dashboard' });
        });

      // perhaps catch and display an error message if registration doesn't succeed.
    },
    backToPreviousStep() {
      this.updateStepper('back');
    },
  },
};
</script>

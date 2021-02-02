<template>
  <v-form
    ref="acctform"
    v-model="validAcctForm"
    lazy-validation
    class="mb-5 mx-2 pa-3">
    <v-text-field
      name="first_name"
      prepend-icon="account_circle"
      type="text"
      label="First Name"
      v-model="first_name"
      validate-on-blur
      v-bind:rules="nameRules"
      v-on:keyup.13="submitAcctInfo()"
      require>
    </v-text-field>
    <v-text-field
      name="last_name"
      prepend-icon="account_circle"
      label="Last Name"
      v-model="last_name"
      validate-on-blur
      v-bind:rules="nameRules"
      v-on:keyup.13="submitAcctInfo()"
      require>
    </v-text-field>
    <v-text-field
      name="company"
      prepend-icon="business"
      label="Business Name"
      v-model="company_name"
      validate-on-blur
      maxlength="30"
      v-bind:rules="nameRules"
      v-on:keyup.13="submitAcctInfo()"
      require>
    </v-text-field>
    <v-text-field
      name="phone"
      prepend-icon="phone"
      label="Phone Number"
      v-model="phone"
      mask="phone"
      @blur="checkIsNewPhone"
      validate-on-blur
      v-bind:rules="phoneRules"
      v-on:keyup.13="submitAcctInfo()">
    </v-text-field>
    <v-btn
      color="primary"
      :disabled="!validAcctForm || !isNewPhone"
      @click="submitAcctInfo()"
      class="mt-3 ml-4">
      Continue
    </v-btn>
    <v-btn
      flat
      @click="backToPreviousStep()"
      class="mt-3">
      Back
    </v-btn>
  </v-form>
</template>

<script>
import { isName } from '@/store/validationTypes';
import { COLLECT_SIGNUP_DATA, CHECK_IS_NEW_PHONE } from '@/store/actionTypes';
import { parseNumber, formatNumber } from 'libphonenumber-js';

export default {
  name: 'SignUpAcctForm',
  props: {
    stepperProgress: Number,
  },
  data() {
    return {
      isNewPhone: true,
      newStepperVal: 2,
      validAcctForm: false,
      first_name: '',
      last_name: '',
      company_name: '',
      phone: '',
      nameRules: isName,
      phoneRules: [
        v => this.validatePhoneNumber(v) === true || 'Please enter a valid phone number',
      ],
    };
  },
  methods: {
    checkIsNewPhone() {
      if (this.validatePhoneNumber(this.phone)) {
        this.$store.dispatch(CHECK_IS_NEW_PHONE, this.savePhone(this.phone))
          .then((isNewPhone) => {
            this.isNewPhone = isNewPhone;
          });
      }
    },
    savePhone(number) {
      const phone = formatNumber(parseNumber(number, 'US'), 'E.164');
      return phone;
    },
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
    // test phone number validity with libphonenumber-js dependency
    validatePhoneNumber(phoneNumber) {
      let testNumber = parseNumber(phoneNumber, 'US');
      const standardized = testNumber.phone ? formatNumber(testNumber, 'E.164') : '';
      testNumber = parseNumber(standardized, 'US');
      return Boolean(testNumber.phone);
    },
    submitAcctInfo() {
      if (this.$refs.acctform.validate()) {
        // submit acct info to vuex store module
        const account = {
          first_name: this.first_name,
          last_name: this.last_name,
          company_name: this.company_name,
          phone: this.savePhone(this.phone),
        };
        this.$store.dispatch(COLLECT_SIGNUP_DATA, { account });
        // after successful submission
        // advance the SignUp stepper to the next step
        this.updateStepper('forward');
      }
    },
    backToPreviousStep() {
      this.updateStepper('back');
    },
  },
};
</script>

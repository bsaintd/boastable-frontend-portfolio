<template>
  <v-form
    ref="authform"
    v-model="validCredsForm"
    lazy-validation
    class="mb-5 mx-2 pa-3">
    <v-text-field
      name="login"
      prepend-icon="person"
      type="text"
      label="Enter E-mail"
      v-model="email"
      v-bind:rules="emailRules"
      validate-on-blur
      @blur="checkForDuplicate"
      v-on:keyup.13="submitAuth()"
      require>
    </v-text-field>
    <p>
      Passwords must have:
    </p>
    <ul>
      <li>At least 6 characters</li>
      <li>1 number</li>
      <li>Special characters are allowed</li>
    </ul>
    <v-text-field
      id="password"
      name="password"
      prepend-icon="lock"
      v-bind:type="'password'"
      label="Enter Password"
      v-model="password"
      v-bind:rules="passwordRules"
      validate-on-blur
      v-on:keyup.13="submitAuth()"
      require>
    </v-text-field>
    <v-text-field
      id="repeatedPW"
      name="repeatedPW"
      prepend-icon="lock"
      v-bind:type="'password'"
      label="Confirm Password"
      v-model="repeatedPassword"
      v-bind:rules="repeatedPWRules"
      validate-on-blur
      v-on:keyup.13="submitAuth()"
      require>
    </v-text-field>
    <v-btn
      color="primary"
      :disabled="!validCredsForm || !isNewAccount"
      @click="submitAuth()"
      class="mt-3 ml-4">
      Continue
    </v-btn>
  </v-form>
</template>

<script>
import { acceptedPW, isEmailAddress } from '@/store/validationTypes';
import { COLLECT_SIGNUP_DATA, CHECK_IS_NEW_ACCOUNT } from '@/store/actionTypes';

export default {
  name: 'SignUpAuthForm',
  props: {
    stepperProgress: Number,
  },
  data() {
    return {
      isNewAccount: true,
      newStepperVal: 1,
      validCredsForm: false,
      email: '',
      emailRules: isEmailAddress,
      password: '',
      passwordRules: acceptedPW,
      repeatedPassword: '',
      repeatedPWRules: [
        v => !!v || 'Password confirmation is required',
        v => v === this.password || 'Passwords must match',
      ],
    };
  },
  methods: {
    // how can I use this in the validation chain?
    checkForDuplicate() {
      this.isNewAccount = false;
      return this.$store.dispatch(CHECK_IS_NEW_ACCOUNT, this.email)
        .then((isNewAccount) => {
          this.isNewAccount = isNewAccount;
        });
    },
    updateStepper() {
      this.newStepperVal = this.stepperProgress;
      this.newStepperVal += 1;
      this.$emit('updateStepper', this.newStepperVal);
    },
    submitAuth() {
      if (this.$refs.authform.validate()) {
        // submit email and pw to vuex store module
        const auth = {
          email: this.email.toLowerCase(),
          password: this.password,
        };
        this.$store.dispatch(COLLECT_SIGNUP_DATA, { auth });
        // after successful submission
        // advance the SignUp stepper to the next step
        this.updateStepper('forward');
      }
    },
  },
};
</script>

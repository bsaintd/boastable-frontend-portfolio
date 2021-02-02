<template>
  <v-container fluid class="page-background" column>
    <v-layout align-center justify-center xs12>
      <v-img
          class="boastable-icon"
          src="/static/boastable-standalone.png"
          alt="Boastable"
          position="center"
          contain>
      </v-img>
    </v-layout>
    <v-layout align-center justify-center>
      <v-flex xs10 sm8 md6>
        <v-stepper
        class="stepper-container"
        v-model="stepperProgress" vertical>
          <h2
          class="registration-title"
          align-center
          justify-center>
            Create a Boastable Account</h2>
          <v-stepper-step step="1">
            Email and Password
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-flex xs11>
              <!-- SignUpAuthForm -->
              <sign-up-auth-form
                v-bind:stepperProgress="stepperProgress"
                v-on:updateStepper="stepperProgress = $event"/>
            </v-flex>
          </v-stepper-content>
          <v-stepper-step step="2">
            Account Details
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-flex xs11>
              <!-- SignUpAcctForm -->
              <sign-up-acct-form
                v-bind:stepperProgress="stepperProgress"
                v-on:updateStepper="stepperProgress = $event"/>
            </v-flex>
          </v-stepper-content>

          <!-- <v-stepper-step step="3">
            Payment Method
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-flex xs11>
              <sign-up-payment-form
                v-bind:stepperProgress="stepperProgress"
                v-on:updateStepper="stepperProgress = $event"/>
            </v-flex>
          </v-stepper-content> -->

          <v-stepper-step step="3">
            Confirmation
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-flex xs11>
              <!-- SignUpSubmitForm -->
              <sign-up-submit-form
                v-bind:stepperProgress="stepperProgress"
                v-on:updateStepper="stepperProgress = $event"/>
            </v-flex>
          </v-stepper-content>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SignUpAuthForm from '@/components/forms/SignUpAuthForm';
import SignUpAcctForm from '@/components/forms/SignUpAcctForm';
import SignUpPaymentForm from '@/components/forms/SignUpPaymentForm';
import SignUpSubmitForm from '@/components/forms/SignUpSubmitForm';

export default {
  name: 'SignUpStepper',
  components: {
    SignUpAcctForm,
    SignUpAuthForm,
    SignUpPaymentForm,
    SignUpSubmitForm,
  },
  data() {
    return {
      showDialog: true,
      stepperProgress: 1,
    };
  },
};
</script>

<style scoped>
.stepper-container{
  max-width: 500px;
  margin: 0 auto;
}
.container.fill-height {
  min-height: 100vh;
}
.registration-title{
  margin:1em 1em 0;
}
.page-background {
  background-image: url('/static/login-bg.jpg');
  background-size:cover;
  background-attachment: fixed;
}
.boastable-icon{
  max-height: 75px;
  margin: 1.5em;
}
</style>

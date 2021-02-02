<template>
  <v-content>
    <v-container class="login-page" fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs8 sm6 md3>
          <img class="main-logo text-md-center"
              src="/static/boastable-standalone.png"
              alt="Boastable"
              height="200px"
            >
            <h2 class="text-sm-center">Change your password</h2>
            <p>Enter your new password</p>
              <v-form>
                <p>
                  Passwords must have:
                </p>
                <ul>
                  <li>At least 6 characters</li>
                  <li>Must contain at least 1 number</li>
                  <li>Special characters are allowed</li>
                </ul>
                <v-text-field class="login-input"
                  id="password"
                  name="password"
                  color="info"
                  dark
                  prepend-icon="lock"
                  v-bind:type="'password'"
                  label="Password"
                  v-model="password"
                  v-bind:rules="passwordRules"
                  require>
                </v-text-field>
              </v-form>
              <v-btn xs8 sm6 md3
                class="login-button"
                :disabled="disableSubmit(password)"
                @click="handleResetPassword">Reset password</v-btn>
              <router-link to="/login" replace>
                <p class="text-sm-center">Return to login</p>
              </router-link>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { acceptedPW } from '@/store/validationTypes';
import { RESET_PASSWORD } from '@/store/actionTypes';

export default {
  data() {
    return {
      password: '',
      passwordRules: acceptedPW,
    };
  },
  methods: {
    disableSubmit(password) {
      const rulesArray = this.passwordRules;
      return rulesArray.reduce((result, ruleFunction) =>
        result || ruleFunction(password) !== true, false);
    },
    handleResetPassword() {
      const payload = {
        id: this.$route.params.shortid,
        password: this.password,
      };
      this.$store.dispatch(RESET_PASSWORD, payload);
    },
  },
};
</script>

<style scoped>
.container.fill-height {
  min-height: 100vh;
}
.login-page{
  background-image: url('/static/login-bg.jpg');
  background-size:cover;
}
.login-page * {
  color:white;
}
.main-logo{
  transform: translateX(20%);
}
.login-input, input, label{
  color:white !important;
}
.login-button{
  border:3px solid white;
  border-radius:25px;
  height:50px;
  width:100%;
  background-color:rgba(0,0,0,0) !important;
}

/*GLOBAL*/
.error--text, label.error--text {
  color:#ee6d58 !important;
}
</style>

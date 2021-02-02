<template>
  <v-content>
    <v-container class="login-page" fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs8 sm6 md3>
          <v-img
            src="/static/boastable-standalone.png"
            alt="Boastable"
            position="center"
            max-height="200px"
            contain>
          </v-img>
            <h2 class="text-sm-center">Reset Password Request</h2>
              <p>
                Enter your email and we will send you a link
                which will allow you to reset your password.
              </p>
             <v-form >
                <v-text-field class="login-input"
                  name="login"
                  color="info"
                  dark
                  prepend-icon="person"
                  type="text"
                  label="E-mail"
                  v-model="email"
                  v-bind:rules="emailRules"
                  require>
                </v-text-field>
              </v-form>
              <v-btn xs8 sm6 md3
                class="login-button"
                @click="handleResetRequest">Request new password</v-btn>
              <router-link to="/signup" replace>
                <p class="text-sm-center">Don't Have an account?</p>
              </router-link>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { RESET_PASSWORD_REQUEST } from '@/store/actionTypes';

export default {
  data() {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
    };
  },
  methods: {
    handleResetRequest() {
      this.$store.dispatch(RESET_PASSWORD_REQUEST, { email: this.email });
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

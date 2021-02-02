<template>
  <v-content>
    <v-container class="login-page" fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs8 sm6 md3>
          <v-img
            class="boastable-icon"
            src="/static/boastable-standalone.png"
            alt="Boastable"
            position="center"
            contain>
          </v-img>
          <h2 class="font-weight-bold text-sm-center">Welcome Back!</h2>
          <v-form>
            <v-text-field
              class="login-input font-weight-light"
              name="login"
              color="info"
              dark
              prepend-icon="person"
              type="text"
              label="E-mail"
              v-model="email"
              v-bind:rules="emailRules"
              validate-on-blur
              require>
            </v-text-field>
            <v-text-field
              class="login-input font-weight-light"
              id="password"
              name="password"
              color="info"
              dark
              prepend-icon="lock"
              v-bind:type="'password'"
              label="Password"
              v-model="password"
              v-bind:rules="passwordRules"
              validate-on-blur
              v-on:keyup.enter="login"
              require>
            </v-text-field>
            <v-btn xs8 sm6 md3
              class="login-button font-weight-light"
              block
              round
              @click="login">Login</v-btn>
          </v-form>
          <router-link to="/reset-password" replace>
            <p class="font-weight-light text-sm-center">Forgot Your Password?</p>
          </router-link>
          <router-link to="/signup" replace>
            <p class="font-weight-light text-sm-center">Don't Have an Account?</p>
          </router-link>
          <a href="https://boastable.co" >
            <p
              class="website-return font-weight-regular text-sm-center">
              Back to Boastable Website</p>
          </a>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { LOGIN } from '@/store/actionTypes';

export default {
  data() {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
    };
  },
  methods: {
    login() {
      const payload = {
        email: this.email.toLowerCase(),
        password: this.password,
      };
      this.$store.dispatch(LOGIN, payload)
        .then(() => {
          this.$router.push({ name: 'Dashboard' });
        });
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
  background-attachment: fixed;
}
.login-page * {
  color:white;
  text-decoration: none;
}
.boastable-icon{
  max-height: 75px;
  margin: 1.5em;
  margin-top: 6em;
}
.login-input, input, label{
  color:white !important;
}
.login-button{
  margin-bottom:1.5em;
  border:3px solid white;
  height:50px;
  background-color:rgba(0,0,0,0) !important;
}
.website-return{
  margin-top:3em;
  color:#ee6d58;
}

/*GLOBAL*/
.error--text, label.error--text {
  color:#ee6d58 !important;
}
</style>

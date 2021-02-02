<template>
  <v-app id="app">
    <nav-menu v-if="showNav"/>
    <router-view v-on:showSnackbar="showSnackbar"/>
    <send-review-fab v-if="showNav"/>
    <change-plans-modal/>
    <trial-expired-modal/>
    <snackbar/>
  </v-app>
</template>

<script>
import NavMenu from '@/components/NavMenu';
import SendReviewFab from '@/components/global/SendReviewFab';
import Snackbar from '@/components/global/Snackbar';
import ChangePlansModal from '@/components/modals/ChangePlansModal';
import TrialExpiredModal from '@/components/modals/TrialExpiredModal';
import { CHECK_AUTH } from '@/store/actionTypes';

export default {
  name: 'App',
  components: {
    NavMenu,
    SendReviewFab,
    Snackbar,
    ChangePlansModal,
    TrialExpiredModal,
  },
  data() {
    return {
      showSnackbar: false,
    };
  },
  computed: {
    showNav() {
      // display navbar and send review button ONLY IF:
      // 1. user is authenticated
      // 2.  the navigational route isn't "Survey"
      return this.$store.getters.isAuthenticated === true && this.$route.name !== 'Survey';
    },
  },
  mounted() {
    this.$store.dispatch(CHECK_AUTH)
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log('User is not logged in');
      });
  },
};
</script>

<style lang="scss">
@import url("https://use.typekit.net/shp2vvp.css");
@import 'vuetify/dist/vuetify.min.css';
@import 'material-design-icons-iconfont/dist/material-design-icons.css';
/* Survey feedback form styling
to alter Vuetify componenets
have to be in non-scoped css imported to app.js*/
@import './assets/css/survey-vuetify.css';

/* Global color variables (only usable here/App.vue) */
$primary: #0f3c59;
$lt-primary: #295d80;
$secondary: #ee6d58;
$accent: #ee6d58;
$error: #b71c1c;
$info: #fff;
$success: #186B24;
$warning: #FFC107;
$context: #6F6F6F;
$lt-context: #f5f5f5;

/* Global Colors Classes(same as theme settings) */
.primary-color {
  color: $primary !important;
  &.bg {
    color: $info !important;
    background-color: $primary;
  }
}
.lt-primary-color {
  color: $lt-primary !important;
  &.bg {
    color: $info !important;
    background-color: $lt-primary;
  }
}
.secondary-color {
  color: $secondary !important;
  &.bg {
    color: $info !important;
    background-color: $secondary;
  }
}
.accent-color {
  color: $accent !important;
  &.bg {
    color: $info !important;
    background-color: $accent;
  }
}
.error-color {
  color: $error !important;
  &.bg {
    color: $info !important;
    background-color: $error;
  }
}
.info-color {
  color: $info !important;
  &.bg {
    color: $primary !important;
    background-color: $info;
  }
}
.success-color {
  color: $success !important;
  &.bg {
    color: $info !important;
    background-color: $success;
  }
}
.warning-color {
  color: $warning !important;
  &.bg {
    color: #000;
    background-color: $warning;
  }
}
.context-color {
  color: $context !important;
  &.bg {
    color: $info !important;
    background-color: $context;
  }
}
.lt-context-color {
  color: $lt-context !important;
  &.bg {
    color: $primary !important;
    background-color: $lt-context;
  }
}

/* app base styling */
#app {
  font-family: 'azo-sans-web', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  letter-spacing: -.025em;
  font-weight: 300;
}

/* headings styling */
h1,h2,h3,h4,h5,h6 {
  color: $primary;
  font-weight: 400;
}

p {
  font-weight: 300;
}

/* fix bug with icon centering for vuetify icons */
i.v-icon {
  height: auto !important;
}

/* page content titlebar styling */
.blue-titlebar {
  background-color: $lt-primary;
  h3 {
    color: $info;
  }
}
</style>

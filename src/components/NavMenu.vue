<template>
  <div>
    <!-- Top Navbar -->
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      class="primary"
      :class="{ 'px-0': $vuetify.breakpoint.mdAndUp }"
      dark
      flat
      app
      fixed>
      <img
        src="/static/boastable-logo.png"
        alt="Boastable"
        class="nav-logo">
      <v-spacer></v-spacer>
      <!-- Notifications icon commented out until functionality is built -->
      <!-- <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn> -->
      <v-toolbar-side-icon
        @click.stop="sideDrawerState = !sideDrawerState"
        v-if="$vuetify.breakpoint.smAndDown">
      </v-toolbar-side-icon>
    </v-toolbar>
    <!-- Side Drawer Nav (Collapsible) -->
    <v-navigation-drawer
      mobile-break-point="960"
      width="250"
      clipped
      v-model="sideDrawerState"
      fixed
      :permanent="$vuetify.breakpoint.mdAndUp"
      :right="$vuetify.breakpoint.smAndDown"
      app>
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            row
            align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading" class="font-weight-regular">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <!-- <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex> -->
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon="">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-regular">
                    {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.link">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-regular">
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile
          v-else-if="item.link"
          :key="item.text"
          :to="item.link">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-regular">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
          v-else-if="item.action"
          :key="item.text"
          @click="navDrawerAction(item.action)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-regular">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { LOGOUT } from '@/store/actionTypes';

export default {
  name: 'NavMenu',
  data() {
    return {
      sideDrawerState: true,
      // side drawer nav links
      items: [
        { icon: 'dashboard', text: 'Dashboard', link: '/dashboard' },
        { icon: 'chat', text: 'Answers', link: '/answers' },
        // { icon: 'group', text: 'Team', link: '/' },
        { icon: 'send', text: 'Send Survey', action: 'sendSurvey' },
        { icon: 'settings', text: 'Survey Setup', link: '/survey-setup' },
        { icon: 'person', text: 'Account', link: '/account' },
        { icon: 'help', text: 'Help', link: '/help' },
        { icon: 'power_settings_new', text: 'Logout', action: 'logout' },
      ],
    };
  },
  methods: {
    sendSurvey() {
      this.$root.$emit('sendSurvey');
    },
    // abstraction to allow for logout() execution from v-for in nav drawer
    navDrawerAction(action) {
      this[action]();
    },
    // function to logout of app/destroy JWT and navigate to login
    logout() {
      this.$store.dispatch(LOGOUT)
        .then(() => {
          this.$router.push({ path: '/login' });
        });
    },
  },
};
</script>

<style scoped>
img.nav-logo {
  height: 30px;
  margin: 0 0 -3px 8px;
}
</style>


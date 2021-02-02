<template>
<div
  id="final-card"
  class="final-review-invite"
  :class="{
    active: currentId === 'final-card'
  }">
  <h2 v-if="isDemo" class="info-color font-weight-bold text-xs-center">
    Would you sign up for Boastable today?
  </h2>
  <h2 v-else class="info-color font-weight-bold text-xs-center">
    {{ settings.farewell || "Would you recommend us to your friends and family?" }}
  </h2>
  <div v-if="isDemo" class="review-options">
    <v-flex xs12>
      <div class="text-xs-center">
        <v-btn
          block
          class="review-button google"
          target="_blank"
          href="https://boastable.co/signup">
          Sign up for Boastable
        </v-btn>
      </div>
    </v-flex>
  </div>
  <div v-if="!isDemo" class="review-options">
    <v-flex v-if="customLink" xs12>
      <div class="text-xs-center">
        <v-btn
          block
          class="review-button custom"
          @click="action('CLICK_CUSTOM_LINK')"
          target="_blank"
          :href="customLink">
          {{ customLinkText }}
        </v-btn>
      </div>
    </v-flex>
    <v-flex v-if="placeId && !customLink" xs12>
      <div class="text-xs-center">
        <v-btn
          block
          class="review-button google"
          @click="action('CLICK_GOOGLE_REVIEW')"
          :href="googleLink">
          <img src="/static/Survey_Google_Reviews_Logo.png" height="40px" >
        </v-btn>
      </div>
    </v-flex>
  </div>
</div>
</template>
<script>
import _ from 'lodash';
import { TRACK_ACTION } from '@/store/actionTypes';

export default {
  name: 'FinalCard',
  props: {
    currentId: null,
    placeId: null,
  },
  computed: {
    settings() {
      return this.$store.state.survey.settings;
    },
    isDemo() {
      return this.$store.state.survey.survey.demo;
    },
    survey() {
      return this.$store.state.survey.survey;
    },
    customLink() {
      let link = '';
      link = _.get(this, 'settings.custom.link');
      return link;
    },
    customLinkText() {
      let text = '';
      text = _.get(this, 'settings.custom.text');
      return text;
    },
    googleLink() {
      let link = '#';
      if (!this.survey.test) {
        link = `https://search.google.com/local/writereview?placeid=${this.company.google_place_id}`;
      }
      return link;
    },
    test() {
      return this.survey.test;
    },
  },
  methods: {
    action(type) {
      if (!this.test) {
        this.$store.dispatch(TRACK_ACTION, type);
      }
    },
  },
};
</script>

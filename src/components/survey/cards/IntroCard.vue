<template>
<!-- the introductory card -->
  <v-card-text class="text-xs-center">
    <v-layout column>
      <v-flex xs12>
        <h2 v-if="isDemo" class="info-color font-weight-bold mb-3 mx-3">
          Demo
        </h2>
        <h2 v-else class="info-color font-weight-bold mb-3 mx-3">
          {{ introduction }}
        </h2>
        <p v-if="isDemo" class="info-color font-weight-light">
          When you send out a survey with Boastable this is what your customers will see!
        </p>
        <p v-else class="info-color font-weight-light">
          Would you mind giving us some feedback?
          Your input is incredibly valuable to us!
        </p>
        <p v-if="isDemo" class="info-color font-weight-light">
          In this section thank your customers for their business and ask
          them for feedback and a review. It will also provide instructions
          on how to complete the survey.
        </p>
        <p v-else class="info-color font-weight-light">
          We made it short, easy, and fun...
          just swipe right for yes or left for no!
          And once you're done we won't keep contacting you.
        </p>
      </v-flex>
      <v-flex xs12 swipe-touch>
        <v-layout
          row
          justify-center
          class="swipe-row">
          <v-flex class="xs12">
            <v-icon large class="arrows to-the-left">reply</v-icon>
            <h2>SWIPE</h2>
            <v-icon large class="arrows to-the-right">reply</v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card-text>

</template>

<script>
export default {
  name: 'IntroCard',
  props: {
    isDemo: false,
    introduction: null,
  },
};
</script>

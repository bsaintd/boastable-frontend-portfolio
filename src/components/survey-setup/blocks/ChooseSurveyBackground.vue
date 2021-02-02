<template>
  <v-radio-group v-model="backgroundImage">
    <v-container fluid grid-list-lg px-2 py-0>
      <v-layout row wrap>
        <v-flex
          xs6
          sm4
          v-for="(photo, index) in photos"
          :key="index"
          class="bg-image-select">
          <v-layout column>
            <v-flex pb-0>
              <img
                :src="`${photo.src}`"
                class="image"
                alt="photo.title"
                width="100%"
                height="100%">
            </v-flex>
            <v-flex pt-1 pb-3>
              <v-radio
                :label="photo.title"
                :value="photo.src"
                color="primary">
              </v-radio>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-radio-group>
</template>

<script>
export default {
  props: ['src'],
  computed: {
    backgroundImage: {
      get() {
        return this.src;
      },
      set(val) {
        this.$emit('update', val);
      },
    },
  },
  data() {
    return {
      photos: [
        {
          title: 'Auto shop',
          src: '/static/customer-survey-background-autobody.jpg',
        },
        {
          title: 'Law or Corporate',
          src: '/static/customer-survey-background-law-or-business.jpg',
        },
        {
          title: 'Restaurant',
          src: '/static/customer-survey-background-restaurant.jpg',
        },
        {
          title: 'Yoga or Fitness',
          src: '/static/customer-survey-background-yoga-or-fitness.jpg',
        },
        {
          title: 'Gradient Only',
          src: '/static/gradient-only-background.jpg',
        },
      ],
    };
  },
  updated() {
    this.backgroundImage = this.src;
  },
  methods: {
    sendUpdate() {
      this.$emit('update', this.backgroundImage);
    },
  },
};
</script>

<style lang="scss">
.bg-image-select {
  .v-radio {
    margin: 0;
  }
  .v-label {
    font-size: 14px;
    line-height: 1;
  }
}
</style>

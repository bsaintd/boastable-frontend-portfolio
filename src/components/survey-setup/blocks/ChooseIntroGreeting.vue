<template>
  <v-radio-group v-model="selectedGreeting">
    <v-radio
      v-for="greeting in greetings"
      :key="greeting"
      :label="greeting"
      :value="greeting"
      color="primary">
    </v-radio>
  </v-radio-group>
</template>

<script>
export default {
  props: {
    introduction: String,
  },
  computed: {
    selectedGreeting: {
      get() {
        return this.introduction;
      },
      set(v) {
        this.$emit('updateGreeting', v);
      },
    },
  },
  data() {
    return {
      greetings: [
        'Thanks for visiting us!',
        'Thanks for stopping by!',
        'Thanks for choosing us!',
        'Thank You!',
      ],
    };
  },
};
</script>

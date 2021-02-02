<template>
<v-dialog v-model="dialogStatus" fullscreen>
  <v-progress-circular
    class="loading-spinner"
    :size="70"
    :width="7"
    indeterminate
    color="secondary">
  </v-progress-circular>
</v-dialog>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    showLoader: Boolean,
  },
  computed: {
    dialogStatus: {
      get() {
        return this.$props.showLoader;
      },
      set(value) {
        this.$emit('toggleLoader', value);
      },
    },
  },
};
</script>

<style scoped>
.loading-spinner {
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
}
</style>

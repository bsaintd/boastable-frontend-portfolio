<template>
  <v-snackbar
    :text="text"
    :timeout="timeout"
    :top="y === 'top'"
    :bottom="y === 'bottom'"
    :left="x ==='left'"
    :right="x === 'right'"
    :multi-line="mode === 'multi-line'"
    :vertical="mode === 'vertical'"
    v-model="snackbar">
      {{text}}
      <v-btn flat dark @click="snackbar = false">
        Dismiss
      </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Snackbar',
  data() {
    return {
      snackbar: false,
      text: '',
      timeout: 6000,
      y: 'bottom',
      x: null,
      mode: null,
    };
  },
  computed: {
    /* get any errors reactively from the notifications module */
    getError() {
      return this.$store.getters.getError;
    },
    /* get any info (non-error messages) reactively from the notifications module */
    getInfo() {
      return this.$store.getters.getInfo;
    },
  },
  methods: {
    // update data and activate snackbar notification
    setSnackbar() {
      if (this.getError) {
        this.text = this.getError;
      } else if (this.getInfo) {
        this.text = this.getInfo;
      }
      this.snackbar = true;
      // showSnackbar in App.vue on <router-view/>
      this.$emit('showSnackbar', this.snackbar);
    },
  },
  watch: {
    // watch computed: getError() for changes to activate snackbar and display error
    getError(getError) {
      if (typeof getError === 'string') {
        this.setSnackbar(getError);
      }
    },
    // watch computed: getInfo() for changes to activate snackbar and display info
    getInfo(getInfo) {
      if (typeof getInfo === 'string') {
        this.setSnackbar(getInfo);
      }
    },
  },
};
</script>

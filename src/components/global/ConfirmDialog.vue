<template>
  <v-dialog
  v-model="confirmDialogOpen"
  max-width="500px">
    <v-card>
      <v-card-title class="primary-color bg">
        <span class="title">{{ confirmationMsg.title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <span class="headline font-weight-thin">{{ confirmationMsg.body }}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions class="pr-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          depressed
          @click.stop="confirmYes">
          Yes
        </v-btn>
        <v-btn
          depressed
          class="mr-2"
          @click.stop="confirmNo">
          No
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirmDialog',
  props: {
    confirmationMsg: Object,
    showConfirmDialog: Boolean,
  },
  computed: {
    confirmDialogOpen: {
      get() {
        return this.$props.showConfirmDialog;
      },
      set(value) {
        return this.$emit('closeConfirmDialog', value);
      },
    },
  },
  methods: {
    confirmYes() {
      this.$emit('confirmDialogYes');
      this.confirmDialogOpen = false;
    },
    confirmNo() {
      this.confirmDialogOpen = false;
    },
  },
};
</script>

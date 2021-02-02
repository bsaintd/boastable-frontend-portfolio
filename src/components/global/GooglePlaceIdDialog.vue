<template>
  <v-dialog
  v-model="dialogIsOpen"
  max-width="500px"
  persistent>
    <v-card>
      <v-card-text>
        <v-container>
          <v-layout>
            <v-flex xs12 class="text-xs-center">
              <h2>Don't forget to setup your Google Place ID!</h2>
              <p class="font-weight-thin pt-4 px-4 subheading">
                If you forget this step, your customers won't have the option to leave
                a Google review at the end of the survey.
              </p>
              <p>
                <v-checkbox
                  label="Stop showing this notification"
                  v-model="hidePlaceIdReminder"
                  color="primary"
                  class="font-weight-regular">
                </v-checkbox>
              </p>
              <div>
                <v-btn
                  color="primary"
                  dark
                  outline
                  round
                  @click.stop="setupId">
                  CREATE ID
                </v-btn>
              </div>
              <div>
                <v-btn
                  flat
                  small
                  class="text-capitalize font-weight-thin"
                  @click.stop="close">
                  I'm
                  &nbsp;
                  <span class="text-lowercase">
                    not registered on
                  </span>
                  &nbsp;
                  Google
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { UPDATE_ACCOUNT } from '@/store/actionTypes';

export default {
  name: 'GooglePlaceIdDialog',
  props: {
    showDialog: Boolean,
  },
  computed: {
    hidePlaceIdReminder: {
      get() {
        return this.$store.getters.getAccount.hide_place_id_reminder;
      },
      set(v) {
        this.$store.dispatch(UPDATE_ACCOUNT, { hide_place_id_reminder: v });
      },
    },
    dialogIsOpen: {
      get() {
        return this.$props.showDialog;
      },
      set(value) {
        this.$emit('close', value);
      },
    },
  },
  methods: {
    setupId() {
      this.$router.push({ name: 'AccountSettings' });
    },
    close() {
      this.$emit('close', false);
    },
  },
};
</script>

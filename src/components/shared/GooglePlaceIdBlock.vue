<!--
Component Name: GooglePlaceIdBlock
Description : View and modify a user's google place ID
-->
<template>
  <section class="px-3">
    <div class="blue-titlebar pa-2 elevation-1">
      <h3>Google Business Setup</h3>
    </div>
    <div class="white pb-3 px-3 pt-4 mb-3 elevation-1">
      <!-- current Google Place info -->
      <div v-if="mode === 'view'">
        <div>
          <h3>Google Business Profile</h3>
          <p>
            {{ googleBusinessName || 'Please select your Google Business Place ID' }}
          </p>
        </div>
        <div>
          <h3>Google ID</h3>
          <p>
            {{ googlePlaceId || 'No ID Selected' }}
          </p>
        </div>
        <p>
        <v-btn
          depressed
          @click="mode = 'search'">
          Search for Google Place ID
        </v-btn>
        </p>
        <p class="text-xs-center">- OR -</p>
        <p>
        <v-btn
          depressed
          @click="mode = 'manual'">
          Manually Enter Google Place ID
        </v-btn>
        </p>
        <v-alert
          :value="true"
          color="primary"
          icon="warning"
      outline>
          <p>
             <a target="_blank" href="https://www.youtube.com/watch?v=SU5uvO0nzsU">VIDEO: Find Service Area Business Place ID</a>
          </p>
          <p>
          </p>
          <small>
            In some cases, service area businesses have a Place ID,
            but it doesn't come up in the automatic search. Try the above
            instructional video, and if you're able to find your Place ID
            this way, you can enter it manually.
          </small>
        </v-alert>
      </div>
      <div v-if="mode === 'manual'">
        <v-text-field
          v-model="selectedGoogleBusiness"
          label="Google Business Name"
        ></v-text-field>
        <v-text-field
          v-model="selectedPlaceId"
          label="Google Place ID"
        ></v-text-field>
        <v-btn
          color="primary"
          depressed
          @click="setBusinessData()">
          Save
        </v-btn>
        <v-btn
          depressed
          @click="mode = 'view'">
          Cancel
        </v-btn>
      </div>
      <!-- edit Google Place info -->
      <div v-if="mode === 'search'">
        <google-autocomplete
          id="googlePlaceIdQuery"
          ref="businessId"
          classname="form-control"
          placeholder="Start typing your business name"
          v-on:change="getBusinessData"
          country="us"/>
          <v-btn
            color="primary"
            depressed
            @click="setBusinessData()">
            Save
          </v-btn>
          <v-btn
            depressed
            @click="mode = 'view'">
            Cancel
          </v-btn>
      </div>
    </div>
  </section>
</template>

<script>
import BasicPageLayout from '@/components/layouts/BasicPageLayout';
import GoogleAutocomplete from '@/components/shared/GoogleAutocomplete';
import { UPDATE_ACCOUNT } from '@/store/actionTypes';

export default {
  name: 'GooglePlaceIdBlock',
  components: {
    BasicPageLayout,
    GoogleAutocomplete,
  },
  data() {
    return {
      selectedGoogleBusiness: 'Google Business Name',
      selectedPlaceId: '',
      mode: 'view',
    };
  },
  computed: {
    googlePlaceId() {
      return this.$store.getters.getAccount.google_place_id;
    },
    googleBusinessName() {
      return this.$store.getters.getAccount.google_business_name;
    },
  },
  methods: {
    saveGooglePlaceUpdates() {
      const googlePlace = {
        google_business_name: this.selectedGoogleBusiness,
        google_place_id: this.selectedPlaceId,
      };
      this.$store.dispatch(UPDATE_ACCOUNT, googlePlace);
    },
    getBusinessData(officialName, placeId) {
      this.selectedGoogleBusiness = officialName;
      this.selectedPlaceId = placeId;
    },
    setBusinessData() {
      this.saveGooglePlaceUpdates();
      this.mode = 'view';
    },
  },
};
</script>

<template>
  <v-form>
    <v-text-field
      ref="autocomplete"
      type="text"
      :id="id"
      :placeholder="placeholder"
      label="Find Google Place ID"
      append-icon="search"
      v-model="autocompleteText"
      @focus="onFocus()"
      @blur="onBlur()"
      @change="onChange"
      @keypress="onKeyPress"
      @keyup="onKeyUp">
    </v-text-field>
  </v-form>
</template>

<script>
const ADDRESS_COMPONENTS = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  administrative_area_level_2: 'county',
  country: 'long_name',
  postal_code: 'short_name',
  place_id: 'place_id',
  formatted_phone_number: 'formatted_phone_number',
};

const CITIES_TYPE = ['locality', 'administrative_area_level_3'];
// eslint-disable-next-line
const ESTABLISHMENTS_TYPE = ['establishment'];
const REGIONS_TYPE = ['locality', 'sublocality', 'postal_code', 'country',
  'administrative_area_level_1', 'administrative_area_level_2'];

export default {
  name: 'GoogleAutocomplete',

  props: {
    id: {
      type: String,
      required: true,
    },

    placeholder: {
      type: String,
      default: 'Start typing',
    },

    types: {
      type: String,
      default: 'establishment',
    },

    country: {
      type: [String, Array],
      default: null,
    },

    enableGeolocation: {
      type: Boolean,
      default: false,
    },

    geolocationOptions: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      /**
       * The Autocomplete object.
       * @type {Autocomplete}
       * @link https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
       */
      autocomplete: null,

      /**
       * Autocomplete input text
       * @type {String}
       */
      autocompleteText: '',

      place_id: '',

      geolocation: {
        /**
         * Google Geocoder Objet
         * @type {Geocoder}
         * @link https://developers.google.com/maps/documentation/javascript/reference#Geocoder
         */
        geocoder: null,

        /**
         * Filled after geolocate result
         * @type {Coordinates}
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Coordinates
         */
        loc: null,

        /**
         * Filled after geolocate result
         * @type {Position}
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Position
         */
        position: null,
      },
    };
  },

  watch: {
    autocompleteText(newVal, oldVal) {
      this.$emit('inputChange', { newVal, oldVal }, this.id);
    },
    country() {
      this.autocomplete.setComponentRestrictions({
        country: this.country === null ? [] : this.country,
      });
    },
  },

  mounted() {
    const options = {};

    if (this.types) {
      options.types = [this.types];
    }

    if (this.country) {
      options.componentRestrictions = {
        country: this.country,
      };
    }
    // eslint-disable-next-line
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(this.id),
      options,
    );

    this.autocomplete.addListener('place_changed', this.onPlaceChanged);
  },

  methods: {
    /**
     * When a place changed
     */
    onPlaceChanged() {
      const place = this.autocomplete.getPlace();

      this.place_id = place.place_id;

      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        this.$emit('no-results-found', place, this.id);
        return;
      }

      if (place.address_components !== undefined) {
        // return returnData object and PlaceResult object
        this.$emit('placechanged', this.formatResult(place), place, this.id);

        // update autocompleteText then emit change event
        // this.autocompleteText = document.getElementById(this.id).value;
        this.autocompleteText = place.name;
        this.onChange();
      }
    },

    /**
     * When the input gets focus
     */
    onFocus() {
      this.biasAutocompleteLocation();
      this.$emit('focus');
    },

    /**
     * When the input loses focus
     */
    onBlur() {
      this.$emit('blur');
    },

    /**
     * When the input got changed
     */
    onChange() {
      this.$emit('change', this.autocompleteText, this.place_id || 'not found');
    },

    /**
     * When a key gets pressed
     * @param  {Event} event A keypress event
     */
    onKeyPress(event) {
      if (event.code === 'Enter') {
        event.preventDefault();
      }
      this.$emit('keypress', event);
    },

    /**
     * When a keyup occurs
     * @param  {Event} event A keyup event
     */
    onKeyUp(event) {
      this.$emit('keyup', event);
    },

    /**
     * Clear the input
     */
    clear() {
      this.autocompleteText = '';
    },

    /**
     * Focus the input
     */
    focus() {
      this.$refs.autocomplete.focus();
    },

    /**
     * Blur the input
     */
    blur() {
      this.$refs.autocomplete.blur();
    },

    /**
     * Update the value of the input
     * @param  {String} value
     */
    update(value) {
      this.autocompleteText = value;
    },

    /**
     * Update the coordinates of the input
     * @param  {Coordinates} value
     */
    updateCoordinates(value) {
      if (!value && !(value.lat || value.lng)) return;
      // eslint-disable-next-line
      if (!this.geolocation.geocoder) this.geolocation.geocoder = new google.maps.Geocoder();
      this.geolocation.geocoder.geocode({ location: value }, (results, status) => {
        if (status === 'OK') {
          // eslint-disable-next-line
          results = this.filterGeocodeResultTypes(results);
          if (results[0]) {
            this.$emit('placechanged', this.formatResult(results[0]), results[0], this.id);
            this.update(results[0].formatted_address);
          } else {
            this.$emit('error', 'no result for provided coordinates');
          }
        } else {
          this.$emit('error', 'error getting address from coords');
        }
      });
    },

    /**
     * Update location based on navigator geolocation
     */
    geolocate() {
      this.updateGeolocation((geolocation) => {
        this.updateCoordinates(geolocation);
      });
    },

    /**
     * Update internal location from navigator geolocation
     * @param  {Function} (geolocation, position)
     */
    updateGeolocation(callback = null) {
      if (navigator.geolocation) {
        const options = {};
        if (this.geolocationOptions) Object.assign(options, this.geolocationOptions);
        navigator.geolocation.getCurrentPosition((position) => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.geolocation.loc = geolocation;
          this.geolocation.position = position;

          if (callback) callback(geolocation, position);
        }, (err) => {
          this.$emit('error', 'Cannot get Coordinates from navigator', err);
        }, options);
      }
    },


    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    biasAutocompleteLocation() {
      if (this.enableGeolocation) {
        this.updateGeolocation((geolocation, position) => {
          // eslint-disable-next-line
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          });
          this.autocomplete.setBounds(circle.getBounds());
        });
      }
    },

    /**
     * Format result from Geo google APIs
     * @param place
     * @returns {{formatted output}}
     */
    formatResult(place) {
      const returnData = {};
      for (let i = 0; i < place.address_components.length; i += 1) {
        const addressType = place.address_components[i].types[0];

        if (ADDRESS_COMPONENTS[addressType]) {
          const val = place.address_components[i][ADDRESS_COMPONENTS[addressType]];
          returnData[addressType] = val;
        }
      }

      returnData.latitude = place.geometry.location.lat();
      returnData.longitude = place.geometry.location.lng();
      return returnData;
    },

    /**
     * Extract configured types out of raw result as
     * Geocode API does not allow to do it
     * @param results
     * @returns {GeocoderResult}
     * @link https://developers.google.com/maps/documentation/javascript/reference#GeocoderResult
     */
    filterGeocodeResultTypes(results) {
      if (!results || !this.types) return results;
      const output = [];
      let types = [this.types];
      if (types.includes('(cities)')) types = types.concat(CITIES_TYPE);
      if (types.includes('(regions)')) types = types.concat(REGIONS_TYPE);
      if (types.includes('(establishments)')) types = types.concat(ESTABLISHMENTS_TYPE);

      results.map(r => r.types.some((t) => {
        let found = types.includes(t);
        if (found) {
          output.push(r);
          found = true;
        }
        return found;
      }));
      return output;
    },
  },
};
</script>

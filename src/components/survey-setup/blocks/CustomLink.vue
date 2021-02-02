<template>
  <div>
  <v-textarea
    label="Final message"
    :value="farewell"
    @blur="updateData('farewell', $event)"
    rows="1"
    auto-grow
    counter
    maxlength="120"
    >
  </v-textarea>
  <v-text-field
    label="Button Text"
    :value="linkText"
    @blur="updateData('linkText', $event)"
    counter
    maxlength="32"
     />
  <v-text-field
    label="Button Link URL"
    :value="linkUrl"
    @blur="updateData('linkUrl', $event)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { UPDATE_SURVEY_TEMPLATE } from '@/store/actionTypes';

export default {

  computed: {
    ...mapState({
      farewell: state => state.survey.settings.farewell,
      linkText: state => state.survey.settings.custom.text,
      linkUrl: state => state.survey.settings.custom.link,
    }),
  },
  methods: {
    updateData(key, { target: { value } }) {
      const current = this[key];
      const existsAndDifferent = current !== value;
      const link = this.makeLinkValid(value);
      if (existsAndDifferent) {
        let update = {};
        switch (key) {
          case 'farewell':
            update = { farewell: value };
            break;
          case 'linkText':
            update = { custom: { text: value, link: this.linkUrl } };
            break;
          case 'linkUrl':
            update = { custom: { text: this.linkText, link } };
            break;
          default:
            break;
        }
        this.$store.dispatch(UPDATE_SURVEY_TEMPLATE, update);
      }
    },
    makeLinkValid(link) {
      const validLink = link.match(/^(https?:\/\/|mailto:).*/);
      if (link && !validLink) {
        return `https://${link}`;
      }
      return link;
    },
  },
};
</script>

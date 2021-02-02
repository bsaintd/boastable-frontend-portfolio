<template>
  <v-content>
    <basic-page-header>
      <template slot="page-title">
        <slot name="page-title"></slot>
      </template>
    </basic-page-header>
    <v-container fluid class="mt-5">
      <v-layout
      align-start
      row
      fill-height
      pt-3
      :class="{ 'justify-center': $vuetify.breakpoint.lgAndDown }">
        <v-flex xs12 lg10 xl8>
          <slot name="page-content"></slot>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import BasicPageHeader from '@/components/layouts/BasicPageHeader';

export default {
  name: 'BasicPageLayout',
  components: {
    BasicPageHeader,
  },
  props: {
    pageTitle: 'String',
  },
};
</script>

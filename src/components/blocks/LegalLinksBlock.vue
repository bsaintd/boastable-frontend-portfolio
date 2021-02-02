<template>
<section class="px-3">
  <div class="blue-titlebar pa-2 elevation-1">
    <h3>Legal</h3>
  </div>
  <v-layout column class="white px-5 py-4 mb-3 elevation-1">
    <v-flex xs12 md6>
      <v-btn
        class="ltprimary"
        href="//boastable.co/legal/#terms-and-conditions"
        depressed
        outline
      >
        Terms & Conditions
      </v-btn>
      <v-btn
        href="//boastable.co/legal/#privacy-policy"
        class="ltprimary"
        depressed
        outline
      >
        Privacy Policy
      </v-btn>
    </v-flex>
  </v-layout>
</section>
</template>
<script>
export default {
  name: 'LegalLinksBlock',
};
</script>

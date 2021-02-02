<template>
<v-img :src="cardIconSrc(brand)" height="30px" width="40px"></v-img>
</template>
<script>
export default {
  name: 'CreditCardIcon',
  props: ['brand'],
  methods: {
    cardIconSrc(brand) {
      // American Express, Diners Club, Discover,
      // JCB, MasterCard, UnionPay, Visa, or Unknown.
      let currentBrand = 'credit';
      switch (brand) {
        case 'Visa':
          currentBrand = 'visa';
          break;
        case 'American Express':
          currentBrand = 'amex';
          break;
        case 'Discover':
          currentBrand = 'discover';
          break;
        case 'Diners Club':
          currentBrand = 'diners';
          break;
        case 'JCB':
          currentBrand = 'jcb';
          break;
        case 'MasterCard':
          currentBrand = 'mastercard';
          break;
        default:
          break;
      }
      const path = `/static/credit-card-icons/${currentBrand}.png`;
      return path;
    },
  },
};
</script>

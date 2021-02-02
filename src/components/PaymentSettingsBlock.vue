<template>
  <section class="px-3">
    <div class="blue-titlebar pa-2 elevation-1">
      <h3>Billing Information</h3>
    </div>
        <v-container class="white pa-3 mb-3 elevation-1">
          <v-layout
            align-start
            justify-start
            row
            v-show="!changeCC"
            wrap>
            <v-flex v-if="billingInfo.brand" class="pa-2" xs12>
              <v-layout row justify-start align-center>
                <v-flex>XXXX-XXXX-XXXX-{{ billingInfo.last4 }}</v-flex>
                <v-flex>
                  <credit-card-icon :brand="billingInfo.brand"/>
                </v-flex>
              </v-layout>
              <div>
                {{ billingInfo.name }}
              </div>
              <div>
                {{ billingInfo.address_line1 }}
                {{ billingInfo.address_line2 }}
              </div>
              <div>
                {{ billingInfo.address_city }}
                {{ billingInfo.address_state }}
                {{ billingInfo.address_zip }}
              </div>
            </v-flex>
            <v-flex xs12>
              <v-btn
                depressed
                class="mt-3"
                @click.stop="changeCC = !changeCC">
                {{ cardFound(billingInfo.brand) ? 'Replace Card' : 'Add Card' }}
              </v-btn>
            </v-flex>
            <v-flex v-if="membershipStatus == 'trial' && !billingInfo.brand" xs12>
              Add credit card to increase SMS remaining to 100.
            </v-flex>
          </v-layout>
          <div v-show="changeCC" class="payment-entry-form">
            <v-container>
              <v-form
                ref="changePaymentForm"
                v-model="validChangePayForm"
                class="stripe-payment-form">
                <div class="stripe-styling">
                  <v-layout row>
                    <v-flex xs12>
                      <div class="stripe-field">
                        <div
                          id="card-number"
                          class="input empty">
                        </div>
                        <label for="card-number">
                          Card Number
                        </label>
                        <div class="stripe-baseline"></div>
                        <div
                          class="help-block"
                          v-if="cardNumberError">
                          {{cardNumberError}}
                        </div>
                      </div>
                    </v-flex>
                  </v-layout>


                  <v-layout row>
                    <v-flex xs6 pr-3>
                      <div class="stripe-field">
                        <div
                          id="card-cvc"
                          class="input empty">
                        </div>
                        <label for="card-cvc">
                          Card CVC
                        </label>
                        <div class="stripe-baseline"></div>
                        <span
                          class="help-block"
                          v-if="cardCvcError">
                          {{cardCvcError}}
                        </span>
                      </div>
                    </v-flex>
                <v-flex xs6 pl-3>
                  <div class="stripe-field">
                    <div
                    id="card-expiry"
                    class="input empty">
                    </div>
                    <label for="card-expiry">
                      Expiry
                    </label>
                    <div class="stripe-baseline"></div>
                    <span
                      class="help-block"
                      v-if="cardExpiryError">
                        {{cardExpiryError}}
                    </span>
                  </div>
                </v-flex>
              </v-layout>
            </div> <!-- end of div.stripe-styling -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  name="cardholder_name"
                  type="text"
                  label="Cardholder Name"
                  v-model="tokenData.name"
                  v-bind:rules="nameRules"
                  validate-on-blur
                  require>
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  name="billing_address"
                  type="text"
                  label="Address"
                  v-model="tokenData.address_line1"
                  v-bind:rules="addressRules"
                  validate-on-blur
                  require>
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  name="billing_address_2"
                  type="text"
                  label="Address Line 2"
                  v-model="tokenData.address_line2"
                  v-bind:rules="addressRules2"
                  validate-on-blur
                >
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  name="city"
                  type="text"
                  label="City"
                  v-model="tokenData.address_city"
                  v-bind:rules="cityRules"
                  validate-on-blur
                  require>
                </v-text-field>
              </v-flex>
              <v-flex xs6 pr-3>
                <v-autocomplete
                  v-model="tokenData.address_state"
                  :items="states"
                  label="State"
                  persistent-hint
                  require/>
              </v-flex>
              <v-flex xs6 pl-3>
                <v-text-field
                  name="zipcode"
                  type="text"
                  label="Zip Code"
                  mask="#####"
                  v-model="tokenData.address_zip"
                  v-bind:rules="zipRules"
                  require>
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  color="primary"
                  depressed
                  :disabled="invalidBillingInfo"
                  @click.prevent="changePaymentMethod()"
                  class="mt-3">
                  <span v-if="loading">Checking...</span>
                  <span v-if="!loading">Save</span>
                </v-btn>
                <v-btn
                  flat
                  @click.prevent="reset()"
                  class="mt-3">
                  Cancel
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </div>
    </v-container>
  </section>
</template>

<script>
import BasicPageLayout from '@/components/layouts/BasicPageLayout';
import CreditCardIcon from '@/components/CreditCardIcon';
import stripePublicKey from '@/store/stripeSettings';
import { CHANGE_STRIPE_DATA,
  COLLECT_CURRENT_BILLING_INFO,
  COLLECT_STRIPE_DATA,
  GET_STRIPE_MEMBERSHIP } from '@/store/actionTypes';
import { isName, isAddress, isAddressLineTwo, isCity, statesOfTheUS, isZipCode } from '@/store/validationTypes';

export default {
  name: 'PaymentSettings',
  components: {
    BasicPageLayout,
    CreditCardIcon,
  },
  computed: {
    billingInfo() {
      return this.$store.getters.getBillingInfo;
    },
    membershipStatus() {
      return this.$store.state.payment.membership.status;
    },
    invalidBillingInfo() {
      const invalidForm = !this.validChangePayForm;

      return Boolean(invalidForm ||
        this.cardNumberError ||
        !this.cardNumber._complete ||
        this.cardCvcError ||
        !this.cardCvc._complete ||
        this.cardExpiryError ||
        !this.cardExpiry._complete);
    },
  },
  data() {
    return {
      changeCC: null,
      validChangePayForm: false,
      // stripe elements payment form inputs
      card: {
        number: '',
        expiry: '',
        cvc: '',
        zipcode: '',
      },
      // stripe public key
      stripeKey: stripePublicKey,
      // stripe elements
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      stripe: null,
      // stripe elements errors
      stripeError: '',
      cardCvcError: '',
      cardExpiryError: '',
      cardNumberError: '',
      loading: false,
      // form field rules
      nameRules: isName,
      addressRules: isAddress,
      addressRules2: isAddressLineTwo,
      cityRules: isCity,
      zipRules: isZipCode,
      // US state slection options
      states: statesOfTheUS,
      // billing address data
      tokenData: {
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: 'United States',
      },
    };
  },
  methods: {
    cardFound(brand) {
      const test = Boolean(brand);
      this.$emit('allowSubscribe', test);
      return test;
    },
    // error listener for stripe elements form fields
    listenForErrors() {
      const vm = this;
      this.cardNumber.addEventListener('change', (event) => {
        vm.toggleCardError(event);
        // vm.cardNumberError = '';
        if (event.complete) {
          vm.card.number = true;
        } else {
          vm.card.number = false;
        }
      });
      this.cardExpiry.addEventListener('change', (event) => {
        vm.toggleExpError(event);
        // vm.cardExpiryError = '';
        if (event.complete) {
          vm.card.expiry = true;
        } else {
          vm.card.expiry = false;
        }
      });
      this.cardCvc.addEventListener('change', (event) => {
        vm.toggleCvcError(event);
        // vm.cardCvcError = '';
        if (event.complete) {
          vm.card.cvc = true;
        } else {
          vm.card.cvc = false;
        }
      });
    },
    // toggle stripe elements form field error message
    toggleCardError(event) {
      if (event.error) {
        this.cardNumberError = event.error.message;
      } else {
        this.cardNumberError = '';
      }
    },
    toggleExpError(event) {
      if (event.error) {
        this.cardExpiryError = event.error.message;
      } else {
        this.cardExpiryError = '';
      }
    },
    toggleCvcError(event) {
      if (event.error) {
        this.cardCvcError = event.error.message;
      } else {
        this.cardCvcError = '';
      }
    },
    // check for errors with stripe elements form fields
    // if no errors update payment method/billing info
    validateCardElements() {
      let valid = true;
      if (this.$refs.changePaymentForm.validate()) {
        this.clearCardErrors();
        if (!this.card.number) {
          valid = false;
          this.cardNumberError = 'Card Number is Required';
        }
        if (!this.card.cvc) {
          valid = false;
          this.cardCvcError = 'CVC is Required';
        }
        if (!this.card.expiry) {
          valid = false;
          this.cardExpiryError = 'Month is Required';
        }
        if (this.stripeError) {
          valid = false;
        }
      }
      return valid;
    },
    // update payment method/billing info
    changePaymentMethod() {
      if (this.validateCardElements()) {
        // change text on submit button to loading
        this.loading = true;
        // submit new billing info to stripe
        this.stripe.createToken(this.cardNumber, this.tokenData)
          .then((result) => {
            // error handling
            if (result.error) {
              this.stripeError = result.error.message;
            } else {
              // update stripe info with api
              const stripeData = result.token;
              this.$store.dispatch(COLLECT_STRIPE_DATA, stripeData)
                .then(() => this.$store.dispatch(CHANGE_STRIPE_DATA))
                .then(() => {
                  // revert text on submit button
                  this.loading = false;
                  return this.$store.dispatch(COLLECT_CURRENT_BILLING_INFO);
                })
              // After successfully changing payment method, close form
                .then(() => this.reset())
              // re-membership info to show new SMS remaining
                .then(() => this.$store.dispatch(GET_STRIPE_MEMBERSHIP));
            }
          });
      }
    },
    // init clear the stripe elements, stripe element errors and billing info form fields
    reset() {
      this.changeCC = !this.changeCC;
      this.clearElementInputs();
      this.clearCardErrors();
      this.clearBillingInfo();
    },
    // clear stripe elements form fields
    clearElementInputs() {
      this.cardCvc.clear();
      this.cardExpiry.clear();
      this.cardNumber.clear();
    },
    // clear stripe element errors
    clearCardErrors() {
      this.stripeError = '';
      this.cardCvcError = '';
      this.cardExpiryError = '';
      this.cardNumberError = '';
    },
    // clearbilling info form fields
    clearBillingInfo() {
      this.tokenData = {
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: 'United States',
      };
    },
  },
  mounted() {
    // detect if stripe dependency is loaded
    if (window.Stripe === undefined) {
      // eslint-disable-next-line no-console
      console.error('Payment processor unable to load!');
    } else {
      // Floating labels for Stripe Elements inputs
      const inputs = document.querySelectorAll('.stripe-styling .input');
      Array.prototype.forEach.call(inputs, (input) => {
        input.addEventListener('focus', () => {
          input.classList.add('focused');
        });
        input.addEventListener('blur', () => {
          input.classList.remove('focused');
        });
        input.addEventListener('keyup', () => {
          if (input.value.length === 0) {
            input.classList.add('empty');
          } else {
            input.classList.remove('empty');
          }
        });
      });
      /*  define stripe styling as object
      to be pased in as arg for elements.create */
      const stripeStyle = {
        base: {
          color: '#1A1A1A',
          fontWeight: 500,
          fontFamily: '"Lato", sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#CFD7DF',
          },
          ':-webkit-autofill': {
            color: '#e39f48',
          },
        },
      };
      // Define Stripe Elements classes (for state of field)
      const elementClasses = {
        focus: 'focused',
        empty: 'empty',
        invalid: 'invalid',
      };
      // declare stripe elements and settings
      const stripe = window.Stripe(this.stripeKey);
      this.stripe = stripe;
      const elements = stripe.elements({
        fonts: [
          {
            // Lato regular
            family: 'Lato',
            weight: 400,
            src: 'local("Lato Regular"), local("Lato-Regular"), url(https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wXiWtFCc.woff2) format("woff2")',
            unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
          },
        ],
      });

      this.cardCvc = elements.create('cardCvc', {
        // placeholder: '',
        style: stripeStyle,
        classes: elementClasses,
      });
      this.cardExpiry = elements.create('cardExpiry', {
        // placeholder: '',
        style: stripeStyle,
        classes: elementClasses,
      });
      this.cardNumber = elements.create('cardNumber', {
        // placeholder: '',
        style: stripeStyle,
        classes: elementClasses,
      });
      // mount surrogate <div>'s for stripe element fomr fields
      this.cardCvc.mount('#card-cvc');
      this.cardExpiry.mount('#card-expiry');
      this.cardNumber.mount('#card-number');
      // stripe elements error handling activation
      this.listenForErrors();
    }
  },
  created() {
    // init action in vuex store payment module
    // to get current billing info and set to state.currentBillingInfo
    this.$store.dispatch(COLLECT_CURRENT_BILLING_INFO);
  },
};
</script>

<style lang="scss" scoped>
/* Local color variables (only usable here) */
$primary: #0f3c59;
$secondary: #ee6d58;
$accent: #ee6d58;
$error: #b71c1c;
$info: #fff;
$success: #186B24;
$warning: #FFC107;
$context: #6F6F6F;

.stripe-styling {
  .stripe-field {
    position: relative;
    width: 100%;
    height: 50px;
    margin-bottom: 18px;
  }
  .stripe-baseline {
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: 0;
    background-color: #828282;
    transition: background-color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  label {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 6px;
    color: #828282;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform-origin: 0 50%;
    cursor: text;
    transition-property: color, transform;
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .input {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    padding-bottom: 7px;
    color: #32325d;
    background-color: transparent;
  }
  .input::-webkit-input-placeholder {
    color: transparent;
    transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .input::-moz-placeholder {
    color: transparent;
    transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .input:-ms-input-placeholder {
    color: transparent;
    transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .input.StripeElement {
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    will-change: opacity;
  }
  .input.focused, .input:not(.empty) {
    opacity: 1;
  }
  .input.focused::-webkit-input-placeholder,
  .input:not(.empty)::-webkit-input-placeholder,
  .input.focused::-moz-placeholder,
  .input:not(.empty)::-moz-placeholder,
  .input.focused:-ms-input-placeholder,
  .input:not(.empty):-ms-input-placeholder {
    color: #cfd7df;
  }
  .input.focused + label,
  .input:not(.empty) + label {
    color: #828282;
    transform: scale(0.77) translateY(-25px);
    cursor: default;
  }
  .input.focused + label {
    color: $primary;
  }
  .input.invalid + label {
    color: $error;
  }
  .input.focused + label + .stripe-baseline {
    background-color: $primary;
    height: 2px;
  }
  .input.focused.invalid + label + .stripe-baseline {
    background-color: $error;
  }
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    border-style: none;
    -webkit-animation: 1ms void-animation-out;
  }
  input:-webkit-autofill {
    -webkit-text-fill-color: #e39f48;
    transition: background-color 100000000s;
    -webkit-animation: 1ms void-animation-out;
  }
  .StripeElement--webkit-autofill {
    background: transparent !important;
  }
  .help-block {
    bottom: -22px;
    position: absolute;
    font-size: 12px;
    color: $error;
  }
} /* end of .stripe-styling */
</style>

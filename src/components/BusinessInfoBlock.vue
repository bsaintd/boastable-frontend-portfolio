<template>
<section class="px-3">
  <div class="blue-titlebar pa-2 elevation-1">
    <h3>Business Information</h3>
  </div>
  <div class="white pa-3 mb-3 elevation-1">
    <!-- current acct info -->
    <div v-if="!editAccount">
      <div>
        <h3>Company</h3>
        <p>{{ businessName }}</p>
      </div>
      <div>
        <h3>Name</h3>
        <p>{{ ownerName }}</p>
      </div>
      <div>
        <h3>Phone</h3>
        <p>{{ displayPhone }}</p>
      </div>
      <!-- <div v-if="boastableName">
        <h3>Boastable Short Name</h3>
        <p>{{ boastableName }}</p>
      </div> -->
    </div>
    <!-- edit acct info form -->
    <div v-if="editAccount">
      <v-text-field
        v-model="accountUpdates.company_name"
        maxlength="30"
        label="Company Name"
        required>
      </v-text-field>
      <v-text-field
        v-model="accountUpdates.first_name"
        label="First Name"
        required>
      </v-text-field>
      <v-text-field
        v-model="accountUpdates.last_name"
        label="Last Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="accountUpdates.phone"
        label="Business Phone"
        mask="phone"
        required
      ></v-text-field>
      <!-- <v-text-field
        v-model="accountUpdates.boastable_name"
        label="Boastable Name"
        mask="nnnnnnnnnnnnnnnnnnnn"
        :rules="boastableNameRules"
      ></v-text-field> -->
      <!-- <v-alert
          :value="true"
          color="primary"
          icon="info"
      outline>
          <p>
            Boastable names can be used when a customer sends and SMS message
            back to Boastable. If they text your Boastable name to (321) 339-1391,
            they will receive your survey, and you will receive their feedback and
            contact information.
          </p>
        </v-alert> -->
      <v-btn
        color="primary"
        depressed
        @click="saveAcctUpdates()">
        Save Changes
      </v-btn>
      <v-btn
        depressed
        @click="toggleEditAccount()">
        Cancel
      </v-btn>
    </div>
    <v-btn
      depressed
      v-if="!editAccount"
      @click="toggleEditAccount()">
      Edit
    </v-btn>
  </div>
</section>
</template>

<script>
import _ from 'lodash';
import { UPDATE_ACCOUNT, GET_ACCOUNT } from '@/store/actionTypes';
import { parseNumber, formatNumber } from 'libphonenumber-js';

export default {
  name: 'BusinessInfoBlock',
  data() {
    return {
      accountUpdates: {
        first_name: '',
        last_name: '',
        company_name: '',
        phone: '',
        boastable_name: '',
      },
      boastableNameRules: [
        v => /^[a-z0-9]{3,20}$/.test(v) || 'Boastable names must be 3-20 characters, alphanumeric, and lowercase.',
      ],
      editAccount: false,
    };
  },
  computed: {
    account: {
      get() {
        return this.$store.state.account;
      },
    },
    displayPhone() {
      const phone = this.account.phone;
      return phone ? formatNumber(phone, 'National') : '';
    },
    businessName() {
      const companyName = this.account.company_name;
      return companyName || '';
    },
    ownerName() {
      const firstName = this.account.first_name;
      const lastName = this.account.last_name;
      return firstName ? `${firstName} ${lastName}` : '';
    },
    boastableName() {
      return this.account.boastable_name;
    },
    E164Phone: {
      get() {
        return formatNumber(parseNumber(this.accountUpdates.phone, 'US'), 'E.164');
      },
    },
  },
  methods: {
    saveAcctUpdates() {
      const updates = {};
      Object.keys(this.accountUpdates).map((key) => {
        const oldValue = this.account[key];
        const newValue = (key === 'phone') ?
          this.E164Phone :
          this.accountUpdates[key];

        if (oldValue !== newValue) {
          updates[key] = newValue;
        }
        return newValue;
      });

      if (!_.isEmpty(updates)) {
        this.$store.dispatch(UPDATE_ACCOUNT, updates);
      }
      this.toggleEditAccount();
    },
    toggleEditAccount() {
      this.editAccount = !this.editAccount;
      this.resetUpdates();
    },
    inputPhone(number) {
      return parseNumber(number, 'US').phone || '';
    },
    resetUpdates() {
      this.accountUpdates = _.pick(this.account, [
        'first_name',
        'last_name',
        'company_name',
        'boastable_name',
      ]);
      this.accountUpdates.phone = this.inputPhone(this.account.phone);
    },
  },
  created() {
    this.$store.dispatch(GET_ACCOUNT)
      .then(this.resetUpdates);
  },
};
</script>

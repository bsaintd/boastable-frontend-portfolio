<template>
  <basic-page-layout>
    <template slot="page-title">Account Settings</template>
    <template slot="page-content">
      <v-layout row wrap>
        <v-flex xs12 md6>
          <!-- account login email -->
          <authorization-block/>
          <business-info-block/>
          <google-place-id-block/>
        </v-flex>
        <v-flex xs12 md6>
          <payment-settings-block @allowSubscribe="allowSubscribeFlag = $event"/>
          <membership-info-block :allowSubscribe="allowSubscribeFlag"/>
        </v-flex>
      </v-layout>
    </template> <!-- end of page-content slot -->
  </basic-page-layout>
</template>

<script>
import BasicPageLayout from '@/components/layouts/BasicPageLayout';
import GoogleAutocomplete from '@/components/shared/GoogleAutocomplete';
import AuthorizationBlock from '@/components/AuthorizationBlock';
import BusinessInfoBlock from '@/components/BusinessInfoBlock';
import MembershipInfoBlock from '@/components/MembershipInfoBlock';
import GooglePlaceIdBlock from '@/components/shared/GooglePlaceIdBlock';
import PaymentSettingsBlock from '@/components/PaymentSettingsBlock';

export default {
  name: 'AccountSettings',
  components: {
    BasicPageLayout,
    BusinessInfoBlock,
    GoogleAutocomplete,
    PaymentSettingsBlock,
    AuthorizationBlock,
    MembershipInfoBlock,
    GooglePlaceIdBlock,
  },
  data() {
    return {
      allowSubscribeFlag: true,
    };
  },
};
</script>

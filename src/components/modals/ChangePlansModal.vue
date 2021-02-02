<template>
<v-dialog v-model="showDialogModal" max-width="800px">
  <v-card>
    <v-stepper v-model="step" class="elevation-0">
      <v-stepper-header>
        <v-stepper-step step="1">Choose Plan</v-stepper-step>
        <v-stepper-step v-if="noCreditCard && selectedPlan !== 'enterprise'"
          step="2">
          Enter Credit Card Information
        </v-stepper-step>
        <v-stepper-step :step="!noCreditCard || selectedPlan === 'enterprise' ? 2 : 3">{{
          selectedPlan === 'enterprise' ? 'Send Inquiry' : 'Confirm Plan' }}</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <select-plan-block @plan="selectedPlan = $event"/>
        </v-stepper-content>
        <v-stepper-content v-if="noCreditCard && selectedPlan !== 'enterprise'" step="2">
          <v-container justify-center>
            <v-layout>
              <change-card-form
                :triggerSave="saveNow"
                @saving="savingCard = $event"
                @finished="stepForward"
                @invalidCard="invalidForm = $event"/>
            </v-layout>
          </v-container>
        </v-stepper-content>
        <v-stepper-content :step="!noCreditCard || selectedPlan === 'enterprise' ? 2 : 3">
          <confirm-plan-block
            :plan="selectedPlan"
            :trigger="triggerSubscribe"
            :newSubscriber="newSubscriber"
            @subscribed="newSubscriber = $event"/>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-card-actions>
        <v-btn
          color='primary'
          depressed
          v-if="step == 1"
          :disabled="!selectedPlan"
          @click="stepForward">
          Next
        </v-btn>
        <v-btn
          color='primary'
          depressed
          v-if="stepName == 'enterCard'"
          @click="saveNow = true"
          :disabled="invalidForm || savingCard">
          {{ (savingCard) ? 'Saving' : 'Add Card' }}
        </v-btn>
        <v-btn
          color='primary'
          depressed
          v-if="stepName ==  'confirmPlan' && !newSubscriber && selectedPlan === 'pro'"
          @click="triggerSubscribe = true">
          Confirm
        </v-btn>
        <v-btn
          flat
          v-if="step == 1 || newSubscriber"
          @click="showDialogModal = false">
          Close
        </v-btn>
        <v-btn
          flat
          v-if="stepName !== 'selectPlan' && !newSubscriber"
          @click="stepBackward">
          Back
        </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import { GET_STRIPE_MEMBERSHIP } from '@/store/actionTypes';
import { TOGGLE_CHANGE_PLAN_MODAL } from '@/store/mutationTypes';
import ChangeCardForm from '@/components/forms/ChangeCardForm';
import SelectPlanBlock from '@/components/blocks/SelectPlanBlock';
import ConfirmPlanBlock from '@/components/blocks/ConfirmPlanBlock';
import { setTimeout } from 'timers';

export default {
  components: { ChangeCardForm, SelectPlanBlock, ConfirmPlanBlock },
  name: 'ChangePlansModal',
  computed: {
    noCreditCard() {
      return !this.$store.state.payment.membership.hasCard;
    },
    showDialogModal: {
      get() {
        return this.$store.state.payment.changePlanVisible;
      },
      set() {
        // calling this.data() should reset the form
        this.$store.dispatch(GET_STRIPE_MEMBERSHIP);
        this.$store.commit(TOGGLE_CHANGE_PLAN_MODAL);
        setTimeout(this.reset, 200);
      },
    },
    stepName() {
      let name;
      switch (this.step) {
        case 2:
          name = (this.noCreditCard && this.selectedPlan !== 'enterprise') ?
            'enterCard' : 'confirmPlan';
          break;
        case 3:
          name = 'confirmPlan';
          break;
        default:
          // selectPlan
          name = 'selectPlan';
          break;
      }
      return name;
    },
  },
  data() {
    return {
      selectedPlan: '',
      step: 1,
      saveNow: false,
      invalidForm: true,
      savingCard: false,
      triggerSubscribe: false,
      newSubscriber: false,
    };
  },
  methods: {
    stepForward() {
      this.step = Math.min(this.step + 1, this.noCreditCard ? 3 : 2);
    },
    stepBackward() {
      this.step = Math.max(this.step - 1, 1);
    },
    reset() {
      Object.assign(this, {
        selectedPlan: '',
        step: 1,
        saveNow: false,
        invalidForm: true,
        savingCard: false,
        triggerSubscribe: false,
        newSubscriber: false,
      });
    },
  },
};
</script>

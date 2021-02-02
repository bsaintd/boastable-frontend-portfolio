<template>
  <basic-page-layout>
    <template slot="page-title">Answers</template>
    <template slot="page-content">
      <!-- TEMP titlebar PLACEHOLDER -->
      <div class="blue-titlebar pa-2 elevation-1">
        <h3>Survey Responses</h3>
      </div>
      <!-- NOTE! filter for customer feedback/answers below
      is non-functional and commented out -->
      <!-- <div class="white pa-3 elevation-1">
        <v-layout align-center justify-end row fill-height>
          <v-flex xs5 sm4 md3>
            <v-select
              append-icon="keyboard_arrow_down"
              v-model="defaultFilter"
              :items="feedbackFilters"
              outline
              single-line>
            </v-select>
          </v-flex>
        </v-layout>
      </div> -->
      <div
        class="white pa-3 mb-3 elevation-1"
        v-if="surveys.length === 0">
        <v-layout
          align-center
          justify-center
          row
          fill-height>
          <v-flex text-xs-right pr-3>
            <v-icon
              x-large
              class="context-color">
              sentiment_dissatisfied
            </v-icon>
          </v-flex>
          <v-flex  text-xs-left>
            <span class="context-color">
              No surveys have been answered yet!
            </span>
          </v-flex>
        </v-layout>
      </div>
      <v-expansion-panel>
        <v-expansion-panel-content
          v-if="surveys.length > 0"
          v-for="(survey,index) of surveys"
          :key="index">
          <div slot="header">
            <v-layout align-center justify-center row fill-height>
              <v-flex xs4 sm3>
                {{survey.created_at | moment("MM/DD/YY")}}
              </v-flex>
              <v-flex xs4 sm3>
                <span>
                  {{getStatus(survey)}}
                </span>
              </v-flex>
              <v-flex hidden-xs-only sm3 text-xs-center>
                {{ contactMethod(survey, 'data') }}
              </v-flex>
              <v-flex xs4 sm3 text-xs-center>
                <v-icon
                  v-if="getStatus(survey) !== 'Sent'"
                  v-bind:class="thumbsUpColor(survey)">
                  {{sentimentCalc(survey.answers)}}
                </v-icon>
              </v-flex>
            </v-layout>
          </div>
          <v-card>
            <v-card-text>
              <!-- INSERT "ASSOCIATED TEAM MEMBER image and info here
              AFTER the Team functionality has been added to the app -->
              <v-container justify-start>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <h3 class="pb-2">Feedback Questions/Answers</h3>
                    <div v-bind:key="index" v-for="(answer, index) in survey.answers">
                      <v-layout justify-start class="pr-4">
                        <p class="context-color">
                          <span class="font-weight-bold">Q{{index + 1}}</span>
                          <br>
                          <span v-if="answer.value !== undefined" class="font-weight-bold">A</span>
                        </p>
                        <p class="context-color pl-2">
                          {{answer.question.question}}
                          <br>
                          <span v-if="answer.value !== undefined" class="font-weight-bold">
                            <span
                              v-if="answer.value === true"
                              class="success-color font-weight-regular">
                              Yes
                            </span>
                            <span
                              v-if="answer.value === false"
                              class="error-color font-weight-regular">
                              No
                            </span>
                          </span>
                        </p>
                      </v-layout>
                    </div>
                  </v-flex>
                  <v-flex xs12 md6>
                    <h3 class="pb-2">Customer Message</h3>
                    <p
                      class="context-color">
                      <!-- NOTICE! survey.message is not currently part of survey data model!-->
                      <span v-if="survey.customer_message">"{{ survey.customer_message }}"</span>
                      <span v-if="!survey.customer_message">N/A</span>
                    </p>
                    <!-- NOTICE! survey.request_response is
                    not currently part of survey data model!-->
                    <!-- Need to add v-if below to v-layout below that
                    after data model has been updated. -->
                    <!-- v-if="survey.request_response === true" -->
                    <v-flex text-xs-center text-sm-left>
                      <v-btn
                        v-if="contactMethod(survey, 'type') === 'phone'"
                        v-bind:href="buildContactLink(survey, 'phone')"
                        large
                        round
                        outline
                        class="primary-color">
                        <v-icon class="pr-2"> phone </v-icon>
                        Contact Customer
                      </v-btn>
                      <v-btn
                        v-if="contactMethod(survey, 'type') === 'email'"
                        v-bind:href="buildContactLink(survey, 'email')"
                        large
                        round
                        outline
                        class="primary-color">
                        <v-icon class="pr-2"> email </v-icon>
                        Contact Customer
                      </v-btn>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template> <!-- end of page-content slot -->
  </basic-page-layout>
</template>

<script>
import BasicPageLayout from '@/components/layouts/BasicPageLayout';
import { LIST_SURVEYS } from '@/store/actionTypes';
import { formatNumber } from 'libphonenumber-js';

export default {
  name: 'CustomerFeedback',
  components: {
    BasicPageLayout,
  },
  data() {
    return {
      defaultFilter: 'Most Recent',
      feedbackFilters: ['Most Recent', 'Positive', 'Negative'],
    };
  },
  created() {
    this.$store.dispatch(LIST_SURVEYS);
  },
  computed: {
    surveys() {
      return this.$store.getters.getSurveys;
    },
  },
  methods: {
    // determine and set the completion status of a survey
    getStatus(survey) {
      let surveyStatus = 'Sent';
      let hasAnyAnswers = false;
      let hasAllAnswers = true;
      survey.answers.map((answer) => {
        if (answer.value === undefined) {
          hasAllAnswers = false;
        } else {
          hasAnyAnswers = true;
        }
        return answer.value;
      });
      if (hasAllAnswers) {
        surveyStatus = 'Complete';
      } else if (hasAnyAnswers) {
        surveyStatus = 'Started';
      }
      return surveyStatus;
    },
    // sets the css color class to the icon based on the sentiment of a survey
    thumbsUpColor(survey) {
      const sentiment = this.sentimentCalc(survey.answers);
      let thumbColor;
      if (sentiment === 'thumb_up') {
        thumbColor = 'primary-color';
      } else if (sentiment === 'thumb_down') {
        thumbColor = 'secondary-color';
      }
      return thumbColor;
    },
    // determines the general sentiment of a survey
    // based on positive responses vs. negative responses
    sentimentCalc(answers) {
      const tally = answers.reduce((total, answer) => {
        if (typeof answer.value === 'boolean') {
          if (answer.value === true) {
            return total + 1;
          } else if (answer.value === false) {
            return total - 1;
          }
        }
        return total;
      }, 0);
      let sentiment = '';
      if (tally >= 0) {
        sentiment = 'thumb_up';
      } else if (tally < 0) {
        sentiment = 'thumb_down';
      }
      return sentiment;
    },
    // determine the contact method used and return result for display
    contactMethod(survey, whatToReturn) {
      const email = survey.customer.email;
      const phone = survey.customer.phone;
      let contactMedium;
      if (phone) {
        if (whatToReturn === 'data') {
          contactMedium = formatNumber(phone, 'National');
        } else if (whatToReturn === 'type') {
          contactMedium = 'phone';
        }
      } else if (email && !phone) {
        if (whatToReturn === 'data') {
          contactMedium = email;
        } else if (whatToReturn === 'type') {
          contactMedium = 'email';
        }
      }
      return contactMedium;
    },
    // determine contact medium, phone or email
    // and build link formatting based on type
    buildContactLink(survey, contactMedium) {
      const email = survey.customer.email;
      const phone = survey.customer.phone;
      let contactLink;
      if (contactMedium === 'phone') {
        contactLink = `tel:${phone}`;
      } else if (contactMedium === 'email') {
        contactLink = `mailto:${email}`;
      }
      return contactLink;
    },
  },
};
</script>

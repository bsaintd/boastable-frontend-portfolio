<template>
  <basic-page-layout>
    <template slot="page-title">Dashboard</template>
    <template slot="page-content">
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <!-- bar graph analytics -->
          <section class="px-3">
            <div class="blue-titlebar pa-2 elevation-1">
              <h3>Survey Funnel</h3>
            </div>
            <div class="white pa-3 mb-3 elevation-1 analytics-row">
              <bar
                v-if="showGraphs"
                class="ma-3 analytics-box"/>
              <div v-else-if="!showGraphs" class="pa-3 text-xs-center">
                No data available yet.
              </div>
            </div>
          </section>
        </v-flex>
        <v-flex xs12 sm6>
          <!-- clicks per platform metrics -->
          <section class="px-3">
            <div class="blue-titlebar pa-2 elevation-1">
              <h3>Clicks per platform</h3>
            </div>
            <div class="white px-3 mb-3 elevation-1 analytics-row">
              <v-layout align-center justify-center row fill-height>
                <v-flex xs6 class="text-xs-center">
                  <v-img
                    max-height="120px"
                    position="center center"
                    src="/static/google-reviews-logo.png"
                    contain>
                  </v-img>
                  <h3 class="count text-xs-center">{{googleReviewClicks}}</h3>
                </v-flex>
                <v-flex xs6 class="text-xs-center">
                  <v-img
                    max-height="120px"
                    position="center center"
                    src="/static/yelp-reviews.png"
                    contain>
                  </v-img>
                  <h3 class="count text-xs-center">{{yelpReviewClicks}}</h3>
                </v-flex>
              </v-layout>
            </div>
          </section>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <section class="px-3">
            <div class="blue-titlebar pa-2 elevation-1">
              <h3>Survey Metrics</h3>
            </div>
            <div class="white elevation-1 questions">
              <v-layout row align-center justify-center fill-height wrap>
                <v-flex xs12 >
                  <v-data-table
                    :headers="headers"
                    :items="questions"
                    hide-actions>
                    <template slot="items" slot-scope="props">
                      <td class="text-truncate question-text font-weight-light"
                       style="max-width: 350px;">
                        {{ props.item.question }}
                      </td>
                      <td>{{props.item.upvotes}}</td>
                      <td style="max-width: 300px;">
                        <v-progress-linear
                          background-color="secondary"
                          color="primary"
                          :value="sentimentMeter(props.item.upvotes,props.item.downvotes)"
                        ></v-progress-linear>
                      </td>
                      <td>{{props.item.downvotes}}</td>
                      <!-- <td class="text-xs-right">{{ props.item.upvotes }}</td> -->
                      <!-- <td class="text-xs-right">{{ props.item.downvotes }}</td> -->
                    </template>
                  </v-data-table>
                </v-flex>
                <!-- <v-flex xs12 md6>
                  <h3 class="text-xs-center subtitle">Answer Summary</h3>
                  <v-layout mb-3 class="questions" justify-center>
                    <doughnut
                      v-if="showGraphs"
                      :upvotes="totalUpVotes"
                      :downvotes="totalDownVotes"/>
                  </v-layout>
                </v-flex> -->
              </v-layout>
            </div>
          </section>
        </v-flex>
      </v-layout>
      <!-- pop-up reminder to set Google Place ID -->
      <google-place-id-dialog
        :showDialog="showPlaceIdDialog"
        @close="showPlaceIdDialog = $event"/>
    </template> <!-- end of page-content slot -->
  </basic-page-layout>
</template>

<script>
import { LIST_QUESTIONS, LIST_SURVEYS, LIST_ACTIONS, GET_ACCOUNT } from '@/store/actionTypes';
import BasicPageLayout from '@/components/layouts/BasicPageLayout';
import GooglePlaceIdDialog from '@/components/global/GooglePlaceIdDialog';
import LineChart from '@/components/LineChart';
import Bar from '@/components/BarChart';
import Doughnut from '@/components/DoughnutChart';

export default {
  name: 'Dashboard',
  components: {
    BasicPageLayout,
    GooglePlaceIdDialog,
    LineChart,
    Doughnut,
    Bar,
  },
  data() {
    return {
      showPlaceIdDialog: false,
      showGraphs: false,
      headers: [
        {
          text: 'Question',
          align: 'left',
          sortable: false,
          value: 'content',
        },
        { text: 'Yes', align: 'center', sortable: false },
        { text: 'Sentiment', align: 'center', sortable: false },
        { text: 'No', align: 'center', sortable: false },
      ],
      upvotes: [],
    };
  },
  created() {
    this.$store.dispatch(GET_ACCOUNT)
      .then((data) => {
        if (!data.google_place_id && !data.hide_place_id_reminder) {
          this.showPlaceIdDialog = true;
        }
      });
    this.$store.dispatch(LIST_QUESTIONS);
    const gotSurveys = this.$store.dispatch(LIST_SURVEYS);
    const gotActions = this.$store.dispatch(LIST_ACTIONS);
    Promise.all([gotSurveys, gotActions])
      .then(([surveys, actions]) => {
        if (surveys.length && actions.length) {
          this.showGraphs = true;
        }
      });
  },
  computed: {
    questions() {
      return this.$store.getters.getListOfQuestions;
    },
    totalVotes() {
      return this.questions
        .reduce((total, question) => total + question.upvotes + question.downvotes, 0);
    },
    totalUpVotes() {
      return this.questions.reduce((total, question) => total + question.upvotes, 0);
    },
    totalDownVotes() {
      return this.questions.reduce((total, question) => total + question.downvotes, 0);
    },
    googleReviewClicks() {
      return this.$store.state.actions.google_reviews;
    },
    yelpReviewClicks() {
      return this.$store.state.actions.yelp_clicks;
    },
    allReviewClicks() {
      return this.googleReviewClicks + this.yelpReviewClicks;
    },
  },
  methods: {
    sentimentMeter(upvotes, downvotes) {
      return (100 * upvotes) / (upvotes + downvotes);
    },
  },
};
</script>

<style scoped lang="scss">
.analytics-row {
  height: 310px;
}
.analytics-box {
  max-height:250px;
  min-height:200px;
}
.subtitle {
  font-size:20px;
}
.left-border-line {
  border-left:1px solid #ccc;
  height:100%;
}
.count {
  font-size:36px;
  font-weight:bold;
}
.questions {
  h1, h5 {
    color: white;
  }
  font-weight: bold;
  text-align: center;
}
.question-text{
  max-width: 300px;
}
.gear {
  border:5px dashed black;
  margin:0 auto;
  width:15%;
  border-radius:100em;
  overflow:hidden;
}
</style>

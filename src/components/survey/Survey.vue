<template>
  <v-content>
    <v-layout
      xs12
      fill-height
      justify-center
      column
      class="survey-base"
      :style="`background-image: url('${backgroundImage}')`">
      <div class="survey-header text-xs-center">
        <h1 class="pt-4">{{company.company_name}}</h1>
        <h2>Customer Feedback</h2>
      </div>

      <vue-swing
        @throwoutleft="no"
        @throwoutright="yes"
        @throwout="handleThrow"
        @dragmove="testDrag"
        @throwinend="resetYesNo"
        :config="config"
        ref="vueswing">
        <!-- customer feedback card -->
        <v-card
          id="feedback-card"
          v-if="settings.ownerFeedback || answers.length > 0"
          class="survey-card feedback"
          :class="{
            active: currentId === 'feedback-card'
          }">
          <v-card-text class="text-xs-center">
            <v-layout align-center justify-center column fill-height>
              <v-flex xs12>
                <h3 class="info-color question-text">
                  Any feedback for us?
                </h3>
              </v-flex>
              <v-flex xs12 mt-3 class="feedback-flex">
                <v-form ref="form"
                  lazy-validation>
                  <v-textarea
                    solo
                    v-model="feedback"
                    placeholder="Enter Message"
                    rows=5
                    @focus="showSkipButton = false"
                    @blur="showSkipButton = true"
                  >
                  </v-textarea>
                </v-form>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
        <!-- question cards -->
        <v-card
          class="survey-card question pa-2 text-xs-center"
          v-for="(answer) in answers"
          v-bind:key="answer._id"
          :id="answer._id"
          :class="{
            active: currentId === answer._id
          }">
          <div class="px-2 yes">YES</div>
          <div class="px-2 no">NO</div>
          <v-card-text>
            <v-layout column>
              <v-flex xs12>
                <h3 class="info-color question-text">
                  {{answer.question.question}}
                </h3>
              </v-flex>
              <v-flex xs12 swipe-touch>
                <v-layout
                  row
                  justify-center
                  class="swipe-row">
                  <v-flex class="xs12">
                    <v-icon class="arrows to-the-left">reply</v-icon>
                    <h2>SWIPE</h2>
                    <v-icon class="arrows to-the-right">reply</v-icon>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-card
          id="intro-card"
          xs12
          v-if="answers.length"
          class="pa-2 intro-card elevation-0"
          :class="{
            active: this.currentId === 'intro-card'
          }">
          <intro-card
            :isDemo="isDemo"
            :introduction="settings.introduction"
          />
        </v-card>
      </vue-swing>

      <final-card
        :isDemo="isDemo"
        :currentId="this.currentId"
        :placeId="company.google_place_id"
      />

      <v-layout v-if="currentId === 'intro-card'" class="send-feedback-row" column justify-center>
        <v-btn
          outline
          round
          large
          color="info"
          @click="closeIntro"
          class="px-3 intro-btn">
          Swipe or Click to Continue
        </v-btn>
      </v-layout>

      <v-layout v-if="isQuestion" class="mt-2">
        <v-flex class="fab-buttons no text-xs-center">
          <v-btn fab class="elevation-10" @click="clickNo">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
        <v-flex class="fab-buttons yes text-xs-center">
          <v-btn fab class="elevation-10" @click="clickYes">
            <v-icon>check</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout
        v-if="currentId === 'feedback-card' && showSkipButton"
        class="send-feedback-row"
        row
        justify-center >
        <v-flex xs6 class="text-xs-center">
          <v-btn
            round
            outline
            large
            color="info"
            @click="skipFeedback"
            class="px-3 intro-btn">
            Skip this part
          </v-btn>
        </v-flex>
        <v-flex xs6 class="text-xs-center">
          <v-btn
            round
            large
            @click="sendFeedback"
            class="px-3 intro-btn">
            Send Feedback
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout align-end justify-center row>
        <v-flex
          xs12
          text-xs-center
          class="card-footer">
          <span class="btyb-text">brought to you by</span>
          <img
            src="/static/Boastable_Logo_Survey_Footer.png"
            alt="Boastable">
        </v-flex>
      </v-layout>

    </v-layout>
  </v-content>
</template>

<script>
import _ from 'lodash';
import {
  GET_SURVEY,
  ANSWER_YES,
  ANSWER_NO,
  TRACK_ACTION,
  SEND_FEEDBACK,
} from '@/store/actionTypes';
import VueSwing from 'vue-swing';
import FinalCard from '@/components/survey/cards/FinalCard';
import IntroCard from '@/components/survey/cards/IntroCard';

export default {
  components: { VueSwing, FinalCard, IntroCard },
  created() {
    this.$store.dispatch(GET_SURVEY, this.$route.params.shortid)
      .then((survey) => {
        this.action('OPEN_SURVEY');
        if (survey.settings.backgroundImage) {
          this.backgroundImage = survey.settings.backgroundImage;
        }
      });
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    answers() {
      const answers = this.$store.getters.getAnswers || [];
      return answers.filter(({ value }) => value === undefined);
    },
    customerId() {
      return this.$store.getters.getCustomerId;
    },
    settings() {
      return this.$store.state.survey.settings;
    },
    company() {
      return this.$store.state.survey.company;
    },
    survey() {
      return this.$store.state.survey.survey;
    },
    isDemo() {
      return this.$store.state.survey.survey.demo;
    },
    cardElementsLength() {
      return this.cardElements.length;
    },
    currentCardElement() {
      return _.get(this, `cardElements[${this.currentCardIndex}].$el`, null);
    },
    currentId() {
      return _.get(this, 'currentCardElement.id', 'final-card');
    },
    nextId() {
      return _.get(this, 'nextCardElement.id', 'final-card');
    },
    nextCardElement() {
      return _.get(this, `cardElements[${this.currentCardIndex - 1}].$el`, null);
    },
    currentCard() {
      return _.get(this, `cards[${this.currentCardIndex}]`, null);
    },
    isQuestion() {
      return (this.currentCardElement) ?
        this.currentCardElement.classList.contains('question') : false;
    },
    currentCardIndex() {
      return this.cardElementsLength - this.throwCount - 1;
    },
  },
  data() {
    return {
      showSkipButton: true,
      backgroundImage: '/static/mobile-survey-bg.jpg',
      cardElements: [],
      cards: [],
      config: {
        allowedDirections: [
          VueSwing.Direction.LEFT,
          VueSwing.Direction.RIGHT,
        ],
        throwOutDistance: () => 500,
        throwOutConfidence: (xOffset, yOffset, element) => {
          const xConfidence = Math.min((Math.abs(xOffset) * 3) / element.offsetWidth, 1);
          return xConfidence;
        },
      },
      test: 'nothing',
      lastDirection: 'none',
      feedback: '',
      throwCount: 0,
    };
  },
  mounted() {
    this.cardElements = this.$refs.vueswing.$children;
    this.cards = this.$refs.vueswing.cards;
  },
  methods: {
    testDrag({ offset, target, throwOutConfidence }) {
      if (offset > 1 && target.querySelector('div.yes')) {
        // eslint-disable-next-line
        target.querySelector('div.yes').style.opacity = throwOutConfidence;
      }
      if (offset < -1 && target.querySelector('div.no')) {
        // eslint-disable-next-line
        target.querySelector('div.no').style.opacity = throwOutConfidence;
      }
    },
    resetYesNo({ target }) {
      if (target.querySelector('div.yes')) {
        // eslint-disable-next-line
        target.querySelector('div.yes').style.opacity = 0;
      }
      if (target.querySelector('div.no')) {
        // eslint-disable-next-line
        target.querySelector('div.no').style.opacity = 0;
      }
    },
    handleThrow({ target }) {
      /* Delayed action to destroy thrown out current question card */
      setTimeout(() => {
        this.$refs.vueswing.stack.getCard(target).destroy();
        // eslint-disable-next-line
        target.style.display = 'none';
      }, 150);
      this.throwCount += 1;
      // when clients don't want written feedback, discard the feedback card here
      if (this.currentId === 'feedback-card' && !this.settings.ownerFeedback) {
        this.skipFeedback();
      }
    },
    skipFeedback() {
      const feedbackCard = this.cards[0];
      feedbackCard.throwOut(250, Math.random() * 50, VueSwing.Direction.RIGHT);
    },
    sendFeedback() {
      this.$store.dispatch(SEND_FEEDBACK, this.feedback)
        .then(() => {
          this.feedback = '';
          this.skipFeedback();
        });
    },
    closeIntro() {
      /* Manually defining Intro card because
      it is intentionally discluded in computed methods
      for data collection purposes.
      THIS allows for Intro Card to be thrown out
      by clicking button below the Intro Card. */
      const introCard = this.cards[this.cards.length - 1];
      introCard.throwOut(250, Math.random() * 50, VueSwing.Direction.RIGHT);
    },
    clickYes() {
      this.currentCard.throwOut(250, Math.random() * 50, VueSwing.Direction.RIGHT);
    },
    clickNo() {
      this.currentCard.throwOut(250, Math.random() * 50, VueSwing.Direction.LEFT);
    },
    yes({ target }) {
      if (target.id.length === 24 && !this.survey.test) {
        this.$store.dispatch(ANSWER_YES, target.id);
      }
    },
    no({ target }) {
      if (target.id.length === 24 && !this.survey.test) {
        this.$store.dispatch(ANSWER_NO, target.id);
      }
    },
    action(type) {
      if (!this.survey.test) {
        this.$store.dispatch(TRACK_ACTION, type);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.survey-base {
  color: #fff;
  width: 100%;
  max-width:500px;
  height: 100%;
  position: fixed;
  background-image:url('/static/mobile-survey-bg.jpg');
  background-size: cover;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;

  .survey-header {
    h1,h2 {
      color: #e4e4e4;
      text-transform: uppercase;
    }
    h1 {
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -.5px;
      line-height: .8;
    }
    h2 {
      font-size: 15px;
      font-weight: 100;
    }
  } // end .survey-header

  .swipe-touch {
    position: absolute;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  .intro-card {
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 15%;
    left: 8%;
    right: 8%;
    min-height: 250px;
    border-radius: 8px;
    background-color: transparent;
    display: flex;
    opacity: 0;
    z-index: -10;

    &.active {
      opacity: 1;
      z-index: 10;
    }

    h2 {
      font-size: 2em;
      line-height: 1;
    }

    p {
      font-size: 1.2em;
      line-height: 1.2;
    }

    .swipe-touch {
      bottom: -12.5em;
      padding-bottom: 12em;
    }
  } // end .intro-card

  .survey-card {
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 20%;
    left: 5%;
    right: 5%;
    min-height: 250px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    opacity: 0;
    z-index: -10;

    &.active {
      opacity: 1;
      z-index: 10;
    }

    &.feedback {
      .feedback-flex {
        width: 100%;
      }
    }

    .question-text {
      font-size: 1.5em;
      font-weight: 300;
    }

    .yes, .no {
      position: absolute;
      opacity: 0;
      top: 0;
      font-size: 2em;
      font-weight: 700;
    }

    .yes {
      left: 0;
      color: #0054a6;
      color: rgba(0, 83, 166, 0.55);
    }

    .no {
      right: 0;
      color: #790000;
      color: rgba(121, 0, 0, 0.55);
    }

    .swipe-touch {
      bottom: -14.5em;
      padding-bottom: 12em;
    }
  } // end .survey-card

  /deep/ .final-review-invite {
    position:absolute;
    top: 50%;
    left: 50%;
    width: 70%;
    transform: translate(-50%, -50%);
    opacity: 0;
    z-index: -10;

    &.active {
      opacity: 1;
      z-index: 10;
    }

    .review-options {
      margin-top: 8em;
    }

    h2 {
      font-size: 2em;
      line-height: 1;
    }
    p {
      font-size:1.5em;
    }
  } // end .final-review-invite

  /deep/ .swipe-row {
    h2 {
      display: inline;
      color: #acacac;
      text-align: center;
      font-size: 18px;
    }

    .arrows {
      color: #acacac;
      margin-bottom: -8px;
      font-size: 36px;

      &.to-the-right {
        -moz-transform: scaleX(-1);
        -o-transform: scaleX(-1);
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
      }
    }
  } // end .swipe-row

  .exit-survey {
    width: unset;
  }

  .intro-btn {
    border-width: 2px;
  }

  .send-feedback-row {
    position:absolute;
    bottom: 8vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .fab-buttons {
    position: absolute;
    bottom: 7vh;
    z-index: 10;

    .v-btn {
      color: #fff;
      height: 60px;
      width: 60px;

      .v-icon {
        font-size: 48px;
        font-weight: 700;
      }
    }

    &.no {
      left: 20%;

      .v-btn {
        background-color: #ee6d58;
      }
    }

    &.yes {
      right: 20%;

      .v-btn {
        background-color: #70aed8;
      }
    }
  } // end .fab-buttons

  /deep/ .review-button {
    border-radius:25px;
    height:50px;
    width:100%;
    background-color:white !important;

    &.yelp {
      img {
        margin-bottom: 6px;
      }
    }
  }

  .card-footer {
    padding-bottom: 3px;
    margin-right: 80px;

    .btyb-text {
      display: inline-block;
      color: #acacac;
      font-size: 10px;
      font-weight: 300;
    }

    img {
      margin-bottom: -3px;
      width: 80px;
    }
  } // end .card-footer

  @media screen and (min-width: 375px) {
    .intro-card {
      top: 18%;
      left: 6%;
      right: 6%;

      .swipe-touch {
        bottom: -16em;
        padding-bottom: 16em;
      }
    }

    .survey-card {
      top: 20%;
      left: 6%;
      right: 6%;

      .swipe-touch {
        bottom: -18em;
        padding-bottom: 15em;
      }
    }

    .swipe-row {
      h2 {
        font-size: 24px;
      }

      .arrows {
        margin-bottom: -4px;
      }
    }

    .send-feedback-row {
      bottom: 10vh;
    }

    .fab-buttons {
      bottom: 10vh;

      .v-btn {
        height: 70px;
        width: 70px;

        .v-icon {
          font-size: 54px;
        }
      }

      &.no {
        left: 21%;
      }

      &.yes {
        right: 21%;
      }
    } // end .fab-buttons
  } // end media query min-width: 375px
  @media screen and (min-width: 401px) {
    .survey-header {
      h1 {
        font-size: 35px;
        letter-spacing: -.5px;
        line-height: .8;
      }
      h2 {
        font-size: 18px;
      }
    } // end .survey-header

    .intro-card {
      top: 20%;

      h2 {
        font-size: 2.5em;
      }

      p {
        font-size: 1.5em;
      }

      .swipe-touch {
        bottom: -16em;
        padding-bottom: 15em;
      }
    }

    .swipe-row {
      h2 {
        font-size: 30px;
      }

      .arrows {
        font-size: 40px;
      }
    }

    .survey-card {
      min-height: 300px;

      .question-text {
        font-size: 1.8em;
      }

      .swipe-touch {
        bottom: -19em;
        padding-bottom: 15em;
      }
    }

    .fab-buttons {
      bottom: 9vh;

      .v-btn {
        height: 80px;
        width: 80px;

        .v-icon {
          font-size: 64px;
        }
      }
    } // end .fab-buttons
    .send-feedback-row {
      .v-btn.send-feedback-btn {
        height: 70px;
        width: 70px;

        .v-icon {
          font-size: 40px;
        }
      }
      .cancel-feedback-txt {
        font-size: 20px;
      }
    }
  } // end media query min-width: 401px
} // end .survey-base
</style>

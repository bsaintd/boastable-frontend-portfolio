<template>
  <basic-page-layout>
    <template slot="page-title">Survey Setup</template>
    <template slot="page-content">
      <v-layout row wrap>
        <v-flex xs12 md6>
          <!-- questions configuration -->
          <section class="px-3">
            <div class="blue-titlebar pa-2 elevation-1">
              <h3>Questions</h3>
            </div>
            <div class="white pa-3 mb-3 elevation-1">
              <p class="context-color pb-4">
                <small>
                  To make the most of Boastable, we suggest asking
                  "Yes" or "No" questions where the answers would
                  help you make decisions about your product offering.
                </small>
              </p>
              <questions-mgmt/>
              <v-btn
                class="mt-4"
                depressed
                @click="testSurvey()">
                Preview Customer Survey
              </v-btn>
              <div id="overlay" @click="surveyPreviewOff()"></div>
              <div id="preview-modal">
                <v-btn
                  id="close-btn"
                  @click="surveyPreviewOff()"
                  small
                  dark
                  fab
                  color="secondary">
                  <v-icon>close</v-icon>
                </v-btn>
                <iframe id="preview-survey" @load="surveyPreviewStyle"></iframe>
              </div>
            </div>
          </section>
          <!-- Google Place ID Selection -->
          <google-place-id-block/>
          <!-- Accept Written Feedback Selection -->
          <section class="px-3">
            <div class="blue-titlebar pa-2 elevation-1">
              <h3>Accept Written Feedback</h3>
            </div>
            <div class="white pa-3 mb-3 elevation-1">
              <v-checkbox
                label="Do you want to allow written feedback on surveys?"
                v-model="ownerFeedback"
                color="primary"
                class="font-weight-regular">
              </v-checkbox>
              <div class="px-4 context-color">
                <p>
                  <small>
                    ** By selecting this option, you consent to providing your
                     customer an opportunity to explain an issue with your service, and
                     whether or not they would like to be contacted by you, the
                      business. By selecting this option, you will receive a
                     notification when a customer has submitted a complaint. <br>
                    * If left unselected, any customer who chooses to leave a negative
                    response will receive this default message:
                    "Thank you for your feedback."
                  </small>
                </p>
              </div>
            </div>
          </section>
        </v-flex>
        <v-flex xs12 md6>
          <!-- Intro Greeting Selection -->
          <section class="px-3">
            <div class="blue-titlebar pa-2 elevation-1">
              <h3>Intro Greeting</h3>
            </div>
            <div class="white pa-3 mb-3 elevation-1">
              <choose-intro-greeting
                :introduction="introduction"
                @updateGreeting="introduction = $event"/>
            </div>
          </section>
          <block-container title="Choose Background Image">
            <choose-survey-background
              :src="backgroundImage"
              @update="backgroundImage = $event"/>
          </block-container>
          <block-container title="Custom Action Link">
            <custom-link/>
          </block-container>
        </v-flex>
      </v-layout>
    </template> <!-- end of page-content slot -->
  </basic-page-layout>
</template>

<script>
import { GET_SURVEY_TEMPLATE, UPDATE_SURVEY_TEMPLATE, TEST_SURVEY } from '@/store/actionTypes';
import BasicPageLayout from '@/components/layouts/BasicPageLayout';
import ChooseIntroGreeting from '@/components/survey-setup/blocks/ChooseIntroGreeting';
import ChooseSurveyBackground from '@/components/survey-setup/blocks/ChooseSurveyBackground';
import GooglePlaceIdBlock from '@/components/shared/GooglePlaceIdBlock';
import QuestionsMgmt from '@/components/survey-setup/blocks/QuestionsMgmt';
import CustomLink from '@/components/survey-setup/blocks/CustomLink';
import BlockContainer from '@/components/survey-setup/blocks/BlockContainer';

export default {
  name: 'SurveySetup',
  components: {
    BasicPageLayout,
    ChooseIntroGreeting,
    ChooseSurveyBackground,
    GooglePlaceIdBlock,
    QuestionsMgmt,
    BlockContainer,
    CustomLink,
  },
  computed: {
    introduction: {
      get() {
        const intro = this.$store.state.survey.settings.introduction;
        return intro;
      },
      set(val) {
        const introduction = val;
        const current = this.introduction;
        const existsAndDifferent = val && current !== val;
        if (existsAndDifferent) {
          this.$store.dispatch(UPDATE_SURVEY_TEMPLATE, {
            introduction,
          });
        }
      },
    },
    linkText: {
      get() {
        const val = this.$store.state.survey.settings.custom.text;
        return val;
      },
      set(val) {
        const text = val;
        const current = this.linkText;
        const existsAndDifferent = val && current !== val;
        if (existsAndDifferent) {
          this.$store.dispatch(UPDATE_SURVEY_TEMPLATE, {
            custom: { text },
          });
        }
      },
    },
    linkUrl: {
      get() {
        const val = this.$store.state.survey.settings.custom.link;
        return val;
      },
      set(val) {
        const link = val;
        const current = this.linkUrl;
        const existsAndDifferent = val && current !== val;
        if (existsAndDifferent) {
          this.$store.dispatch(UPDATE_SURVEY_TEMPLATE, {
            custom: { link },
          });
        }
      },
    },
    farewell: {
      get() {
        const val = this.$store.state.survey.settings.farewell;
        return val;
      },
      set(val) {
        const farewell = val;
        const current = this.farewell;
        const existsAndDifferent = val && current !== val;
        if (existsAndDifferent) {
          this.$store.dispatch(UPDATE_SURVEY_TEMPLATE, {
            farewell,
          });
        }
      },
    },
    backgroundImage: {
      get() {
        const bg = this.$store.state.survey.settings.backgroundImage;
        return bg;
      },
      set(val) {
        const backgroundImage = val;
        const current = this.backgroundImage;
        const existsAndDifferent = val && current !== val;
        if (existsAndDifferent) {
          this.$store.dispatch(UPDATE_SURVEY_TEMPLATE, {
            backgroundImage,
          });
        }
      },
    },
    ownerFeedback: {
      get() {
        return this.$store.state.survey.settings.ownerFeedback;
      },
      set(val) {
        const ownerFeedback = val;
        const current = this.ownerFeedback;
        const existsAndDifferent =
          (ownerFeedback === true || ownerFeedback === false)
          && current !== val;
        if (existsAndDifferent) {
          this.$store.dispatch(UPDATE_SURVEY_TEMPLATE, {
            ownerFeedback,
          });
        }
      },
    },
  },
  created() {
    this.$store.dispatch(GET_SURVEY_TEMPLATE);
  },
  methods: {
    testSurvey() {
      this.$store.dispatch(TEST_SURVEY, {})
        .then((survey) => {
          const closeBtn = document.getElementById('close-btn');
          const overlay = document.getElementById('overlay');
          const surveyPreview = document.getElementById('preview-survey');
          const modalPreview = document.getElementById('preview-modal');
          surveyPreview.src = `/swipe/${survey.shortid}`;
          modalPreview.style.display = 'block';
          closeBtn.style.display = 'block';
          overlay.style.display = 'block';
        });
    },
    surveyPreviewOff() {
      const closeBtn = document.getElementById('close-btn');
      const overlay = document.getElementById('overlay');
      const modalPreview = document.getElementById('preview-modal');
      modalPreview.style.display = 'none';
      closeBtn.style.display = 'none';
      overlay.style.display = 'none';
    },
    /* adds custom styling to the iframe
    to resolve issue with vuetify set rule:
    html{overflow-y:scroll;}
    that adds scrollbar space to the right if survey
    inside the iframe */
    surveyPreviewStyle() {
      const iframeSurvey = document.getElementById('preview-survey');
      const iframeStyle = document.createElement('style');
      iframeStyle.textContent =
        'html {' +
        '  overflow-y: hidden;' +
        '}';
      iframeSurvey.contentDocument.head.appendChild(iframeStyle);
    },
  },
};
</script>


<style scoped lang="scss">
#preview-modal {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;

  #close-btn {
    position: absolute;
    display: none;
    top: 5px;
    right: 0px;
    color:#fff;
  }

  #preview-survey {
    border: 0;
    height: 100vh;
    width: 100vw;
  }
}
#overlay {
    position: fixed;
    display: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #212121;
    opacity: .46;
    z-index: 2;
    cursor: default;
}
@media screen and (min-width: 501px) and (orientation: portrait) {
  #preview-modal {
    #preview-survey {
      border: 0;
      height: 90vh;
      width: unset;
      min-width: 60vw;
    }
    #close-btn {
      top: -26px;
      right: -28px;
    }
  }
}
@media screen and (min-height: 768px) and (min-width: 768px) {
  #preview-modal {
    #preview-survey {
      min-width: unset;
      background-size: 100% 100%;
      background-image: url(/static/iPhone-7-boastable-survey-preview-frame.png);
      background-position: center;
      height: 758px;
      width: 360px;
      padding:  83px 20px 85px 20px;
    }
    #close-btn {
      top: 11px;
      right: 15px;
    }
  }
}
</style>

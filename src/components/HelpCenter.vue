<!--
Component Name: HelpCenter
Description : HelpCenter included the FAQs and ability to send feedback to
application owner from the users
-->
<template>
  <basic-page-layout>
    <template slot="page-title">Help Center</template>
    <template slot="page-content">
      <section class="px-3">
          <div class="blue-titlebar pa-2 elevation-1">
            <h3>FAQs</h3>
          </div>
          <div class="white mb-3">
            <v-expansion-panel>
                <v-expansion-panel-content
                v-for="(faq,i) in faqs"
                :key="i"
                >
                <div slot="header">
                  {{faq.question}}
                </div>
                <v-card>
                    <v-card-text>
                      {{faq.answer}}
                    </v-card-text>
                </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
      </section>
      <section class="px-3">
        <div class="blue-titlebar pa-2 elevation-1">
          <h3>Submit Feedback</h3>
        </div>
        <v-layout column class="white pt-3 pb-5 px-5 mb-3 elevation-1">
          <v-flex xs12 md6>

            <v-form ref="form"
              lazy-validation>
              <v-textarea
              name="comments"
              auto-grow
              rows=1
              v-model="comments"
              label="Questions, Comments, or Concerns"
              required></v-textarea>
              <v-btn
                name="send-comments"
                :disabled="!comments"
                class="primary"
                depressed
                @click="submit">
                submit
              </v-btn>
              <v-btn
                v-if="comments"
                name="clear-comments"
                depressed
                :disabled="!comments"
                @click="clear">
                clear
              </v-btn>
            </v-form>
          </v-flex>
          <v-flex xs12 md6>
            <p class="pt-3">We're all about making feedback easy, obviously.&nbsp;
              If you have ideas for features you'd like to see,&nbsp;
              something that's frustrating you about the Boastable interface,&nbsp;
              or just some part of the service that doesn't make sense, reach out&nbsp;
              and we'll see what we can do.&nbsp;
              This little form goes right to the coders who make Boastable better everyday.</p>
          </v-flex>
        </v-layout>
      </section>
      <legal-links-block/>
    </template> <!-- end of page-content slot -->
  </basic-page-layout>
</template>
<script>
import { SEND_COMMENT } from '@/store/actionTypes';
import BasicPageLayout from '@/components/layouts/BasicPageLayout';
import LegalLinksBlock from '@/components/blocks/LegalLinksBlock';

export default {
  name: 'HelpCenter',
  components: {
    BasicPageLayout,
    LegalLinksBlock,
  },
  data() {
    return {
      comments: '',
      faqs: [
        {
          question: 'Why do the custom questions have to be in the "yes" or "no" format?',
          // eslint-disable-next-line
          answer: 'The majority of feedback surveys that consumers take are too long \
          and confusing. Oftentimes they don\'t get completed at all! Questions that \
           yield a "yes" or "no" answer are quick and easy for customers to think \
           about. By simplifying this process, we can increase the likelihood \
          of your business getting more reviews!',
        },
        {
          // eslint-disable-next-line
          question: 'How long does it take to receive feedback after a survey \
          has been sent?',
          // eslint-disable-next-line
          answer: 'As soon as a customer swipes left or right to answer a feedback \
          question, Boastable captures their response and records it for you to \
          see in the application. This means that even if someone decides to exit \
          in the middle of a survey, you will still receive results for the \
          questions they did answer.',
        },
        {
          question: 'How do I send a survey?',
          // eslint-disable-next-line
          answer: 'Before you can send a survey, you must first create your custom \
          feedback questions. You can do that easily under the Survey Setup tab. \
          On the left, you can add as many "yes" or "no" questions you would \
          like your customers to answer. In the Survey Setup tab you should also \
          link your Google Business Profile and ID to Boastable so you can \
          collect reviews on Google. Simply search for the name of your business \
          in the Google ID field and hit “Save”. Once you have completed those \
          steps you can send your survey by either clicking the Send Survey tab \
          on the left, or the airplane icon on the bottom right. A window will \
          open where you can input the phone number and/or email address for \
          your customer. Once satisfied, hit send.',
        },
        {
          question: 'How can I see if my customers are leaving me feedback and reviews?',
          // eslint-disable-next-line
          answer: 'On the Dashboard you can analyze the metrics for your survey \
          funnel. You can see how many surveys were sent, how many were opened, \
          how many were completed, and if they led to a review for your business. \
          The Dashboard also gives you key information like which review platform is \
          most popular amongst your customers, and the overall sentiment of the \
          feedback questions you have in place. Under the Answers tab you will find \
          a comprehensive list of every survey you’ve sent out to customers. \
          This includes the date each was sent, whether it was complete, \
          the phone number or email associated with the customer, their \
          survey results, and whether they left you a private message.',
        },
        {
          question: 'How can I stop bad reviews from going online?',
          // eslint-disable-next-line
          answer: 'The short answer is that you cannot stop bad reviews from going \
          online. However, with Boastable\'s unique system, you can engage \
          with your customers and ask questions to help you grow and improve \
          your business. By doing this and showing your customer you value \
          their voice, they will be less likely to leave you a negative review.',
        },
        {
          question: 'How do I leave feedback for Boastable?',
          // eslint-disable-next-line
          answer: 'In the Help tab, you can leave our team comments, questions, \
          or concerns. We are all about transparency and growing with our \
          customers. Help us provide a better service for you!',
        },
      ],
    };
  },
  methods: {
    submit() {
      this.$store.dispatch(SEND_COMMENT, this.comments)
        .then(() => {
          this.clear();
        });
    },
    clear() {
      this.comments = '';
    },
  },
};
</script>

<style scoped>
</style>

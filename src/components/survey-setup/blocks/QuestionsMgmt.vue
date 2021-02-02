<template>
  <div>
    <div
      v-for="(question, index) of questions"
      :key="index"
      class="q-mgmt">
      <v-form>
        <v-textarea
          :label="`Question ${index+1}`"
          :placeholder="question.question"
          v-model="question.question"
          :disabled="disabled !== index"
          v-on:keyup.13="saveQuestion(question)"
          @keydown.enter.prevent.self
          rows="1"
          auto-grow
          counter
          maxlength="120"
          class="question-field">
        </v-textarea>
        <v-layout justify-end row>
          <v-btn
            @click="toggleEditQuestion(index)"
            v-show="disabled !== index"
            flat
            round
            small
            color="ltprimary"
            class="question-btn ma-0">
            <small>Edit</small>
          </v-btn>
          <v-btn
            @click="saveEditedQuestion(question)"
            v-show="disabled === index"
            flat
            round
            small
            color="ltprimary"
            class="question-btn ma-0">
            <small>Save</small>
          </v-btn>
          <v-btn
            @click="toggleEditQuestion(index)"
            v-show="disabled === index"
            flat
            round
            small
            color="context"
            class="question-btn ma-0">
            <small>Cancel</small>
          </v-btn>
          <v-btn
            @click.stop="deleteQuestionDialog(question)"
            flat
            round
            small
            color="error"
            class="question-btn ma-0">
            <small>Delete</small>
          </v-btn>
        </v-layout>
      </v-form>
    </div>
    <v-dialog v-model="newQuestionDialog" max-width="500px">
      <v-btn
        slot="activator"
        color="secondary"
        dark
        fab
        class="mb-2 secondary-color bg">
        <v-icon>
          add
        </v-icon>
      </v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Add New Question</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <v-textarea
                  v-model="newQuestion"
                  label="Question"
                  maxlength="120"
                  auto-grow
                  rows="1"
                  counter
                  v-on:keyup.13="saveNewQuestion()">
                </v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click="closeNewQuestionDialog()">Cancel</v-btn>
          <v-btn color="primary" flat @click="saveNewQuestion()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <span class="context-color pl-1">Add Question</span>
    <confirm-dialog
      v-bind:showConfirmDialog="showConfirmDialog"
      v-bind:confirmationMsg="confirmationMsg"
      v-on:confirmDialogYes="deleteQuestion"
      v-on:closeConfirmDialog="showConfirmDialog = false"/>
  </div>
</template>

<script>
import { LIST_QUESTIONS, ADD_QUESTION, UPDATE_QUESTION, REMOVE_QUESTION } from '@/store/actionTypes';
import confirmDialog from '@/components/global/ConfirmDialog';

export default {
  name: 'QuestionsMgmt',
  components: {
    confirmDialog,
  },
  data() {
    return {
      newQuestion: '',
      disabled: null,
      newQuestionDialog: false,
      confirmationMsg: {
        title: 'Delete Question',
        body: 'Are you sure that you want to delete this question?',
      },
      showConfirmDialog: false,
      questionToDelete: {},
    };
  },
  computed: {
    questions() {
      return this.$store.getters.getListOfQuestions;
    },
  },
  methods: {
    toggleEditQuestion(index) {
      if (this.disabled === null) {
        this.disabled = index;
      } else if (this.disabled === index) {
        this.disabled = null;
      }
    },
    saveEditedQuestion(question) {
      this.$store.dispatch(UPDATE_QUESTION, question)
        .then(this.disabled = null);
    },
    saveNewQuestion() {
      const payload = {
        question: this.newQuestion,
      };
      this.$store.dispatch(ADD_QUESTION, payload)
        .then(this.newQuestionDialog = false)
        .then(this.newQuestion = '');
    },
    closeNewQuestionDialog() {
      this.newQuestionDialog = false;
      this.newQuestion = '';
    },
    deleteQuestionDialog(question) {
      this.questionToDelete = question;
      /* Declaration of inverse value required
      allows for reset of dialog if closed
      by clicking outside previously */
      this.showConfirmDialog = !this.showConfirmDialog;
    },
    deleteQuestion() {
      this.$store.dispatch(REMOVE_QUESTION, this.questionToDelete._id)
        .then(this.questionToDelete = {});
    },
  },
  watch: {
    newQuestionDialog(val) {
      return val || this.closeNewQuestionDialog();
    },
  },
  created() {
    this.$store.dispatch(LIST_QUESTIONS);
  },
};
</script>

<style lang="scss">
.q-mgmt {
  .question-field input {
    font-weight: 400;
  }
  .question-btn {
    min-width: auto;
    padding: 0 10px;

    small {
      font-weight: 400;
    }
  }
}
</style>

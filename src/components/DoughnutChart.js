import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: ['upvotes', 'downvotes', 'height', 'width'],
  created() {
    this.buildChart();
  },
  computed: {
    sent() {
      return this.$store.state.survey.list;
    },
    sentCount() {
      return this.sent.length;
    },
    started() {
      return this.sent.filter(survey =>
        survey.answers.find(({ value }) => value !== undefined)).length;
    },
    completed() {
      return this.sent.filter(survey =>
        !survey.answers.find(({ value }) => value === undefined)).length;
    },
    googleReviews() {
      return this.$store.state.actions.google_reviews;
    },
  },
  methods: {
    buildChart() {
      this.renderChart({
        labels: ['Yes', 'No'],
        height: '200px',
        datasets: [
          {
            borderColor: '#0f3c59',
            borderWidth: 5,
            backgroundColor: ['#0f3c59', '#ee6d58'],
            data: [this.upvotes, this.downvotes],
          },
        ],
      }, {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 45,
        legend: {
          display: true,
          position: 'bottom',
          fullWidth: true,
          labels: {
            borderWidth: 1,
            boxWidth: 30,
            fontSize: 20,
          },
          animation: {
            animateScale: true,
          },
        },
      });
    },
  },
  mounted() {
    this.buildChart();
  },
};

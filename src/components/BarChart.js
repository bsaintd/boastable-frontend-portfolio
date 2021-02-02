import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
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
    googleClicks() {
      return this.$store.state.actions.google_reviews;
    },
    yelpClicks() {
      return this.$store.state.actions.yelp_clicks;
    },
    allReviewClicks() {
      return this.googleClicks + this.yelpClicks;
    },
  },
  methods: {
    buildChart() {
      this.renderChart({
        labels: ['Sent', 'Opened', 'Completed', 'Reviewed'],
        datasets: [
          {
            borderColor: '#0f3c59',
            borderWidth: 2,
            backgroundColor: ['#ee6d58', 'yellow', '#0f3c59', '#4CAF50'],
            data: [this.sentCount, this.started, this.completed, this.allReviewClicks],
          },
        ],
      }, {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 45,
        grid: false,
        borderSkipped: 'bottom left',
        scales: {
          xAxes: [{
            gridLines: {
              color: 'rgba(0,0,0,0)',
            },
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(0,0,0,0)',
            },
            ticks: {
              maxTicksLimit: 3,
              beginAtZero: true,
            },
          }],
        },
        legend: {
          display: false,
          position: 'right',
          fullWidth: false,
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
  updated() {
    this.buildChart();
  },
};

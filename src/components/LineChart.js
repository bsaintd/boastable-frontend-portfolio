import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  mounted() {
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Reviews Tracked',
          backgroundColor: 'Green',
          data: [20, 19, 5, 20, 19, 8, 10],
        },
        {
          label: 'Survey Complete',
          backgroundColor: 'Yellow',
          data: [40, 39, 10, 25, 39, 20, 40],
        },
        {
          label: 'Survey Sent',
          backgroundColor: 'Red',
          data: [60, 55, 42, 30, 45, 28, 53],
        },
      ],
    }, { responsive: true, maintainAspectRatio: false });
  },
};

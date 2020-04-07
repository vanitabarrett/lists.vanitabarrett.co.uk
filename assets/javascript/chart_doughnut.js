var doughnutctx = document.querySelector('#chart-doughnut').getContext('2d');
var labels = JSON.parse(document.querySelector("[data-labels]").getAttribute("data-labels"));
var total = document.querySelector("[data-total]").getAttribute("data-total");
var complete = document.querySelector("[data-userCount]").getAttribute("data-userCount");
var incomplete = total - complete;

var doughnutData = {
  "labels": labels,
  "datasets": [{
    "label": labels,
    "data": [complete, incomplete],
    "backgroundColor": [ "#00b300", "#002B49" ]
  }]
}

Chart.defaults.global.defaultFontColor = "#fff";

var myDoughnutChart = new Chart(doughnutctx, {
  type: 'doughnut',
  data: doughnutData,
  options: {
    maintainAspectRatio: false
  },
  responsive: true,
});

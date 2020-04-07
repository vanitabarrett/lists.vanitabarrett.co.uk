var doughnutctx = document.getElementById('travel__graph-doughnut').getContext('2d');
var totalSites = document.querySelector("[data-total-sites]").getAttribute("data-total-sites");
var completedSites = document.querySelector("[data-doughnut]").getAttribute("data-doughnut");
var incompleteSites = totalSites - completedSites;
var doughnutData = {
  "labels": [ "Visited", "Not Visited" ],
  "datasets": [{
    "label": "visited sites / unvisited sites ",
    "data": [completedSites, incompleteSites],
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

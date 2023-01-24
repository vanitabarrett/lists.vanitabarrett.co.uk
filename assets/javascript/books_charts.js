var linectx = document.getElementById('books__graph-line').getContext('2d');
var completedListRawData = JSON.parse(document.querySelector("[data-line]").getAttribute("data-line"));
var completedNonListRawData = JSON.parse(document.querySelector("[data-nonlist-line]").getAttribute("data-nonlist-line"));

var formattedListData = {}
var formattedNonListData = {}

// Get data in a form where you can lookup by year
completedListRawData.forEach(function(year) {
  formattedListData[year["Year"]] = {
    count: year["Count"]
  }
});
completedNonListRawData.forEach(function(year) {
  formattedNonListData[year["Year"]] = {
    count: year["Count"]
  }
});

var listData = []
var nonListData = []
var yearlyTotals = [];
var labels = []

for (var i = 2011; i <= new Date().getFullYear(); i++) {
  labels.push(i)

  var formattedListDataCount = (formattedListData[i] !== undefined) ? formattedListData[i]["count"] : 0;
  var formattedNonListDataCount = (formattedNonListData[i] !== undefined) ? formattedNonListData[i]["count"] : 0;

  listData.push(formattedListDataCount);
  nonListData.push(formattedNonListDataCount);
  yearlyTotals.push(formattedListDataCount + formattedNonListDataCount);
}

var lineData = {
  "labels": labels,
  "datasets": [
    {
      "label": "List Books",
      "data": listData,
      "borderColor": "#ff6205"
    },
    {
      "label": "Non-List Books",
      "data": nonListData,
      "borderColor": "#CDC5B4"
    },
    {
      "label": "Yearly Totals",
      "data": yearlyTotals,
      "borderColor": "#AFEEEE",
    }
  ]
}

Chart.defaults.global.defaultFontColor = "#fff";

var myLineChart = new Chart(linectx, {
  type: 'line',
  data: lineData,
  options: {
    maintainAspectRatio: false,
  },
  responsive: true,
});

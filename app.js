var express = require('express');
var app = express();
var database = require('./database');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use("/dist", express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/books', async function (req, res) {
  var doughnutDataQuery = "SELECT COUNT(*) AS count FROM list_books WHERE Status=4";
  var nonListBookCountQuery = "SELECT COUNT(*) AS count FROM nonlist_books WHERE Status=4";
  var completedListBooksQuery = "SELECT completed_list_books.Year, GROUP_CONCAT(list_books.Title) AS \'Books\', COUNT(completed_list_books.Book_Id) AS \'Count\' FROM completed_list_books left join list_books on(completed_list_books.Book_Id=list_books.Id) GROUP BY completed_list_books.Year";
  var completedNonListBooksQuery = "SELECT completed_nonlist_books.Year, GROUP_CONCAT(nonlist_books.Title) AS \'Books\', COUNT(completed_nonlist_books.Book_Id) AS \'Count\' FROM completed_nonlist_books left join nonlist_books on(completed_nonlist_books.Book_Id=nonlist_books.Id) GROUP BY completed_nonlist_books.Year";

  const doughnutData = await database(doughnutDataQuery)
  const nonListBooksCompletedData = await database(nonListBookCountQuery)
  const completedListBooksData = await database(completedListBooksQuery)
  const completedNonListBooksData = await database(completedNonListBooksQuery)

  res.render('books', {
    doughnutData: doughnutData[0].count,
    nonListBooksCompletedData: nonListBooksCompletedData[0].count,
    completedListBooksData: JSON.stringify(completedListBooksData),
    completedNonListBooksData: JSON.stringify(completedNonListBooksData)
 });
});

app.get('/search', async function (req, res) {
  var type = req.query.type

  if (type === "list") {
    var query = "SELECT * FROM list_books";
  } else if (type === "nonlist") {
    var query = "SELECT * FROM nonlist_books WHERE NOT Status=2 ORDER BY Status ASC"
  } else if (type === "wishlist") {
    var query = "SELECT * FROM nonlist_books WHERE Status=2 ORDER BY Id DESC"
  }

  const books = await database(query)
  res.render('search', { books });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

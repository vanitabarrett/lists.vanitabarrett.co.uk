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
  var completedListBooksQuery = "SELECT completed_list_books.Year, COUNT(completed_list_books.Book_Id) AS \'Count\' FROM completed_list_books left join list_books on(completed_list_books.Book_Id=list_books.Id) GROUP BY completed_list_books.Year";
  var completedNonListBooksQuery = "SELECT completed_nonlist_books.Year, COUNT(completed_nonlist_books.Book_Id) AS \'Count\' FROM completed_nonlist_books left join nonlist_books on(completed_nonlist_books.Book_Id=nonlist_books.Id) GROUP BY completed_nonlist_books.Year";

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
    var query = "SELECT * FROM list_books ORDER BY CASE WHEN Status = 3 THEN 1 ELSE 2 END, Author_Surname"
  } else if (type === "nonlist") {
    var query = "SELECT * FROM nonlist_books WHERE NOT Status=2 ORDER BY Status ASC"
  } else if (type === "wishlist") {
    var query = "SELECT * FROM nonlist_books WHERE Status=2 ORDER BY Id DESC"
  }

  const books = await database(query)
  res.render('search', { books, type });
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

app.post('/edit-book', async function (req, res) {
  var type = req.body.type
  var title = req.body.title
  var status = Number(req.body.status)
  var year = req.body.year
  var id = Number(req.body.id)

  var database_name = ""
  var completed_database_name = ""

  if (type === "list" || type === "nonlist") {
    database_name = type + "_books"
    completed_database_name = "completed_" + type + "_books"
  } else if (type === "wishlist") {
    database_name = "nonlist_books"
    completed_database_name = "completed_nonlist_books"
  }

  // Update title and status of book
  var query = "UPDATE " + database_name + " SET Title='" + title + "', Status='" + status + "' WHERE Id='" + id + "'"

  // If book is completed, update/add to completed database
  if (status === 4) {
    var secondaryQuery = "INSERT INTO " + completed_database_name + " (`Book_Id`, `Year`) VALUES (" + id + "," + year + ") ON DUPLICATE KEY UPDATE `Year` = '"+ year + "'"
  } else {
    // Delete if it's in the completed table already
    var secondaryQuery = "DELETE FROM " + completed_database_name + " WHERE Book_Id=" + id
  }

  await database(query)
  if (secondaryQuery) {
    await database(secondaryQuery)
  }

  res.redirect('/search?type=' + type);
});

app.post('/add-book', async function (req, res) {
  var title = req.body.title
  var firstname = req.body.firstname_author
  var surname = req.body.surname_author
  var status = Number(req.body.status)
  var year = req.body.year

  if (year) {
    var query = "INSERT INTO nonlist_books (`Id`, `Title`, `Author_FirstName`, `Author_Surname`, `Status`) VALUES (" + null + ",'" + title + "','"  + firstname + "','" + surname + "'," + status + ")"
  } else {
    var query = "INSERT INTO nonlist_books (`Id`, `Title`, `Author_FirstName`, `Author_Surname`, `Status`) VALUES (" + null + ",'" + title + "','"  + firstname + "','" + surname + "'," + status + ")"
  }

  await database(query)

  if (year) {
    // We now need to add it to the completed table
    var getBookId = "SELECT Id FROM nonlist_books WHERE title='" + title + "'"
    var rawId =  await database(getBookId)
    id = rawId[0].Id

    var secondaryQuery = "INSERT INTO completed_nonlist_books (`Book_Id`, `Year`) VALUES (" + id + "," + year + ") ON DUPLICATE KEY UPDATE `Year` = '"+ year + "'"
    await database(secondaryQuery)
  }

  res.redirect('/books');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

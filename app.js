var express = require('express');
var app = express();
var mysql = require('mysql');
var config = require('./config/config.js');

const connection = mysql.createConnection({
  host: config.databaseHost,
  user: config.databaseUsername,
  password: config.databasePwd,
  database: config.databaseName
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use("/dist", express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/books', function (req, res) {
  res.render('books');
});

app.get('/search', function (req, res) {
  connection.query('SELECT * FROM list_books', (err,rows) => {
    if (rows) {
      res.render('search', { books: rows });
    } else {
      // TODO: handle error
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

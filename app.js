var express = require('express');
var app = express();

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
  res.render('search');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const express = require("express");
const basicAuth = require('express-basic-auth')

require('dotenv').config()
const app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');

const database = require('../database');

app.use(basicAuth({
  users: { [process.env.BASIC_USER]: process.env.BASIC_PASS },
  challenge: true
}))

// Keeping this cos might need it to run locally (Vercel doesn't require it)
app.use(express.static('public'))

app.get('/books', async function (req, res) {
  var doughnutDataQuery = "SELECT COUNT(*)::int AS count FROM list_books WHERE Status=4";
  var nonListBookCountQuery = "SELECT COUNT(*)::int AS count FROM nonlist_books WHERE Status=4";
  var completedListBooksQuery = "SELECT completed_list_books.year, COUNT(completed_list_books.book_id)::int AS Count FROM completed_list_books left join list_books on(completed_list_books.book_id=list_books.id) GROUP BY completed_list_books.year";
  var completedNonListBooksQuery = "SELECT completed_nonlist_books.year, COUNT(completed_nonlist_books.book_id)::int AS Count FROM completed_nonlist_books left join nonlist_books on(completed_nonlist_books.book_id=nonlist_books.id) GROUP BY completed_nonlist_books.year";

  const doughnutData = await database.queryDatabase(doughnutDataQuery)
  const nonListBooksCompletedData = await database.queryDatabase(nonListBookCountQuery)
  const completedListBooksData = await database.queryDatabase(completedListBooksQuery)
  const completedNonListBooksData = await database.queryDatabase(completedNonListBooksQuery)

  res.render('books', {
    doughnutData: doughnutData[0].count,
    nonListBooksCompletedData: nonListBooksCompletedData[0].count,
    completedListBooksData: JSON.stringify(completedListBooksData),
    completedNonListBooksData: JSON.stringify(completedNonListBooksData)
 });
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/completion-report', async function (req, res) {
  var completedListBooksQuery = "SELECT completed_list_books.year, list_books.title FROM completed_list_books INNER JOIN list_books ON completed_list_books.book_id=list_books.id ORDER BY completed_list_books.year DESC"
  var completedListBooks = await database.queryDatabase(completedListBooksQuery)

  var completedNonListBooksQuery = "SELECT completed_nonlist_books.year, nonlist_books.title FROM completed_nonlist_books INNER JOIN nonlist_books ON completed_nonlist_books.book_id=nonlist_books.id ORDER BY completed_nonlist_books.year DESC"
  var completedNonListBooks = await database.queryDatabase(completedNonListBooksQuery)

  res.render('completion_report', { completedListBooks, completedNonListBooks });
});

app.post('/update', async function (req, res) {
  // Fetch latest data from Unesco
  var allUnescoSites = await database.fetchDataFromUnesco()

  var unescoIds = allUnescoSites.query.row.map((site) => {
    return Number(site.id_number)
  }).flat()

  var unescoSitesArr = allUnescoSites.query.row.map((site) => {
    return {
      id: Number(site.id_number),
      name: String(site.site),
      country: String(site.states),
      url: String(site.http_url),
    }
  })

  // Fetch all sites from database
  var allSitesQuery = "SELECT Id FROM list__travel"
  const allSites = await database.queryDatabase(allSitesQuery)

  var allSiteIds = allSites.map((site) => {
    return site.id
  })

  // Identify any unesco sites not present in database (lookup via id)
  var missingSiteIds = unescoIds.diff(allSiteIds)

  if (missingSiteIds.length > 0) {
    newSitesToAdd = []

    missingSiteIds.forEach(missingSiteId => {
      newSitesToAdd.push(unescoSitesArr.find(arr => arr.id === missingSiteId))
    })
  }

  const values = []
  const placeholders = []

  newSitesToAdd.forEach(async (site, i) => {
    const baseIndex = i * 5
    placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`)
    values.push(site.id, site.name, site.country, 1, site.url)
  })

  const insertNewUnescoSitesQuery = `INSERT INTO list__travel (id, name, country, status, url) VALUES ${placeholders.join(", ")}`;

  await database.parameterisedQueryDatabase(insertNewUnescoSitesQuery, values)

  res.redirect('/travel');
})

app.get('/update', async function (req, res) {
  // Fetch latest data from Unesco
  var allUnescoSites = await database.fetchDataFromUnesco()

  var unescoIds = allUnescoSites.query.row.map((site) => {
    return Number(site.id_number)
  }).flat()

  var unescoSitesArr = allUnescoSites.query.row.map((site) => {
    return {
      id: Number(site.id_number),
      name: String(site.site),
      country: String(site.states)
    }
  })

  // Fetch all sites from database
  var allSitesQuery = "SELECT id FROM list__travel"
  const allSites = await database.queryDatabase(allSitesQuery)

  var allSiteIds = allSites.map((site) => {
    return site.id
  })

  // Identify any unesco sites not present in database (lookup via id)
  var missingSiteIds = unescoIds.diff(allSiteIds)

  if (missingSiteIds.length > 0) {
    newSitesToAdd = []

    missingSiteIds.forEach(missingSiteId => {
      newSitesToAdd.push(unescoSitesArr.find(arr => arr.id === missingSiteId))
    })

    res.render('update', {
      newSites: newSitesToAdd
    });
  } else {
    res.render('update', {
      error: 'There are no new sites to add'
    });
  }
})

app.get('/travel', async function (req, res) {
  var totalListedSitesQuery = "SELECT COUNT(*)::int AS count FROM list__travel"
  var totalCompletedListedSitesQuery = "SELECT COUNT(*)::int AS count FROM list__travel WHERE Status=4"

  var totalCountriesQuery = "SELECT COUNT(*)::int AS count FROM nonlist_countries"
  var totalCompletedCountriesQuery = "SELECT COUNT(*)::int AS count FROM nonlist_countries WHERE Status=1"

  var visitedCountriesQuery = "SELECT id, continent FROM nonlist_countries WHERE Status=1"

  const totalListedSites = await database.queryDatabase(totalListedSitesQuery)
  const totalCompletedListedSites = await database.queryDatabase(totalCompletedListedSitesQuery)
  const totalCountries = await database.queryDatabase(totalCountriesQuery)
  const totalCompletedCountries = await database.queryDatabase(totalCompletedCountriesQuery)
  const visitedCountries = await database.queryDatabase(visitedCountriesQuery)

  res.render('travel', {
    totalListedSites: totalListedSites[0].count,
    totalCompletedListedSites: totalCompletedListedSites[0].count,
    totalCountries: totalCountries[0].count,
    totalCompletedCountries: totalCompletedCountries[0].count,
    visitedCountries: JSON.stringify(visitedCountries)
  });
});

app.get('/search', async function (req, res) {
  var type = req.query.type
  var list = req.query.list

  if (list === "books") {
    if (type === "list") {
      var query = "SELECT list_books.*, completed_list_books.year FROM list_books LEFT JOIN completed_list_books ON list_books.id=completed_list_books.book_id ORDER BY CASE WHEN Status = 3 THEN 1 WHEN Status = 5 THEN 999 ELSE 2 END, Author_Surname"
    } else if (type === "nonlist") {
      var query = "SELECT nonlist_books.*, completed_nonlist_books.year FROM nonlist_books LEFT JOIN completed_nonlist_books ON nonlist_books.id=completed_nonlist_books.book_id WHERE NOT Status=2 ORDER BY Status ASC, completed_nonlist_books.year DESC"
    } else if (type === "wishlist") {
      var query = "SELECT * FROM nonlist_books WHERE Status=2 ORDER BY Id DESC"
    }

    const books = await database.queryDatabase(query)
    res.render('search', { books, type });
  }
  else if (list === "travel") {
    if (type === "list") {
      var query = "SELECT * FROM list__travel ORDER BY CASE WHEN Status = 3 THEN 1 WHEN Status = 2 THEN 2 WHEN Status = 4 THEN 4 ELSE 3 END, country"
    } else if (type === "nonlist") {
      var query = "SELECT * FROM nonlist_countries ORDER BY Status ASC"
    }

    const sites = await database.queryDatabase(query)
    res.render('search', { sites, type });
  }
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

app.post('/edit-book', async function (req, res) {
  var type = req.body.type
  var title = req.body.title
  var status = Number(req.body.status)
  var year = req.body.year
  var rating = req.body.rating || 0
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
  var query = "UPDATE " + database_name + ' SET title = \'' + title + '\', status = \'' + status + '\', rating = \'' + rating + '\' WHERE id = \'' + id + '\''
  await database.queryDatabase(query)

  // If book is completed, update/add to completed database
  if (status === 4) {
    var secondaryQuery = "INSERT INTO " + completed_database_name + " (book_id, year) VALUES ($1, $2) ON CONFLICT (book_id) DO UPDATE SET year = '" + year + "'"
    var values = [id, year]
    await database.parameterisedQueryDatabase(secondaryQuery, values)
  } else {
    // Delete if it's in the completed table already
    var secondaryQuery = "DELETE FROM " + completed_database_name + " WHERE book_id=" + id
    await database.queryDatabase(secondaryQuery)
  }

  res.redirect('/search?type=' + type + '&list=books');
});

app.post('/edit-travel', async function (req, res) {
  var type = req.body.type
  var status = Number(req.body.status)
  var id = ""
  var database_name = ""

  if (type === "list") {
    var id = Number(req.body.id)
    database_name = "list__travel"
  } else if (type === "nonlist") {
    var id = req.body.id
    database_name = "nonlist_countries"
  }

  var query = "UPDATE " + database_name + " SET Status='" + status + "' WHERE Id='" + id + "'"

  await database.queryDatabase(query)

  res.redirect('/search?type=' + type + '&list=travel');
});

app.post('/add-book', async function (req, res) {
  var title = req.body.title
  var firstname = req.body.firstname_author
  var surname = req.body.surname_author
  var status = Number(req.body.status)
  var year = req.body.year

  var query = "INSERT INTO nonlist_books (id, title, author_firstname, author_surname, status) VALUES (DEFAULT, $1, $2, $3, $4)"
  var values = [title, firstname, surname, status]

  await database.parameterisedQueryDatabase(query, values)

  if (year) {
    // We now need to add it to the completed table
    var getBookId = "SELECT Id FROM nonlist_books WHERE title='" + title + "'"
    var rawId =  await database.queryDatabase(getBookId)
    id = rawId[0].id

    var secondaryQuery = "INSERT INTO completed_nonlist_books (book_id, year) VALUES ($1, $2) ON CONFLICT (book_id) DO UPDATE SET year = '" + year + "'"
    var values = [id, year]
    await database.parameterisedQueryDatabase(secondaryQuery, values)
  }

  res.redirect('/books');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// Export the Express API
module.exports = app;

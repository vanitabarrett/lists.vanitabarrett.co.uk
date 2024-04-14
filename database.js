var mysql = require('mysql');
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

function queryDatabase(queryString, params) {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env. MYSQL_PASS,
    database: process.env.MYSQL_NAME
  });
  connection.connect((err) => {
    if (err) throw err;
  });

  return new Promise((resolve, reject) => {
    connection.query(queryString, params, (error, results) => {
      if (error) {
        console.log(error); // eslint-disable-line no-console
        reject(error);
      }
      resolve(results);
    });

    connection.end();
  });
}

function fetchDataFromUnesco() {
  // Fetch latest data from Unesco XML
  return new Promise((resolve, reject) => {
    https.get("https://whc.unesco.org/en/list/xml", function (xmlResult) {
      let data = '';
      xmlResult.on('data', function (stream) {
        data += stream;
      });
      xmlResult.on('end', function () {
        parser.parseString(data, function (error, result) {
          if (error === null) {
            resolve(result);
          }
          else {
            reject(error);
          }
        });
      });
    });
  })

}

Array.prototype.diff = function (comparisonArray) {
  return this.filter(function (i) { return comparisonArray.indexOf(i) < 0; });
};

module.exports = {
  queryDatabase,
  fetchDataFromUnesco
}

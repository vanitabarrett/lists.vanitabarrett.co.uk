var mysql = require('mysql');
var config = require('./config/config.js');

function queryDatabase(queryString, params) {
  const connection = mysql.createConnection({
    host: config.databaseHost,
    user: config.databaseUsername,
    password: config.databasePwd,
    database: config.databaseName
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

module.exports = queryDatabase

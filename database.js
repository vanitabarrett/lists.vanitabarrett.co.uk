import { sql } from '@vercel/postgres';
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

async function queryDatabase(queryString) {
  const res = await sql`${queryString}`
  return res
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

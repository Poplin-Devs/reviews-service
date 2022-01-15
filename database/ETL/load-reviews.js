const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const db = require('../index.js').connection;

const filename = 'reviews-12.csv';
const input = path.join(__dirname, `./data/results/${filename}`);

db.connect((error) => {
  if (error) { throw err; }
  console.log('\n --> Connected to the reviews database!');

  const parseLines = async () => {
    const fileStream = fs.createReadStream(input); //create stream

    const rl = readline.createInterface({ //build stream interface
      input: fileStream,
      crlfDelay: Infinity
    });

    let lineCounter = 0;

    const errorLog = {
      a: 'One of the fields are missing'
    };
    const error = (line, message) => {
      if (errorLog[line]) {
        errorLog[line] = errorLog[line].concat(' - ', message);
      } else {
        errorLog[line] = message;
      }
    };

    for await (const line of rl) { //parse lines
      const splitLine = line.split(',');
      let [ id, productId, rating, date, summary, body, recommend, reported, reviewerName, reviewerEmail, response, helpfulness ] = splitLine;

      if (id.includes('id')) { continue; }
      lineCounter++;

      let errorExists = false;

      if (!splitLine.length === 12) { errorExists = true; error(lineCounter, errorLog.a); continue; }
      if (recommend.length > 1) {
        if (recommend === 'true') { recommend = 1; }
        if (recommend === 'false') { recommend = 0; }
      }
      if (reported.length > 1) {
        if (reported === 'true') { reported = 1; }
        if (reported === 'false') { reported = 0; }
      }
      if (summary.length > 60) { summary = summary.slice(0, 59) + '"'; }
      if (body.length > 1000) { body = body.slice(0, 998) + '"'; }
      if (response === '') { response = null; }

      const sql = `INSERT INTO reviews (review_id, product_id, rating, review_date, summary, body, recommend, reported, reviewer_id, response, helpfulness) \
        VALUES (${id},${productId},${rating},${date},${summary},${body},${recommend},${reported},${reviewerName},${response},${helpfulness})`;

      db.query(sql, (error, results) => {
        if (error) {
          console.log('-------------------------');
          console.log(error);
          console.log(`(${id},${productId},${rating},${date},${summary},${body},${recommend},${reported},${reviewerName},${response},${helpfulness})`);
        }
      });
    }

    console.log('errors: ', errorLog);
    console.log(`________________________________ ${filename} process complete! lines : ${lineCounter}`);
  };

  parseLines();
});
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const exec = require('child_process').exec;
const db = require('../index.js').connection;

const filename = 'reviews.csv';
const input = path.join(__dirname, `./data/${filename}`);

exec(`wc -l < ${input}`, (error, results) => { //Total number of lines
  if (error) { throw 'Possible file not found.', error; }
  const totalLines = results * 1;
  console.log(`\nPreparing to parse ${totalLines} lines from ${input}...`);

  db.connect((error) => { //Connect to db
    if (error) { throw error; }
    console.log('\n--> Connected to the reviews database!');
    console.log('\n--> Building unqiue username object. \n');


    const parseLines = async () => {
      const rl = readline.createInterface({ //Build stream interface
        input: fs.createReadStream(input),
        crlfDelay: Infinity
      });

      //Error handling
      const errorMessages = {
        a: 'One of the fields are missing from this line.',
        b: 'Value is not in the correct number range.',
        c: 'Value contains too many characters.',
        d: 'Duplicate value found.'
      };
      const errorLog = {};

      const buildError = (line, message) => {
        if (errorLog[line]) {
          errorLog[line] = errorLog[line].concat(' - ', message);
        } else {
          errorLog[line] = message;
        }
      };

      //Initialize counts and caches
      let lineCounter = 0;

      //Build username cache
      const usernames = {};
      let reviewerId = 1;
      const userValues = [];

      //Parse lines
      for await (const line of rl) {
        lineCounter++;

        const splitLine = line.split(',');
        let [ id, productId, rating, date, summary, body, recommend, reported, reviewerName, reviewerEmail, response, helpfulness ] = splitLine;

        if (id.includes('id')) { continue; } //ignore header line

        //Validate/sanitize data
        let errorsExist = false;
        if (!splitLine.length === 12) {
          errorsExist = true;
          buildError(lineCounter, errorMessages.a);
        }

        const lowercaseName = reviewerName.toLowerCase();

        if (!usernames[lowercaseName]) {
          usernames[lowercaseName] = reviewerId;
          userValues.push([reviewerName, reviewerEmail]);
        } else {
          errorExists = true;
          errorLog['Error'] = 'Duplicate usernames found. Each unique username will be assigned to a single user id.';
        }

        //Continue looping if there is at least one error
        if (errorsExist) { continue; }
        reviewerId++;
      }

      //Build error messages
      const errorCount = Object.keys(errorLog).length;

      if (errorCount > 0) {
        console.log('\x1b[31mData validation errors found:\x1b[37m');
        console.log(errorLog);
      } else {
        console.log('--> No data validation errors found!');
      }
      console.log('--> Usernames object has been built!');
      console.log('--> Querying the database with unique users list. Please wait...');

      //Handle any remaining lines beyond last full chunk
      let sql = 'INSERT INTO users (name, email) VALUES ?';

      const totalUserValues = userValues.length;
      const maxUsersPerQuery = 500000;
      let numberOfQueries = Math.floor(totalUserValues / maxUsersPerQuery);
      const totalQueries = numberOfQueries;
      const lastQueryCount = totalUserValues % maxUsersPerQuery;
      let start = 0;
      let end = maxUsersPerQuery - 1;
      let queryCounter = 1;

      for ( numberOfQueries; numberOfQueries >= 0; numberOfQueries--) {
        if (numberOfQueries === 0 && lastQueryCount === 0) {
          console.log(`\n \x1b[36m ::: Query ${queryCounter} complete. No queries remain. :::`);

        } else if (numberOfQueries === 0 && lastQueryCount > 0) {
          const tempUserValues = userValues.slice(start, end + 1);

          db.query(sql, [tempUserValues], (error) => {
            if (error) {
              console.log('\n -------------------------');
              console.log(error);
            }
            console.log(`\n \x1b[36m ::: 1 query complete (there are ${totalQueries} queries). ${tempUserValues.length} usernames inserted. :::`);
          });
          queryCounter++;
          start += maxUsersPerQuery;
          end += maxUsersPerQuery;

        } else {
          const tempUserValues = userValues.slice(start, end + 1);

          db.query(sql, [tempUserValues], (error) => {
            if (error) {
              console.log('\n -------------------------');
              console.log(error);
            }
            console.log(`\n \x1b[36m ::: 1 query complete (there are ${totalQueries} queries). ${tempUserValues.length} usernames inserted. :::`);
          });
          queryCounter++;
          start += maxUsersPerQuery;
          end += maxUsersPerQuery;
        }
      }
    };

    parseLines();
  });
});
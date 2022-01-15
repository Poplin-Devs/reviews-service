const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const db = require('../index.js').connection;

const filename = 'reviews_photos-1.csv';
const input = path.join(__dirname, `./data/results/${filename}`);

db.connect((error) => {
  if (error) { throw err; }
  console.log('\n--> Connected to the reviews database!');

  const parseLines = async () => {
    const fileStream = fs.createReadStream(input); //create stream

    const rl = readline.createInterface({ //build stream interface
      input: fileStream,
      crlfDelay: Infinity
    });

    let lineCounter = 0;
    let linesProcessed = 0;

    const errorMessages = {
      a: 'One of the fields are missing from this line.',
      b: 'Value is not in the correct number range.',
      c: 'Value contains too many characters.'
    };
    const errorLog = {};

    const buildError = (line, message) => {
      if (errorLog[line]) {
        errorLog[line] = errorLog[line].concat(' - ', message);
      } else {
        errorLog[line] = message;
      }
    };

    let bufferCounter = 0;
    let totalBuffers = 0;
    let bufferValues = [];

    for await (const line of rl) { //parse lines
      lineCounter++;
      bufferCounter++;

      if (bufferCounter === 5000) {
        let sql = 'INSERT INTO photos (photo_id, review_id, url) VALUES ?';

        db.query(sql, [bufferValues], (error) => {
          if (error) {
            console.log('\n -------------------------');
            console.log(error);
            console.log(splitLine);
          }
        });

        totalBuffers++;
        bufferCounter = 0;
        bufferValues = [];
      }

      //validate/sanitize data and push to values array
      const splitLine = line.split(',');
      let [ id, reviewId, url ] = splitLine;

      if (id.includes('id')) { continue; }

      let errorsExist = false;

      if (!splitLine.length === 3) {
        errorsExist = true;
        buildError(lineCounter, errorMessages.a);
        continue;
      }
      if (0 < id > 5800000 ) {
        errorsExist = true;
        buildError(lineCounter, 'id: ' + errorMessages.b);
        continue;
      }
      if (0 < reviewId > 5800000 ) {
        errorsExist = true;
        buildError(lineCounter, 'review id: ' + errorMessages.b);
        continue;
      }
      if (url.length > 200) {
        errorsExist = true;
        buildError(lineCounter, 'review id: ' + errorMessages.c);
        continue;
      }

      if (!errorsExist) {
        bufferValues.push(splitLine);
      }
    }

    const errorCount = Object.keys(errorLog).length;
    if (errorCount > 0) {
      console.log(`${errorCount} errors found:`);
      console.log(errorLog);
    } else {
      console.log('--> No errors found!');
    }
    console.log(`\n \x1b[36m" :::::::: Load photos process complete! Lines processed: ${totalBuffers} / ${lineCounter} ::::::::`);
  };

  parseLines();
});
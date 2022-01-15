const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const exec = require('child_process').exec;
const db = require('../index.js').connection;

const filename = 'reviews_photos.csv';
const input = path.join(__dirname, `./data/${filename}`);

exec(`wc -l < ${input}`, (error, results) => { //Total number of lines
  if (error) { throw error; }
  const totalLines = results * 1;
  console.log(`\nPreparing to parse ${totalLines} lines from ${input}...`);

  db.connect((error) => { //Connect to db
    if (error) { throw error; }
    console.log('\n--> Connected to the reviews database!');

    const parseLines = async () => {
      const rl = readline.createInterface({ //Build stream interface
        input: fs.createReadStream(input),
        crlfDelay: Infinity
      });

      //Error handling
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

      //Initialize counts and caches
      let lineCounter = 0;
      let linesProcessed = 0;
      let chunkSize = 5000;
      let linesInChunk = 0;
      let chunkValues = [];
      let totalChunks = 0;
      let totalLinesChunked = 0;
      let maxFullChunks = Math.floor(totalLines / chunkSize);

      //Parse lines
      for await (const line of rl) {
        lineCounter++;
        linesInChunk++;

        const splitLine = line.split(',');
        let [ id, reviewId, url ] = splitLine;

        if (id.includes('id')) { continue; } //ignore header line

        //Validate/sanitize data
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

        //Push valid data to chunkValues array
        if (!errorsExist) {
          chunkValues.push(splitLine);
        }

        //Once chunk is full, make a single query
        if (linesInChunk === chunkSize) {
          let sql = 'INSERT INTO photos (photo_id, review_id, url) VALUES ?';

          db.query(sql, [chunkValues], (error) => {
            if (error) {
              console.log('\n -------------------------');
              console.log(error);
              console.log(splitLine);
            }
          });

          totalChunks++;
          totalLinesChunked += linesInChunk;
          linesInChunk = 0;
          chunkValues = [];
        }

        if (totalChunks >= maxFullChunks &&
          linesInChunk === totalLines + 1 - (maxFullChunks * chunkSize) ) {
          let sql = 'INSERT INTO photos (photo_id, review_id, url) VALUES ?';

          db.query(sql, [chunkValues], (error) => {
            if (error) {
              console.log('\n -------------------------');
              console.log(error);
              console.log(splitLine);
            }
          });

          totalChunks++;
          totalLinesChunked += linesInChunk;
          linesInChunk = 0;
          chunkValues = [];
        }
      }

      //Build error messages
      const errorCount = Object.keys(errorLog).length;

      if (errorCount > 0) {
        console.log(`${errorCount} data validation errors found:`);
        console.log(errorLog);
      } else {
        console.log('--> No data validation errors found!');
      }
      console.log(`\n \x1b[36m" ::: Load photos process complete! :::
        Total chunks: ${totalChunks}
        Lines processed (lines chunked/total lines): ${totalLinesChunked} / ${lineCounter}`);
    };

    parseLines();
  });

});
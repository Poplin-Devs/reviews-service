const mysql = require('mysql2');
const { MYSQL_USER, MYSQL_KEY } = require('../server/config.js');
const fs = require('fs');
const readline = require('readline');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: MYSQL_USER,
  database: MYSQL_KEY
});

console.log('hello world');

// exports.connection = connection;


// const rl = readline.createInterface({ input, output });

// const answer = await rl.question('What do you think of Node.js? ');

// console.log(`Thank you for your valuable feedback: ${answer}`);

// rl.close();
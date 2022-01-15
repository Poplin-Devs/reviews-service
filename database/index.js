const mysql = require('mysql2');
const { MYSQL_USER, MYSQL_KEY } = require('./config.js');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: MYSQL_USER,
  password: MYSQL_KEY,
  database: 'reviews'
});

exports.connection = connection;
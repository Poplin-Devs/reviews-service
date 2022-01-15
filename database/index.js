const mysql = require('mysql2');
const path = require('path');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: MYSQL_USER,
  password: MYSQL_KEY,
  database: 'reviews'
});

exports.connection = connection;
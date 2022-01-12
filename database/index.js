const mysql = require('mysql2');
const { MYSQL_USER, MYSQL_KEY } = require('../server/config.js');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: MYSQL_USER,
  database: MYSQL_KEY
});

exports.connection = connection;
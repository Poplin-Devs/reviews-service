const mysql = require('mysql2');
const { MYSQL_USER, MYSQL_KEY } = require('./config.js');

const connection = mysql.createConnection({
  host: 'ec2-54-174-30-206.compute-1.amazonaws.com',
  user: MYSQL_USER,
  password: MYSQL_KEY,
  database: 'reviews'
});

exports.connection = connection;
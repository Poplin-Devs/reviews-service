/* eslint-disable camelcase */
const db = require('../../database');

module.exports = {
  getMeta: (req, res) => {
    const { review_id } = req.params;
    const sql = '';

    db.connection.query(sql, (error, results) => {
      if (error) { res.status(400).send(error); }
      res.status(204).send();
    });
  }
};
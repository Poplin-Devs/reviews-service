/* eslint-disable camelcase */
const db = require('../../database');

module.exports = {
  helpful: (req, res) => {
    const { review_id } = req.params;
    const sql = `UPDATE reviews SET helpfulness = helpfulness + 1  WHERE review_id = ${review_id}`;

    db.connection.query(sql, (error, results) => {
      if (error) { res.status(400).send(error); }
      res.status(204).send();
    });
  },

  report: (req, res) => {
    const { review_id } = req.params;
    const sql = `UPDATE reviews SET reported = (1) WHERE review_id = ${review_id}`;

    db.connection.query(sql, (error, results) => {
      if (error) { res.status(400).send(error); }
      res.status(204).send();
    });
  }
};
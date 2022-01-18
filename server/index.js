const express = require('express');
const app = express();
const path = require('path');
const router = require('express').Router();
const routes = require('./routes');

const port = 8008;


app.get('/reviews', (req, res) => {
  routes.reviews.get(req, res);
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log('HELPFUL ROUTER ROUTING');
  routes.reviews.helpful(req, res);
});

app.put('/reviews/:review_id/report', (req, res) => {
  console.log('REPORT ROUTER ROUTING');

  routes.reviews.report(req, res);
});


app.listen(port, () => { console.log(`Listening at http://localhost:${port}`); });
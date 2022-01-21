const express = require('express');
const app = express();
const path = require('path');
const router = require('express').Router();
const routes = require('./routes');

const port = 8008;

app.use(express.json());

app.get('/reviews', (req, res) => {
  routes.reviews.getReviews(req, res);
});

app.post('/reviews', (req, res) => {
  routes.reviews.addReview(req, res);
});

app.get('/reviews/meta', (req, res) => {
  routes.meta.getMeta(req, res);
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  routes.puts.helpful(req, res);
});

app.put('/reviews/:review_id/report', (req, res) => {
  routes.puts.report(req, res);
});

app.listen(port, () => { console.log(`Listening at http://localhost:${port}`); });
const express = require('express');
const app = express();
const path = require('path');
const router = require('express').Router();
const routes = require('./routes');

const port = 8008;

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
  routes.reviewId.helpful(req, res);
});

app.put('/reviews/:review_id/report', (req, res) => {
  routes.reviewId.report(req, res);
});

app.listen(port, () => { console.log(`Listening at http://localhost:${port}`); });
/* eslint-disable camelcase */
const db = require('../../database');

module.exports = {
  getReviews: (req, res) => {
    let { page, count, sort, product_id } = req.query;
    if (!product_id) { res.status(400).send('Error: no product ID specified.'); }

    page = page || 1;
    count = count || 5;
    sort = sort || 'newest';
    let sortColumn = 'review_date asc';
    if (sort === 'helpful') { sortColumn = 'helpfulness desc'; }
    if (sort === 'relevant') { sortColumn = 'helpfulness desc, review_date asc'; }

    const sqlReview = `SELECT reviews.review_id, product_id, rating, summary, recommend, body, review_date, helpfulness, response, name, photos.id, url \
      FROM reviews JOIN users ON users.user_id = reviews.reviewer_id \
      LEFT JOIN photos ON photos.review_id = reviews.review_id \
      WHERE product_id = ${product_id} AND reported = (0) ORDER BY ${sortColumn}`;

    db.connection.query(sqlReview, (error, reviews) => {
      if (error) { res.status(400).send(error); }

      //Slice results based on page & count params
      const totalReviews = reviews.length;
      if (count > totalReviews) { count = totalReviews; }

      let firstReview = 0;
      let lastReview = count;
      const lastPage = Math.floor(totalReviews / count);

      if (page * count > totalReviews) { page = lastPage; }
      if (page > 1) {
        firstReview = count * (page - 1);
        lastReview = count * page;
      }
      const selectedReviews = reviews.slice(firstReview, lastReview);

      //Build Reviews Objects
      const formattedReviews = [];
      let reviewObject = {};

      selectedReviews.forEach((review) => {
        const { review_id, rating, summary, response, body, review_date, name, helpfulness, id, url } = review;
        let { recommend } = review;
        recommend.toJSON().data[0] === 0 ? recommend = false : recommend = true;

        if (reviewObject['review_id'] !== review_id) { reviewObject = {}; }

        if (!reviewObject['review_id']) {
          reviewObject['review_id'] = review_id;
          reviewObject['rating'] = rating;
          reviewObject['summary'] = summary;
          reviewObject['recommend'] = recommend;
          reviewObject['response'] = response;
          reviewObject['body'] = body;
          reviewObject['date'] = review_date;
          reviewObject['reviewer_name'] = name;
          reviewObject['helpfulness'] = helpfulness;
          if (id) {
            reviewObject['photos'] = [ { id: id, url: url } ];
          } else {
            reviewObject['photos'] = [];
          }
          formattedReviews.push(reviewObject);
        } else {
          reviewObject['photos'] = reviewObject['photos'].concat([{ id: id, url: url }]);
        }
      });

      const responseObject = {
        product: product_id,
        page: page,
        count: count,
        results: formattedReviews
      };
      res.status(200).json(responseObject);
    });
  },

  addReview: (req, res) => {
    let { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.query;
    recommend === 'true' ? recommend = 1 : recommend = 0;
    characteristics = JSON.parse(characteristics);
    photos = JSON.parse(photos);

    let insertPhotos = false;
    if (photos.length > 0) { insertPhotos = true; }

    const charsValues = [
      [product_id, 'Size'],
      [product_id, 'Width'],
      [product_id, 'Comfort'],
      [product_id, 'Quality'],
      [product_id, 'Length'],
      [product_id, 'Fit']
    ];

    const sqlInsertUser = `INSERT INTO users (name, email) values ('${name}', '${email}') \
    ON DUPLICATE KEY UPDATE name='${name}', email='${email}'`;
    db.connection.query(sqlInsertUser, (error, results) => { //Insert new user
      if (error) { res.status(400).send(error); }

      const sqlGetUserId = `SELECT user_id FROM users WHERE name='${name}' LIMIT 1`;
      db.connection.query(sqlGetUserId, (error, userIdResult) => { //Get user_id
        if (error) { res.status(400).send(error); }

        const sqlInsertReview = `INSERT INTO reviews (product_id, rating, summary, recommend, body, response, reviewer_id) \
        VALUES (${product_id},${rating},${summary},${recommend},${body},null,${userIdResult[0].user_id})`;
        db.connection.query(sqlInsertReview, (error, insertReviewResult) => { //Insert review
          if (error) { res.status(400).send(error); }

          const newReviewId = insertReviewResult.insertId;

          const sqlInsertChars = 'INSERT INTO chars (product_id, name) VALUES ?';
          db.connection.query(sqlInsertChars, [charsValues], (error, charsResult) => { //Insert chars
            if (error) { res.status(400).send(error); }

            charId = charsResult.insertId;
            const charReviewsValues = [
              [charId, characteristics[131851], newReviewId],
              [charId + 1, characteristics[131852], newReviewId],
              [charId + 2, characteristics[131853], newReviewId],
              [charId + 3, characteristics[131854], newReviewId],
              [charId + 4, characteristics[131844], newReviewId],
              [charId + 5, characteristics[131847], newReviewId]
            ];

            const sqlInsertCharReviews = 'INSERT INTO char_reviews (char_id, value, review_id) VALUES ?';
            db.connection.query(sqlInsertCharReviews, [charReviewsValues], (error) => { //Insert chars
              if (error) { res.status(400).send(error); }

              if (insertPhotos) {
                const photoValues = photos.map((photo) => {
                  return [photo, newReviewId];
                });

                const sqlInsertPhotos = 'INSERT INTO photos (url, review_id) VALUES ?';
                db.connection.query(sqlInsertPhotos, [photoValues], (error) => { //Insert photos
                  if (error) { res.status(400).send(error); }
                  res.status(201).send();
                });
              } else {
                res.status(201).send();
              }
            });
          });
        });
      });
    });
  }
};
/* eslint-disable camelcase */
const db = require('../../database');

module.exports = {
  get: (req, res) => {
    let { page, count, sort, product_id } = req.query;

    if (!product_id) { res.status(400).send('Error: no product ID specified.'); }
    page = page || 1;
    count = count || 5;
    sort = sort || 'newest';

    let sortColumn = 'review_date asc';
    if (sort === 'helpful') { sortColumn = 'helpfulness desc'; }
    if (sort === 'relevant') { sortColumn = 'helpfulness desc, review_date asc'; }

    console.log('\nrequest parameters: ', req.query);
    console.log('page, sort, count: ', page, sort, count, '\n');

    // const sql = `SELECT review_id, product_id, rating, summary, recommend, body, review_date, helpfulness, response, name
    //   FROM reviews JOIN users ON users.user_id = reviews.reviewer_id
    //   WHERE product_id = ${product_id} AND reported = (0) ORDER BY ${sortColumn} LIMIT ${count}`;

    // const sql2 = `
    //   SELECT id, url FROM reviews
    //   INNER JOIN photos
    //   ON photos.review_id = reviews.review_id
    //   WHERE reviews.review_id = 5`;


    const sql = `
    SELECT review_id, product_id, rating, summary, recommend, body, review_date, helpfulness, response, name,
    FROM reviews JOIN users ON users.user_id = reviews.reviewer_id
    WHERE product_id = ${product_id} AND reported = (0) ORDER BY ${sortColumn} LIMIT ${count}`;

    // const sql2 = `
    //   SELECT id, url FROM reviews
    //   INNER JOIN photos
    //   ON photos.review_id = reviews.review_id
    //   WHERE reviews.review_id = 5`;

    // db.connection.query(sql, (error, results) => {
    //   if (error) {
    //     res.status(400).send(error);
    //   }

    //   console.log(results);

    //   res.status(200).json(results);

    // });


    db.connection.query(sql, (error, results) => {
      if (error) {
        res.status(400).send(error);
      }

      console.log(results);

      const reviews = results.map((result) => {
        const { review_id, rating, summary, response, body, review_date, helpfulness, name } = result;
        let { recommend } = result;
        recommend.toJSON().data[0] === 0 ? recommend = false : recommend = true;

        return {
          review_id: review_id,
          rating: rating,
          summary: summary,
          recommend: recommend,
          response: response ? response : '',
          body: body,
          date: review_date,
          reviewer_name: name,
          helpfulness: helpfulness,
          //photos: TODO
        };

      });

      const responseObject = {
        product: product_id,
        page: 0, //TODO
        count: count, //TODO
        results: reviews
      };

      res.status(200).json(responseObject);
    });
  }

};
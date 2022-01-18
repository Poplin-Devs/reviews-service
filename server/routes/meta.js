/* eslint-disable camelcase */
const db = require('../../database');

module.exports = {
  getMeta: (req, res) => {
    const { product_id } = req.query;

    const sqlRecommend = `SELECT recommend FROM reviews
      WHERE reviews.product_id = ${product_id}`;
    const getRecommendCount = () => {
      return new Promise((resolve, reject) => {
        db.connection.query(sqlRecommend, (error, recommends) => {
          if (error) { return reject(error); }

          let falseCounter = 0;
          let trueCounter = 0;
          recommends.forEach((recommend) => {
            recommend.recommend = 0 ? falseCounter++ : trueCounter++;
          });
          resolve({false: falseCounter, true: trueCounter});
        });
      });
    };

    const sqlRatings = `SELECT rating FROM reviews
      WHERE reviews.product_id = ${product_id}`;
    const buildRatings = () => {
      return new Promise((resolve, reject) => {
        db.connection.query(sqlRatings, (error, ratings) => {
          if (error) { return reject(error); }

          const ratingsObject = {};
          ratings.forEach(({rating}) => {
            if (!ratingsObject[rating]) {
              ratingsObject[rating] = 1;
            } else {
              ratingsObject[rating] = ratingsObject[rating] + 1;
            }
          });
          resolve(ratingsObject);
        });
      });
    };

    const sqlChararacteristics = `SELECT name, char_reviews.char_id, value
      FROM char_reviews
      INNER JOIN chars ON char_reviews.char_id = chars.char_id
      WHERE chars.product_id = ${product_id}`;
    const buildCharacteristics = () => {
      return new Promise((resolve, reject) => {
        db.connection.query(sqlChararacteristics, (error, characteristics) => {
          if (error) { return reject(error); }

          const charsObject = {};
          characteristics.forEach(({ name, char_id, value }) => {
            if (!charsObject[name]) {
              charsObject[name] = {
                id: char_id,
                value: value,
                count: 1
              };
            } else {
              charsObject[name] = {
                id: char_id,
                value: ((charsObject[name].value * charsObject[name].count + value) / (charsObject[name].count + 1)).toFixed(4),
                count: charsObject[name].count + 1
              };
            }
          });
          for (char in charsObject) {
            delete charsObject[char].count;
          }
          resolve(charsObject);
        });
      });
    };

    Promise.all([ buildRatings(), getRecommendCount(), buildCharacteristics()])
      .then(([ ratings, recommended, characteristics ]) => {

        res.status(200).json({
          product_id: product_id,
          ratings: ratings,
          recommended: recommended,
          characteristics: characteristics
        });
      })
      .catch((error) => {
        throw error;
      });
  }
};
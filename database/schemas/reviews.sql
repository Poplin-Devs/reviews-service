USE reviews_service;

-- Table 'reviews'

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `review_id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `product_id` MEDIUMINT DEFAULT NULL,
  `rating` TINYINT(1) DEFAULT NULL,
  `summary` VARCHAR(60) DEFAULT '',
  `recommend` bit(1) DEFAULT NULL,
  `body` VARCHAR(1000) DEFAULT '',
  `date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `helpfulness` MEDIUMINT NOT NULL DEFAULT 0,
  `reviewer_id` MEDIUMINT DEFAULT NULL,
  `reported` bit(1) NOT NULL DEFAULT 0,
  `response` VARCHAR(150) DEFAULT '',
  PRIMARY KEY (`review_id`)
);

DESCRIBE reviews;
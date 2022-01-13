USE reviews_service;

-- Table 'product_chars'

DROP TABLE IF EXISTS `char_reviews`;

CREATE TABLE `char_reviews` (
  `id` MEDIUMINT AUTO_INCREMENT,
  `char_id` MEDIUMINT NULL DEFAULT NULL,
  `review_id` MEDIUMINT NULL DEFAULT NULL,
  `value` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DESCRIBE char_reviews;
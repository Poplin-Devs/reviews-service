USE reviews_service;

-- Table 'product_chars'

DROP TABLE IF EXISTS `product_chars`;

CREATE TABLE `product_chars` (
  `product_id` MEDIUMINT NOT NULL,
  `fit_id` MEDIUMINT NULL DEFAULT NULL,
  `length_id` MEDIUMINT NULL DEFAULT NULL,
  `quality_id` MEDIUMINT NULL DEFAULT NULL,
  `comfort_id` MEDIUMINT NULL DEFAULT NULL,
  `width_id` MEDIUMINT NULL DEFAULT NULL,
  `size_id` MEDIUMINT NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`)
);

DESCRIBE product_chars;
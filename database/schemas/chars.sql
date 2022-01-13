-- Table 'char_values'

DROP TABLE IF EXISTS `chars`;

CREATE TABLE `chars` (
  `char_id` MEDIUMINT AUTO_INCREMENT,
  `product_id` MEDIUMINT,
  `name` VARCHAR(7) DEFAULT NULL,
  PRIMARY KEY (`char_id`)
);

DESCRIBE chars;
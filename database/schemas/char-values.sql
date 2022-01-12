-- Table 'char_values'

DROP TABLE IF EXISTS `char_values`;

CREATE TABLE `char_values` (
  `characteristic_id` MEDIUMINT AUTO_INCREMENT,
  `value` TINYINT(1) DEFAULT NULL,
  PRIMARY KEY (`characteristic_id`)
);

DESCRIBE char_values;
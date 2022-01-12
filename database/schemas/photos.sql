-- Table 'photos'

DROP TABLE IF EXISTS `photos`;

CREATE TABLE `photos` (
  `photo_id` MEDIUMINT AUTO_INCREMENT,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  `review_id` MEDIUMINT DEFAULT NULL,
  PRIMARY KEY (`photo_id`)
);

DESCRIBE photos;
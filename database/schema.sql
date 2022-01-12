-- Table 'reviews'

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `review_id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `product_id` MEDIUMINT NOT NULL,
  `rating` TINYINT(1) NOT NULL DEFAULT NULL,
  `summary` VARCHAR(60) NOT NULL DEFAULT '''',
  `recommend` bit(1) NOT NULL DEFAULT NULL,
  `body` VARCHAR(1000) NOT NULL DEFAULT 'NULL',
  `date` DATE NOT NULL DEFAULT 'CURRENT_DATE',
  `helpfulness` MEDIUMINT NOT NULL DEFAULT 0,
  `reviewer_id` INTEGER NULL DEFAULT NULL,
  `reported` bit(1) NOT NULL DEFAULT 0,
  `response` VARCHAR(150) NULL DEFAULT NULL,
  PRIMARY KEY (`review_id`)
);


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


-- Table 'char_values'

DROP TABLE IF EXISTS `char_values`;

CREATE TABLE `char_values` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `characteristic_id` MEDIUMINT NOT NULL DEFAULT NULL,
  `value` TINYINT(1) NOT NULL DEFAULT NULL,
  PRIMARY KEY (`characteristic_id`)
);

-- Table 'photos'

DROP TABLE IF EXISTS `photos`;

CREATE TABLE `photos` (
  `photo_id` MEDIUMINT NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  `review_id` MEDIUMINT NOT NULL DEFAULT NULL,
  PRIMARY KEY (`photo_id`)
);


-- Table 'users'

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` MEDIUMINT NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `name` VARCHAR(25) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`user_id`)
);


-- Foreign Keys

ALTER TABLE `reviews` ADD FOREIGN KEY (product_id) REFERENCES `product_chars` (`product_id`);
ALTER TABLE `reviews` ADD FOREIGN KEY (reviewer_id) REFERENCES `users` (`user_id`);
ALTER TABLE `product_chars` ADD FOREIGN KEY (fit_id) REFERENCES `char_values` (`characteristic_id`);
ALTER TABLE `product_chars` ADD FOREIGN KEY (length_id) REFERENCES `char_values` (`characteristic_id`);
ALTER TABLE `product_chars` ADD FOREIGN KEY (quality_id) REFERENCES `char_values` (`characteristic_id`);
ALTER TABLE `product_chars` ADD FOREIGN KEY (comfort_id) REFERENCES `char_values` (`characteristic_id`);
ALTER TABLE `product_chars` ADD FOREIGN KEY (width_id) REFERENCES `char_values` (`characteristic_id`);
ALTER TABLE `product_chars` ADD FOREIGN KEY (size_id) REFERENCES `char_values` (`characteristic_id`);
ALTER TABLE `photos` ADD FOREIGN KEY (review_id) REFERENCES `reviews` (`review_id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `reviews` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `product_chars` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `char_values` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `photos` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `reviews` (`review_id`,`product_id`,`rating`,`summary`,`recommend`,`body`,`date`,`helpfulness`,`reviewer_id`,`reported`,`response`) VALUES
-- ('','','','','','','','','','','');
-- INSERT INTO `product_chars` (`product_id`,`fit_id`,`length_id`,`quality_id`,`comfort_id`,`width_id`,`size_id`) VALUES
-- ('','','','','','','');
-- INSERT INTO `char_values` (`id`,`characteristic_id`,`value`) VALUES
-- ('','','');
-- INSERT INTO `photos` (`photo_id`,`url`,`review_id`) VALUES
-- ('','','');
-- INSERT INTO `users` (`user_id`,`name`,`email`) VALUES
-- ('','','');
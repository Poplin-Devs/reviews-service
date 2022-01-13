-- Add Foreign Keys

ALTER TABLE `reviews` ADD FOREIGN KEY (reviewer_id) REFERENCES `users` (`user_id`);
ALTER TABLE `char_reviews` ADD FOREIGN KEY (char_id) REFERENCES `chars` (`char_id`);
ALTER TABLE `char_reviews` ADD FOREIGN KEY (review_id) REFERENCES `reviews` (`review_id`);
ALTER TABLE `photos` ADD FOREIGN KEY (review_id) REFERENCES `reviews` (`review_id`);

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
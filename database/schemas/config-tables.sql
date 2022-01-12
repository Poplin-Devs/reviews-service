-- Add Foreign Keys

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
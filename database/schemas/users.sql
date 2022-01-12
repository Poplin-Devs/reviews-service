-- Table 'users'

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` MEDIUMINT AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`user_id`)
);

DESCRIBE users;
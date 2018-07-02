SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `bounty`;
CREATE TABLE `bounty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_address` varchar(255) NOT NULL,
  `tx_id` varchar(255) NOT NULL,
  `token_value` int(11) DEFAULT '120',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


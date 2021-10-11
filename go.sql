SET
  NAMES utf8mb4;
SET
  FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `uid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `nick` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `score` bigint(16) NOT NULL,
    `slogan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `verify` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `jointime` bigint(16) NOT NULL,
    `lastlog` bigint(16) NOT NULL,
    `bannedto` bigint(16) NOT NULL,
    `likesgain` bigint(16) NOT NULL,
    `postsnum` bigint(16) NOT NULL,
    `followingnum` bigint(16) NOT NULL,
    `followersnum` bigint(16) NOT NULL,
    PRIMARY KEY (`uid`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
DROP TABLE IF EXISTS `userdata`;
CREATE TABLE `userdata` (
    `uid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `likes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `posts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `stars` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `following` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `followers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`uid`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
    `id` bigint(16) unsigned NOT NULL AUTO_INCREMENT,
    `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `time` bigint(16) NOT NULL,
    `category` bigint(16) unsigned NOT NULL,
    `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `view` bigint(16) unsigned NOT NULL,
    `like` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `likeNum` bigint(16) unsigned NOT NULL,
    `unlike` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `commentsNum` bigint(16) unsigned NOT NULL,
    `starNum` bigint(16) unsigned NOT NULL,
    `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
    `id` bigint(16) unsigned NOT NULL AUTO_INCREMENT,
    `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `inpost` bigint(16) unsigned NOT NULL,
    `tocomment` bigint(16) unsigned NOT NULL,
    `text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `time` bigint(16) NOT NULL,
    `like` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `likeNum` bigint(16) unsigned NOT NULL,
    `unlike` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `starNum` bigint(16) unsigned NOT NULL,
    `replysNum` bigint(16) unsigned NOT NULL,
    `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
    `id` bigint(16) unsigned NOT NULL,
    `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
    `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `friendlyname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `checkpost` tinyint(1) NOT NULL,
    `checkcomment` tinyint(1) NOT NULL,
    `checkreport` tinyint(1) NOT NULL,
    `admin` tinyint(1) NOT NULL,
    PRIMARY KEY (`name`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
INSERT INTO
  `roles`
VALUES
  ('default', '普通用户', 0, 0, 0, 0);
INSERT INTO
  `roles`
VALUES
  ('notlogged', '未登录用户', 0, 0, 0, 0);
INSERT INTO
  `roles`
VALUES
  ('volunteer', '社区志愿者', 1, 1, 1, 0);
INSERT INTO
  `roles`
VALUES
  ('editor', '社区编辑', 1, 1, 1, 0);
INSERT INTO
  `roles`
VALUES
  ('admin', '管理员', 1, 1, 1, 1);
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
    `repid` bigint(16) unsigned NOT NULL AUTO_INCREMENT,
    `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `oriid` bigint(16) unsigned NOT NULL,
    `time` bigint(16) NOT NULL,
    `word` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`repid`)
  ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
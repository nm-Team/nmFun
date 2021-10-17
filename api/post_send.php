<?php
require_once("./log.php");

login();

$db = new CodyMySQL(sqlHost, sqlPort, sqlUser, sqlPass, sqlDaBa);
$time = time();
$text = mysqli_real_escape_string($db->mysql, addslashes($_POST['text']));
$media = json_decode(mysqli_real_escape_string($db->mysql, addslashes($_POST['media'])));
$category = intval(mysqli_real_escape_string($db->mysql, addslashes($_POST['category'])));
$tags = mysqli_real_escape_string($db->mysql, addslashes($_POST['tags']));
// 判断是否需要审核
if (!postCheck || role['checkpost'] == 1) {
    $newPostSta = 0;
} else {
    $newPostSta = 1;
}
// 判断media为空值的情况下，text不能为空值
if (is_null($text)) {
    if (!is_null($media)) $text = "发布乐子";
    else ret("error", -1);
}
// 保存base64的文件
for ($i = 0; $i < count($media); $i++) {
    if (strstr($media[$i][1], "base64")) {
        fileSave($media[$i][1], "postmedia", "post");
    }
}
if (!isset($category) || !is_int($category)) ret("error", -2);
$postToSend = array(
    "uid" => UID,
    "text" => $text,
    "media" => $media,
    "time" => $time,
    "category" => $category,
    "tags" => $tags,
    "view" => 0,
    "like" => "",
    "likeNum" => 0,
    "unlike" => "",
    "commentsNum" => 0,
    "starNum" => 0,
    "status" => $newPostSta,
);
$newPostId = $db->insert($postToSend, 'posts');

ret("success", "0", array("newPostStatus" => $newPostSta));

<?php
require_once("./log.php");
// 获取参数
$toFollow = $_GET['toFollow'];
login();

header("Content-type:application/json;charset=utf-8");

if (!$toFollow) ret("error", "未指定关注对象");

$sql = "SELECT `following` FROM `userdata` WHERE `uid` = '" . addslashes(UID) . "'";
$myFollowing = $db->getrow($sql)['following'];
$sql = "SELECT `followers` FROM `userdata` WHERE `uid` = '" . addslashes($toFollow) . "'";
$hisFollowers = $db->getrow($sql)['followers'];
// echo "my" . $myFollowing . "his" . $hisFollowers;

if (checkFollow($toFollow) === true) {
    // 已关注，取消关注
    // 在对方的粉丝列表删掉自己，自己的关注列表删掉对方
    $hisFollowers = str_replace(UID . ",", "", $hisFollowers);
    $myFollowing = str_replace($toFollow . ",", "", $myFollowing);
    $newFollowSta = false;
} else {
    // 未关注，立即关注
    $hisFollowers = UID . "," . $hisFollowers;
    $myFollowing = $toFollow . "," . $myFollowing;
    $newFollowSta = true;
}
// 存入数据库
$db->update(array("following" => addslashes($myFollowing)), 'userdata', "`uid`='" . UID . "'");
$db->update(array("followers" => addslashes($hisFollowers)), 'userdata', "`uid`='" . addslashes($toFollow) . "'");

ret("success", ($newFollowSta ? "" : "取消") . "关注成功", array("newFollowStatus" => $newFollowSta));

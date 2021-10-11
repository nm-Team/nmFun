<?php

// 获取文章信息
function getInfoOfPost($id)
{
    $db = new CodyMySQL(sqlHost, sqlPort, sqlUser, sqlPass, sqlDaBa);
    $sql = "SELECT * FROM `posts` WHERE `id` = " . addslashes($id) . "";
    $result = $db->getrow($sql);
    if ($result['id'] != $id) return array("code" => 404);
    $sql = "SELECT `nick`, `avatar` FROM `users` WHERE `uid` = '" . addslashes($result['uid']) . "'";
    $uresult = $db->getrow($sql);
    // 得到分类名 
    $sql = "SELECT `name` FROM `category` WHERE `id` = '" . addslashes($result['category']) . "'";
    $categoryName = $db->getrow($sql)['name'];
    // 检查本人是否赞、踩过
    if (checkMyOption(addslashes($result['like']))) $myOption = "like";
    else if (checkMyOption(addslashes($result['unlike']))) $myOption = "unlike";
    else $myOption = "none";
    $return = array(
        "code" => 200,
        "id" => addslashes($result['id']),
        "type" => "post",
        "author" => array("uid" => $result['uid'], "nick" => $uresult['nick'], "avatar" => $uresult['avatar']),
        "text" => addslashes($result['text']),
        "media" => addslashes($result['media']),
        "time" => addslashes($result['time']),
        "category" => addslashes($result['category']),
        "categoryName" => addslashes($categoryName),
        "tags" => addslashes($result['tags']),
        "view" => addslashes($result['view']),
        "likeNum" => addslashes($result['likeNum']),
        "commentsNum" => addslashes($result['commentsNum']),
        "myOption" => $myOption,
        "status" => addslashes($result['status']),
    );
    if ($result['status'] == 0 || role['checkpost'] == 1) return $return;
    else return array("code" => 403, "id" => $result['id']);
}

function checkMyOption($str)
{
    if (!UID) return false;
    $arr = explode(",", $str);
    foreach ($arr as $key => $value) {
        if ($value == UID) return true;
    }
    return false;
}

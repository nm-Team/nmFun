<?php
require_once("../config.php");
require_once("./functions.php");
require_once("./mysql.php");

header("Content-type:application/json;charset=utf-8");

$logged = false;

function login($force = true)
{
    $db = new CodyMySQL(sqlHost, sqlPort, sqlUser, sqlPass, sqlDaBa);
    // 获取sessionid
    $sessionid = $_GET['sessionid'];
    // 如果没有获取到
    if (!$sessionid) {
        if ($force) ret("error", "您没有登录，请先登录！");
        else {
            define("infos", null);
            define("UID", null);
        }
    }
    $logstatus = json_decode(curl_post(accountServer . "?CodySESSION=" . $sessionid, array()));
    if ($logstatus->status == "error") {
        if ($force) ret("error", "登录状态错误，请重新登录！");
        else {
            define("infos", null);
            define("UID", null);
        }
    } else {
        // 例行数据库连接来更新用户信息
        $sql = "SELECT * FROM `users` WHERE `uid` = '" . addslashes($logstatus->info->uid) . "'";
        $res = $db->getrow($sql);
        if (!$res) {
            $uinfo = array(
                "uid" => addslashes($logstatus->info->uid),
                "nick" => addslashes($logstatus->info->nick),
                "avatar" => addslashes($logstatus->info->avatar),
                "role" => "default",
                "score" => 0,
                "slogan" => "这个人什么都没写，生怕别人找他乐子",
                "jointime" => time(),
                "lastlog" => time(),
                "likesgain" => 0,
                "postsnum" => 0,
                "followingnum" => 0,
                "followersnum" => 0
            );
            $db->insert($uinfo, 'users');
            // 初始化列表数据库
            $udata = array(
                "uid" => addslashes($logstatus->info->uid),
                "likes" => "",
                "posts" => "",
                "stars" => "",
                "comments" => "",
                "following" => "",
                "followers" => "",
            );
            $db->insert($udata, 'userdata');
        } else {
            $uinfo = array(
                "nick" => addslashes($logstatus->info->nick),
                "avatar" => addslashes($logstatus->info->avatar),
                "lastlog" => time()
            );
            $db->update($uinfo, 'users', "`uid`='" . addslashes($logstatus->info->uid) . "'");
        }
        // 重新获取用户信息供使用
        $sql = "SELECT * FROM `users` WHERE `uid` = '" . addslashes($logstatus->info->uid) . "'";
        define("infos", $db->getrow($sql));
        define("UID", $logstatus->info->uid);
        $logged = true;
    }
    // 获取权限

    if ($logged) {
        $roleName = infos['role'];
    } else {
        $roleName = "notlogged";
    }
    $sql = "SELECT * FROM `roles` WHERE `name` = '" . addslashes($roleName) . "'";
    define("role", $db->getrow($sql));
    return $logged;
}

<?php

// 获取关注状态
function checkFollow($id)
{
    // 做关注列表和粉丝列表双向的确认，只要发现一个已关注就返回true，这样如果出现问题，通过关注按钮就可以成功返回未关注的状态
    // 获取 id的粉丝/关注列表
    $db = new CodyMySQL(sqlHost, sqlPort, sqlUser, sqlPass, sqlDaBa);
    $sql = "SELECT `following` FROM `userdata` WHERE `uid` = '" . addslashes(UID) . "'";
    $myFollowing = $db->getrow($sql)['following'];
    $myFollowingArray = explode(",", $myFollowing);
    for ($i = 0; $i < count($myFollowingArray); $i++) {
        if ($myFollowingArray[$i] == $id) {
            return true;
        }
    }
    $sql = "SELECT `followers` FROM `userdata` WHERE `uid` = '" . addslashes($id) . "'";
    $hisFollowers = $db->getrow($sql)['followers'];
    $hisFollowersArray = explode(",", $hisFollowers);
    for ($i = 0; $i < count($hisFollowersArray); $i++) {
        // echo $hisFollowersArray[$i];
        if ($hisFollowersArray[$i] == UID) {
            return true;
        }
    }
    return false;
}

function getCategoryList()
{
    $db = new CodyMySQL(sqlHost, sqlPort, sqlUser, sqlPass, sqlDaBa);
    $sql = "SELECT * FROM `category` ";
    return $db->get($sql);
}

function curl_post($url, $data = array(), $header = NULL)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);

    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    if ($header != NULL) {
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    }
    $ret = curl_exec($curl);
    curl_close($curl);
    return $ret;
}

function fileSave($base64, $pathRoot, $pathTag)
{
    $base64_body = substr(strstr($base64, ','), 1);
    $file = base64_decode($base64_body);
    $ftype = strtolower(explode(";", explode("/", $base64)[1])[0]);
    // 验证格式
    for ($i = 0; $i < count(mediaEnabled); $i++) {
        for ($j = 0; $j < count(mediaEnabled[$i][0]); $j++) {
            if (strtolower($ftype) == strtolower(mediaEnabled[$i][0][$j])) {
                $path = "/uploads/" . $pathRoot . (isset($pathRoot) ? "/" : "") . date("Y", time()) . "/" . date("m", time());
                if (!file_exists(".." . $path)) {
                    mkdir(".." . $path, 0777, true);
                }
                // 计算文件大小
                $fileSize = strlen(file_get_contents($base64)) / 1024;
                if ($fileSize > mediaEnabled[$i][1]) ret("error", "文件大小过大，请压缩后上传");
                $fname = date("Y-m-d-H-i-s", time()) . getRandomStr(16) . (isset($pathTag) ? "_" : "") . $pathTag . "." . $ftype;
                file_put_contents(".." . $path . "/" . $fname, $file);
                return siteURL . $path . "/" . $fname;
            }
        }
    }
    ret("error", "提供的文件格式不正确。");
}

function ret($status = "success", $info = NULL, $other = array())
{
    die(json_encode(array("status" => $status, "info" => $info) + $other));
}

function getRandomStr($len, $special = false)
{
    $chars = array(
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
        "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
        "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G",
        "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
        "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2",
        "3", "4", "5", "6", "7", "8", "9"
    );

    if ($special) {
        $chars = array_merge($chars, array(
            "!", "@", "#", "$", "?", "|", "{", "/", ":", ";",
            "%", "^", "&", "*", "(", ")", "-", "_", "[", "]",
            "}", "<", ">", "~", "+", "=", ",", "."
        ));
    }

    $charsLen = count($chars) - 1;
    shuffle($chars); //打乱数组顺序
    $str = '';
    for ($i = 0; $i < $len; $i++) {
        $str .= $chars[mt_rand(0, $charsLen)]; //随机取出一位
    }
    return $str;
}

function cleanHTMLTag($text)
{
    $text = preg_replace("/<[\/\s]*(?:(?!div|br)[^>]*)>/", '', $text);
    $text = preg_replace("/<\s*div[^>]*>/", '<div>', $text);
    $text = preg_replace("/<\s*div[^>]*>/", '<div>', $text);
    $text = preg_replace("/<[\/\s]*div[^>]*>/", '<br>', $text);
    $text = preg_replace("/<br><br>/", '<br>', $text);
    return $text;
}

<?php
require_once("./post.php");
require_once("./log.php");

$id = intval($_POST['id']);
login(false);
header("Content-type:application/json;charset=utf-8");

if (!is_int($id)) ret("error", "未指定id");

ret("success", getInfoOfPost($id));

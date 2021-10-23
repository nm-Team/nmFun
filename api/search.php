<?php

require_once("./post.php");
require_once("./log.php");

login(false);
header("Content-type:application/json;charset=utf-8");
$filter = addslashes($_POST['filter']);
$sort = addslashes($_POST['sort']);
$from = addslashes($_POST['from']);
$to = addslashes($_POST['to']);

print_r($keyWords);
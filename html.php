<?php
require_once("./config.php");
if (forceHttps && (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] == 'off')) {
    Header("HTTP/1.1 301 Moved Permanently");
    header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
}

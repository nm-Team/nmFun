<?php
require_once("./log.php");
header("Content-type:text/html;charset=utf-8");
if (login(true)) echo "<script>parent.closeLogFrame();localStorage.setItem('sessionid','" . $_GET['sessionid'] . "');parent.setHeaderLog(); parent.newMsgBox('登录成功！您可能需要刷新页面才能继续操作');</script><center>加载中...</center>";

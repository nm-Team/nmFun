<?php
require("./config.php");
require("./html.php");
require("./config_index.php");
?>
<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <title>继续</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
    <meta name='apple-mobile-web-app-capable' content='yes'>
    <meta name='apple-mobile-web-app-status-bar-style' content='black'>
    <meta name='format-detection' content='telephone=no'>
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/jumpurl.css">
    <script>
        siteURL = "<?php echo siteURL; ?>";
        accountClient = "<?php echo accountClient; ?>";
        mySettings = {
            "zone": <?php echo zone; ?>
        };
    </script>
</head>

<body>
    <div class="main">
        <p><svg t="1626058910501" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2399"><path d="M512 128C299.912533 128 128 299.963733 128 512.017067S299.912533 896 512 896s384-171.912533 384-383.982933C896 299.963733 724.087467 128 512 128z m39.185067 597.6064c0 7.3728-5.973333 13.346133-13.346134 13.346133h-51.643733a13.346133 13.346133 0 0 1-13.346133-13.346133V477.610667c0-7.3728 5.973333-13.346133 13.346133-13.346134h51.643733c7.3728 0 13.346133 5.973333 13.346134 13.346134v247.995733zM511.675733 408.917333c-25.2928 0-46.267733-20.974933-46.267733-46.882133s20.974933-46.267733 46.267733-46.267733c25.924267 0 46.882133 20.343467 46.882134 46.267733s-20.974933 46.882133-46.882134 46.882133z" fill="#1890ff" p-id="2400"></path></svg></p>
        <h1 class="title">继续</h1>
        <p class="tip">即将跳转到此网页。若这不是 nmTeam 官方页面，nmTeam 将不会为此负责。</p>
        <p class="url" id="url"></p>
        <button id="jumpbutton" class="jumpbutton">继续访问</button>
    </div>

    <script src="<?php echo siteURL; ?>/src/js/jquery.min.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/jumpurl.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/main.js"></script>
</body>

</html>
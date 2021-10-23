<?php
require("./config.php");
require("./html.php");
require("./config_index.php");
require("./api/mysql.php");
require("./api/functions.php");
?>
<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <title><?php echo siteName; ?></title>
    <meta name="keywords" content="<?php echo siteKeyword; ?>" />
    <meta name="description" content="<?php echo siteIntro; ?>" />
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0'>
    <meta name='apple-mobile-web-app-capable' content='yes'>
    <meta name='apple-mobile-web-app-status-bar-style' content='black'>
    <meta name='format-detection' content='telephone=no'>
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/header.css">
    <link rel="manifest" href="<?php echo siteURL; ?>/src/json/manifest.json">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="<?php echo siteURL; ?>/src/img/icon-files/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="<?php echo siteURL; ?>/src/img/icon-files/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo siteURL; ?>/src/img/icon-files/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon-precomposed" href="<?php echo siteURL; ?>/src/img/icon-files/apple-touch-icon-57x57.png">
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/page.css">
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/card.css">
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/left.css">
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/post.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.cncn3.cn/webstatic/0b179cec2c0ed/swiper-bundle.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/viewer.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo siteURL; ?>/src/css/index.css">
    <script>
        siteURL = "<?php echo siteURL; ?>";
        accountClient = "<?php echo accountClient; ?>";
        mySettings = {
            "zone": <?php echo zone; ?>
        };
        categoryList = [
            <?php
            $cList = getCategoryList();
            for ($i = 0; $i < count($cList); $i++) {
                echo '[' . $cList[$i]['id'] . ', `' . $cList[$i]['name'] . '`], ';
            }
            ?>
        ];
    </script>
</head>

<body>
    <div id="hcont" noselect>
        <div class="placeHolder"></div>
        <div class="header" id="pageHeader">
            <div class="left" onclick="headerClick();" tabindex="">
                <i class="logo" style="background-image: url('<?php echo siteLogo; ?>');"></i>
                <p class="name"><?php echo siteName; ?></p>
            </div>
            <div class="right" onclick='pageHeader.removeAttribute("open");'>
                <div class="links">
                    <?php
                    for ($i = 0; $i < count($header); $i++) {
                        echo '<button onclick="' . $header[$i][1] . '">' . $header[$i][0] . '</button>';
                    }
                    ?>
                </div>
                <div class="accountBox" id="accountBox" tabindex="0" title="点击来登录或管理您的账号" onmouseover="myMenu(true);" onkeydown="divClick(this, event)">
                    <i id="avatarBox"></i>
                    <p id="userName">正在加载</p>
                </div>
            </div>
        </div>
    </div>
    <div id="myMenuContainer">
        <div id="myContextMenu" class="contextMenu" onclick="myMenu(false)" icon="true">
            <button onclick="userInfo(myUid)"><i class="material-icons">account_circle</i>个人页面</button>
            <div class="line"></div><button onclick="window.open(accountClient+'/info.html?sessionid='+localStorage.sessionid);"><i class="material-icons"></i>nmTeam Account Center</button>
            <button onclick="alert('确定要注销账号吗？','注销','是','localStorage.sessionid=``;window.location.href=``;','取消')"><i class="material-icons"></i>注销账号</button>
        </div>
    </div>
    <div class="bodyMain" id="bodyMain" thin>
        <div class="pageLeft" id="pageLeft" show noani="true">
            <div class="indexFrame leftBox box" id="indexFrame" con="on" noani>
                <div class="mobileHolder"></div>
                <!-- Swiper，即轮播图 -->
                <div class="swiper-container indexSwiper" style="<?php ($swiper ? "" : "display:none") ?>">
                    <div class="swiper-wrapper">
                        <?php
                        if ($swiper) {
                            for ($i = 0; $i < count(($swiperItems)); $i++) {
                                echo '<div class="swiper-slide" onclick="' . $swiperItems[$i][2] . '"style="' . $swiperItems[$i][0] . '">' . $swiperItems[$i][1] . '</div>';
                            }
                        }
                        ?>
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                </div>
                <div class="typeContainer" noselect>
                    <div class="typeSelecter" id="indexTypeSelecter">
                        <?php
                        for ($i = 0; $i < count(($types)); $i++) {
                            echo '<label for="indexType_' . $types[$i][1] . '"><input id="indexType_' . $types[$i][1] . '" onclick="indexSwitchType(`' . $types[$i][1] . '`);" type="radio" name="indexType"><span>' . $types[$i][0] . '</span></label>';
                        }
                        ?>
                    </div>
                </div>
                <div id="indexMainCards" class="equalPages">
                    <div class="page cardBox postCardBox">
                    </div>
                </div>
            </div>
        </div>
        <div class="widthChanger" id="widthChanger" draggable="true"></div>
        <div class="pageRight" id="pageRight" open noani="true">

        </div>
    </div>
    <div class="coverWithColor" id="logCover" hidden></div>
    <div id="logPop" style="z-index: 1004;" class="popFrame browserFrame specialBrowserFrame" open="false">
        <header>
            <div class="left">
                <div class="nameDiv">
                    <p class="title">登录</p>
                    <p class="little">通过 nmTeam Account Center</p>
                </div>
            </div>
            <div class="right">
                <button onclick="closeLogFrame()"><i class="material-icons">keyboard_arrow_down</i></button>
            </div>
        </header>
        <div class="content">
            <iframe id="logIframe"></iframe>
        </div>
    </div>
    <div class="coverWithColor" id="sendEditBoxCover" hidden></div>
    <div id="sendEdit" class="popFrame" open="false">
        <header>
            <div class="left">
                <button onclick="showPostInput('send',false)"><i class="material-icons">keyboard_arrow_down</i></button>
                <div class="nameDiv">
                    <p class="title">发帖</p>
                    <p class="little"></p>
                </div>
            </div>
            <div class="right">
                <button onclick="sendPost(sendEditBox,'post',function(){showPostInput('send',false);newMsgBox('帖子发送成功！');setPostInputArea(sendEditBox, 'post');})"><i class="material-icons">send</i></button>
            </div>
        </header>
        <div class="content" id="sendEditBox">
        </div>
    </div>
    <div class="coverWithColor" id="commentEditBoxCover" hidden></div>
    <div id="commentEdit" class="popFrame" open="false">
        <header>
            <div class="left">
                <button onclick="showPostInput('comment',false)"><i class="material-icons">keyboard_arrow_down</i></button>
                <div class="nameDiv">
                    <p class="title">回复</p>
                    <p class="little"></p>
                </div>
            </div>
            <div class="right">
                <button onclick="sendPost(commentEditBox,'comment',function(){showPostInput('comment',false);newMsgBox('回复发送成功！');setPostInputArea(commentEditBox, 'comment');})"><i class="material-icons">send</i></button>
            </div>
        </header>
        <div class="content" id="commentEditBox">
        </div>
    </div>
    <div id="sendCover" noselect>
        <div class="content">
            <i></i>
            <p>正在发送</p>
        </div>
    </div>
    <script src="<?php echo siteURL; ?>/src/js/jquery.min.js"></script>
    <script src="https://cdn.cncn3.cn/webstatic/d1e2b36ce909e/swiper-bundle.min.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/main.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/content.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/user.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/index.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/viewer.min.js"></script>
    <script src="<?php echo accountClient; ?>/src/js/getinfo.js" onerror="newMsgBox('账号服务器连接失败')"></script>
    <script src="<?php echo siteURL; ?>/src/js/accounts.js"></script>
    <script src="<?php echo siteURL; ?>/src/js/browser.js"></script>
</body>

</html>
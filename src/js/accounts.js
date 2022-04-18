logScript = document.createElement("script");
logScript.setAttribute("src", accountClient + "/src/js/getinfo.js");
logScript.setAttribute("onerror", "newMsgBox('无法连接到账号服务器。');writeLog('e', 'accounts.js', 'log js load fail');");
document.body.appendChild(logScript);

// 登录账户
myUid = NaN;
function setLog() {
    returnWord = "";
    document.cookie = "sessionid=" + localStorage.sessionid + ";domain=" + siteURL.split("/")[2];
    try {
        getInfo(function () {
            accountInfo = returnWord;
            if (accountInfo == -1 || accountInfo == -2) {
                userName.innerHTML = "登录";
                myPageNick.innerHTML = "点击登录";
                toUserPageBut.setAttribute("onclick", "showLogFrame()");
                myPageMoreTags.setAttribute("data-show", "false");
                myPageAccounteditBut.setAttribute("data-show", "false");
            }
            else {
                avatarBox.setAttribute("style", "background-image:url(" + accountInfo['avatar'] + ")");
                myPageAvatar.setAttribute("style", "background-image:url(" + accountInfo['avatar'] + ")");
                userName.innerHTML = accountInfo['nick'];
                myPageNick.innerHTML = accountInfo['nick'];
                myPageInfoPTag.innerHTML = "@" + accountInfo['user'] + "&nbsp;&nbsp;UID: " + accountInfo['uid'];
                myUid = accountInfo['uid'];
                myInfos = accountInfo;
                toUserPageBut.setAttribute("onclick", "newUserInfoPage('" + accountInfo['uid'] + "', '" + accountInfo['nick'] + "');");
                myPageMoreTags.setAttribute("data-show", "true");
                myPageAccounteditBut.setAttribute("data-show", "true");
                myPageMoreTags.innerHTML = `
                <button class="myPageMoreButton" onclick="if(!newUserInfoPage('${accountInfo['uid']}', '${accountInfo['nick']}'));uPage_${myUid}_s_posts.click();">
                    <p class="top"><span data-posts-num-uid="${myUid}"><span class="skeleton" style="padding-right: 1em"></span></span></p>
                    <p class="bottom">帖子</p>
                </button>
                <button class="myPageMoreButton" onclick="showUserFollowListPage(${myUid},'${accountInfo['nick']}','followings');">
                    <p class="top"><span data-following-num-uid="${myUid}"><span class="skeleton" style="padding-right: 1em"></span></span></p>
                    <p class="bottom">关注</p>
                </button>
                <button class="myPageMoreButton" onclick="showUserFollowListPage(${myUid},'${accountInfo['nick']}','followers');">
                    <p class="top"><span data-followers-num-uid="${myUid}"><span class="skeleton" style="padding-right: 1em"></span></span></p>
                    <p class="bottom">粉丝</p>
                </button>
                `;
                $("#myBlockDisplay").attr("data-disabled-uid", myUid);
                $("#myPointDisplay").attr("data-show", "true");
                $("#myActions").attr("data-show", "true");
                $("#myBlockTime").attr("data-disabled-time-uid", myUid);
                writeLog("i", "setLog", "log success, sessionid " + localStorage.sessionid + ", " + JSON.stringify(accountInfo));
            };
            refreshUserInfoArea(myUid);
        });
    }
    catch (err) {
        console.error("getInfo 执行错误，返回错误信息" + err);
        userName.innerHTML = "错误";
        myPageNick.innerHTML = "无法连接服务器";
        myPageInfoPTag.innerHTML = "请刷新后重试";
        accMain.setAttribute("onclick", "alert('无法连接到服务器，请刷新页面后重试。');");
        writeLog("i", "setLog", "log fail: sessionid " + localStorage.sessionid + ", " + err);
    }
}

function logInit() {
    $.ajax({
        type: "GET",
        url: backEndURL + "/user/init.php?CodySESSION=" + localStorage.sessionid,
        async: false,
        data: {},
        dataType: "json",
        success: function (response, status, request) {
            console.log("Log init to BE Succeed");
            if (response['status'] == "error" && response['info'] != "Already login.") {
                newMsgBox("登录验证失败，因为：" + response['info']);
                writeLog("e", "logInit", JSON.stringify(response));
            } else
                writeLog("i", "logInit", JSON.stringify(response));
        }
    });
}

function showLogFrame() {
    logPop.setAttribute("open", "true");
    logCover.setAttribute("open", "");
    logIframe.setAttribute("src", accountClient + "/?name=nmFun&msg=登录nmFun，一起看乐子&returnto=" + siteURL + "/logverify.html");
    writeLog("i", "showLogFrame");
    pushHistory("");
    setPopScale();
}

function closeLogFrame() {
    logPop.setAttribute("open", "false");
    logCover.removeAttribute("open");
    logIframe.setAttribute("src", "about:blank");
    writeLog("i", "closeLogFrame");
    pushHistory("");
    setPopScale();
}

function logOut() {
    localStorage.sessionid = "";
    document.cookie = "PHPSESSID=;expires=01-Dec-2006 01:14:26 GMT;domain=" + siteURL.split("/")[2];
    document.cookie = "PHPSESSID=;expires=01-Dec-2006 01:14:26 GMT;domain=" + accountClient.split("/")[2];
    document.cookie = "sessionid=;expires=01-Dec-2006 01:14:26 GMT;domain=" + siteURL.split("/")[2];
    document.cookie = "sessionid=;expires=01-Dec-2006 01:14:26 GMT;domain=" + accountClient.split("/")[2];
    writeLog("i", "logOut", "success");
}
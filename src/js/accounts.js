logScript = document.createElement("script");
logScript.setAttribute("src", accountClient + "/src/js/getinfo.js");
logScript.setAttribute("onerror", "newMsgBox('无法连接到账号服务器。');writeLog('e', 'accounts.js', 'log js load fail');");
document.body.appendChild(logScript);

// 登录账户
myUid = NaN;
function setHeaderLog() {
    returnWord = "";
    document.cookie = "PHPSESSID=" + localStorage.sessionid + ";domain=" + siteURL.split("/")[2];
    try {
        getInfo(function () {
            accountInfo = returnWord;
            accountBox.setAttribute("onclick", "showLogFrame()");
            if (accountInfo == -1 || accountInfo == -2) {
                userName.innerHTML = "登录";
                accountBox.setAttribute("onclick", "showLogFrame()");
            }
            else {
                avatarBox.setAttribute("style", "background-image:url(" + accountInfo['avatar'] + ")");
                userName.innerHTML = accountInfo['nick'];
                accountBox.setAttribute("onclick", "myMenu(true);");
                myUid = accountInfo['uid'];
                myInfos = accountInfo;
                writeLog("i", "setHeaderLog", "log success, sessionid " + localStorage.sessionid + ", " + JSON.stringify(accountInfo));
            }
        });
    }
    catch (err) {
        console.error("getInfo 执行错误，返回错误信息" + err);
        userName.innerHTML = "错误";
        accountBox.setAttribute("onclick", "newMsgBox('无法连接到登录服务器，因此无法打开此上下文菜单。');");
        writeLog("i", "setHeaderLog", "log fail: sessionid " + localStorage.sessionid + ", " + err);
    }
}

function showLogFrame() {
    logPop.setAttribute("open", "true");
    logCover.setAttribute("open", "");
    logIframe.setAttribute("src", accountClient + "/?name=nmFun&msg=登录nmFun，一起看乐子&returnto=" + siteURL + "/logverify.html");
    writeLog("i", "showLogFrame");
}

function closeLogFrame() {
    logPop.setAttribute("open", "false");
    logCover.removeAttribute("open");
    logIframe.setAttribute("src", "about:blank");
    writeLog("i", "closeLogFrame");
}

// "我的"菜单
myMenuOpe = false;
function myMenu(to) {
    if (to == true && !isNaN(myUid)) myMenuContainer.className = " open";
    else myMenuContainer.className = "";
    myMenuOpe = false;
    setTimeout(() => {
        myMenuOpe = to;
    }, 500);
}

function logOut() {
    localStorage.sessionid = "";
    document.cookie = "PHPSESSID=;expires=01-Dec-2006 01:14:26 GMT;domain=" + siteURL.split("/")[2];
    document.cookie = "PHPSESSID=;expires=01-Dec-2006 01:14:26 GMT;domain=" + accountClient.split("/")[2];
    writeLog("i", "logOut", "success");
}

$("*").click(function () { if (myMenuOpe) myMenu(false) });

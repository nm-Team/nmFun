// 登录账户
myUid = NaN;
function setHeaderLog() {
    returnWord = "";
    document.cookie = "PHPSESSID=" + localStorage.sessionid;
    try {
        getInfo(function () {
            accountInfo = returnWord;
            accountBox.setAttribute("onclick", "showLogFrame()");
            if (accountInfo == -1) {
                userName.innerHTML = "登录";
                accountBox.setAttribute("onclick", "showLogFrame()");
            }
            else if (accountInfo == -2) {
                userName.innerHTML = "登录";
                accountBox.setAttribute("onclick", "showLogFrame()");
            }
            else {
                avatarBox.setAttribute("style", "background-image:url(" + accountInfo['avatar'] + ")");
                userName.innerHTML = accountInfo['nick'];
                accountBox.setAttribute("onclick", "myMenu(true);");
                myUid = accountInfo['uid'];
            }
        });
    }
    catch (err) {
        console.error("getInfo 执行错误，返回错误信息" + err);
        userName.innerHTML = "错误";
        accountBox.setAttribute("onclick", "newMsgBox('无法连接到登录服务器，因此无法打开此上下文菜单。');");
    }
}

window.onload = setHeaderLog();

function showLogFrame() {
    logPop.setAttribute("open", "true");
    logCover.setAttribute("open", "");
    logIframe.setAttribute("src", accountClient + "/?name=nmFun&msg=登录nmFun，一起看乐子&returnto=" + siteURL + "/api/checklog.php");
}

function closeLogFrame() {
    logPop.setAttribute("open", "false");
    logCover.removeAttribute("open");
    logIframe.setAttribute("src", "about:blank");
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

$("*").click(function () { if (myMenuOpe) myMenu(false) });

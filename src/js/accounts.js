// 登录账户
myUid = NaN;
function setHeaderLog() {
    returnWord = "";
    document.cookie = "PHPSESSID=" + localStorage.sessionid;
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
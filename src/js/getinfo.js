var infoApiURL = "https://api.nmteam.xyz/";
var manageURL = "https://accounts.nmteam.xyz";

getSessionId();

function getInfo(fun = function () { }) {
    $.ajax(infoApiURL + "userinfo.php?CodySESSION=" + getCookie("sessionid") || getCookie("PHPSESSID"), {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("GetInfo: Success.");
                returnWord = data['info'];
            }
            else if (status == "error") {
                console.error("GetInfo: Not logged in.");
                returnWord = -1;
            }
            fun(returnWord);
        },
        error: function () {
            console.error("GetInfo: Error.");
            returnWord = -2;
        }
    });
    return returnWord;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "null") {
            return null;
        }
        if (pair[0] == variable) {
            return decodeURI(pair[1]);
        }
    }
    return null;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function getSessionId() {
    // 鑾峰彇鏈夋病鏈夊甫sessionid鍙傛暟锛屾湁鍒欏瓨Cookie
    if (getQueryVariable("sessionid") != "" && getQueryVariable("sessionid") != null) {
        if (getQueryVariable("long_log") == "true") {
            longLog = ";max-age=999999999999";
            console.log("GetInfo: It's a long time log.");
        }
        else longLog = "";
        sessionid = getQueryVariable("sessionid");
        // 鐩墠閫昏緫鏆傛椂璁惧畾涓虹洿鎺ヨ闂敤鎴蜂腑蹇冪殑鐧诲綍鐨勬槸浠栦滑鏈€鍚庝竴娆￠€氳繃鍚勭鏂瑰紡璁块棶鐨勮处鍙凤紝鎵€浠ユ澶勪笉鍋氫粈涔堝尯鍒�
        document.cookie = "sessionid=" + sessionid + "; domain=" + window.location.hostname + "; path=/" + longLog;
        console.log("GetInfo: Get sessionid.");
        // 鑲ユ按涓嶆祦澶栦汉鐢帮紝瀛樿繘Cookie涔嬪悗鍦ㄥ湴鍧€鏍忛殣钘弒essionid
        setTimeout(() => {
            removeParam("sessionid");
            removeParam("long_log");
        }, 2000);
    }
}

function changeURLParam(name, value) {
    var url = document.URL, resultUrl = ''
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg);
    var replaceText = name + '=' + value;
    if (r != null) {
        var tmp = url.replace(unescape(name + '=' + r[2]), replaceText);
        resultUrl = (tmp);
    } else {
        if (url.match('[\?]')) {
            resultUrl = url + '&' + replaceText;
        }
        else {
            resultUrl = url + '?' + replaceText;
        }
    }
    history.replaceState(null, null, resultUrl)
}

function removeParam(parameter) {
    var url = document.location.href;
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
        var urlBase = urlparts.shift();
        var queryString = urlparts.join("?");
        var prefix = encodeURIComponent(parameter) + '=';
        var pars = queryString.split(/[&;]/g);
        for (var i = pars.length; i-- > 0;)
            if (pars[i].lastIndexOf(prefix, 0) !== -1)
                pars.splice(i, 1);
        url = urlBase + '?' + pars.join('&');
        window.history.pushState('', document.title, url); // added this line to push the new url directly to url bar .
    }
    return url;
}
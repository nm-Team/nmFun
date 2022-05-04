hasCreatedContextMenu = false;
themeList = ["default", "dark",];
languageList = ["zh_CN",];

//  禁用右键
$("body").bind("DOMNodeInserted", function () {
    $(`.contextMenu, .commonCover, .coverWithColor, #bodyHover, button, .alertBox, .msgBox, #widthChanger`).contextmenu(function () {
        return false;
    })
});

// 展示右键菜单
function createContextMenu(items, customX = false, customY = false, element = undefined) {
    if (!hasCreatedContextMenu) {
        var time = gTime();
        new_element = document.createElement('div');
        new_element.setAttribute('id', 'contextMenu' + time);
        new_element.setAttribute('class', 'contextMenu');
        new_element.setAttribute('onclick', 'closeContextMenu(' + time + ')');
        for (createContextMenuItemsId = 0; createContextMenuItemsId < items.length; createContextMenuItemsId++) {
            if (items[createContextMenuItemsId][0] == "line") {
                new_element.innerHTML += `<div class="line"></div>`;
            } else new_element.innerHTML += `<button onclick="` + items[createContextMenuItemsId][1] + `;"><i class="material-icons">` + items[createContextMenuItemsId][2] + `</i>` + items[createContextMenuItemsId][0] + `</button>`;
            if (items[createContextMenuItemsId][2]) {
                new_element.setAttribute('icon', 'true');
            }
        }
        document.getElementById("hoverArea").appendChild(new_element);
        // 判断位置
        // 获取div宽高
        menuWidth = document.getElementById('contextMenu' + time).clientWidth;
        menuHeight = document.getElementById('contextMenu' + time).clientHeight - 2 * Number(getComputedStyle(document.getElementById('contextMenu' + time), false)["paddingTop"].replace(/px/g, ""));
        // alert(menuWidth+" "+menuHeight);
        // 获取页面宽高
        pageWidth = document.body.clientWidth;
        pageHeight = window.innerHeight;
        // alert(pageWidth+" "+pageHeight);
        if (!element) {
            positionX = mouseX;
            positionY = mouseY;
        }
        else {
            eleinfo = element.getBoundingClientRect();
            // console.log(eleinfo);
            positionX = eleinfo.x + eleinfo.width / 2;
            positionY = eleinfo.y + eleinfo.height;
        }
        console.log("Now mouse at " + positionX + " " + positionY);
        console.log("Now menu as " + menuWidth + " " + menuHeight);
        //对比宽度
        if (customX == false && menuWidth + positionX < pageWidth)
            menuX = "r";
        else if (menuWidth - positionX < 0) menuX = "l";
        else { // 左右都不够，委屈一下菜单
            if (positionX * 2 > pageWidth) { // 即左边空间多
                menuX = "l";
                document.getElementById('contextMenu' + time).style.width = positionX + "px";
            }
            else {
                menuX = "r";
                document.getElementById('contextMenu' + time).style.width = (pageWidth - positionX) + "px";
            }
            // 重新获取页面宽高
            pageWidth = document.body.clientWidth;
            pageHeight = window.innerHeight;
        }
        if (customY == false && menuHeight + positionY > pageHeight)
            menuY = "t";
        else menuY = "b";
        if (menuX == "r") {
            document.getElementById('contextMenu' + time).style.left = positionX + "px";
        } else if (menuX == "l") {
            document.getElementById('contextMenu' + time).style.right = (pageWidth - positionX) + "px";
        }
        if (menuY == "b") {
            document.getElementById('contextMenu' + time).style.top = positionY + "px";
        } else if (menuY == "t") {
            document.getElementById('contextMenu' + time).style.bottom = (pageHeight - positionY) + "px";
        }
        console.log(menuX + menuY);
        // 根据高度制作动画
        new_element = document.createElement('style');
        new_element.innerHTML = `
        @keyframes contextMenu{
            0%{
                opacity: 0;
                width: 0;
                max-height: 0vh;
                overflow: hidden;
            }
            6%{
                opacity: 1;
            }
            99%{
                overflow: hidden;
            }
            100%{
                opacity: 1;
                width: `+ menuWidth + `;
                max-height: `+ menuHeight + `px;
            }
        }`;
        document.getElementById("hoverArea").appendChild(new_element);
        document.getElementById('contextMenu' + time).style.animation = "contextMenu 0.35s";
        new_element = document.createElement('div');
        new_element.setAttribute('id', 'commonCover' + time);
        new_element.setAttribute('class', 'commonCover');
        new_element.setAttribute('onclick', 'closeContextMenu(' + time + ')');
        new_element.setAttribute('oncontextmenu', 'closeContextMenu(' + time + ')');
        document.getElementById("hoverArea").appendChild(new_element);
        document.getElementById('contextMenu' + time).getElementsByTagName("button")[0].focus();
        hasCreatedContextMenu = true;
        writeLog("i", "createContextMenu", "time: " + time + ", content: " + items + ", x: " + menuX + " " + positionX + " " + menuWidth + ", y: " + menuY + " " + positionY + " " + menuHeight);
        setTimeout(() => {
            hasCreatedContextMenu = false;
        }, 10);
    }
}

function closeContextMenu(time) {
    document.getElementById('commonCover' + time).outerHTML = "";
    document.getElementById('contextMenu' + time).setAttribute("die", "true");
    // setTimeout(() => {
    document.getElementById('contextMenu' + time).outerHTML = "";
    // }, 500);
    writeLog("i", "closeContextMenu", "time: " + time);
}

// alert
function alert(msg, title = "提示", positive = "好", positiveEvent, negative = undefined, negativeEvent, clicker = undefined) {
    var time = gTime();
    new_element = document.createElement('div');
    new_element.setAttribute('id', 'alertBox' + time);
    new_element.setAttribute('class', 'alertBox');
    new_element.innerHTML = `
    <div class="title">`+ title + `</div>
    <div class="msg">`+ msg + `</div>
    <!--<div class="checker"><label for=""><input type="checkbox" hidden></label></div>-->
    <div class="buttons">
        <button class="positive" onclick="closeAlert(`+ time + `);` + positiveEvent + `;">` + positive + `</button>
        `+ (negative ? '<button onclick="closeAlert(' + time + ');' + negativeEvent + ';">' + negative + '</button>' : '') + `
    </div> `;
    document.getElementById("hoverArea").appendChild(new_element);
    new_element = document.createElement('div');
    new_element.setAttribute('id', 'coverWithColor' + time);
    new_element.setAttribute('class', 'coverWithColor');
    new_element.setAttribute('open', 'true');
    document.getElementById("hoverArea").appendChild(new_element);
    document.getElementById('alertBox' + time).getElementsByClassName("buttons")[0].getElementsByClassName("positive")[0].focus();
    writeLog("i", "alert", "time: " + time + ", content: " + document.getElementById('alertBox' + time).innerHTML);
}

function closeAlert(time) {
    document.getElementById('alertBox' + time).setAttribute("die", "true");
    document.getElementById('coverWithColor' + time).removeAttribute("open");
    setTimeout(() => {
        document.getElementById('coverWithColor' + time).outerHTML = "";
        document.getElementById('alertBox' + time).outerHTML = "";
    }, 500);
    writeLog("i", "closeAlert", "time: " + time);
}

// msgBox
function newMsgBox(msg) {
    var time = gTime();
    new_element = document.createElement('div');
    new_element.setAttribute('id', 'msgBox' + time);
    new_element.setAttribute('class', 'msgBox');
    new_element.innerHTML = msg;
    document.getElementById("hoverArea").appendChild(new_element);
    setTimeout(() => {
        document.getElementById('msgBox' + time).outerHTML = "";
    }, 10000);
    writeLog("i", "newMsgBox", "msg: " + msg);
}

function newErrorBox(funame, err) {
    newMsgBox("在执行 JavaScript 函数 " + funame + "时发生错误" + ": " + err + "<br>" + "请尝试重新加载页面，如果问题没有解决，请联系 nmTeam 团队。")
}

// 切换主题
switchTheme(undefined, true, true);
function switchTheme(theme = undefined, goAhead = true, byLoading = false) {
    if (!theme)
        theme = (getTheme() == "" ? "default" : getTheme());
    document.getElementsByTagName("body")[0].setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
    try {
        // 使得iframe内外均能响应更改
        if (goAhead) {
            console.log("Let all pages change...");
            // 父页面对子页面依次执行函数
            for (cThemeFor = 0; cThemeFor < document.getElementsByTagName("iframe").length; cThemeFor++) {
                try {
                    console.log(document.getElementsByTagName("iframe")[cThemeFor]);
                    document.getElementsByTagName("iframe")[cThemeFor].contentWindow.switchTheme(undefined, false);
                }
                catch (err) { }
            }
        }
    }
    catch (err) {
        console.error(err);
    }
    if (!byLoading)
        document.getElementsByTagName("body")[0].setAttribute("transitioncolor", "true");
    setTimeout(() => {
        document.getElementsByTagName("body")[0].removeAttribute("transitioncolor");
    }, 800);
}

function getTheme() {
    if (localStorage.getItem("theme"))
        return localStorage.getItem("theme");
    else return "default";
}

// 禁用双指放大
document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, {
    passive: false
});

// 禁用双击放大
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, {
    passive: false
});

// 获取鼠标位置
window.onmousemove = function (event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
    try {
        if (mouseY > window.outerHeight - 200) debugInfo.setAttribute("data-align", "top");
        else debugInfo.setAttribute("data-align", "bottom");
    }
    catch (err) { }
};

// 禁用F12
document.onkeydown = function () {
    if (window.event && window.event.keyCode == 123 && !debugMode) {
        event.keyCode = 0;
        event.returnValue = false;
    }
}

// 双击事件
function doubleToDo(fun) {
    if (navigator.userAgent.indexOf("Android") > 0 || navigator.userAgent.indexOf("ios") > 0 || navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("windows phone") > 0) {
        try { clickTime; } catch (err) { clickTime = 0; }
        clickTime++;
        // 第一个TimeOut反正onclick冲突误判
        if (clickTime == 1) {
            setTimeout(() => {
                if (clickTime > 1) {
                    console.log("冲突");
                    clickTime = 1;
                }
            }, 3);
        }
        // 在50-550ms内第二次点击，执行操作
        for (doubleTimer = 0; doubleTimer < 50; doubleTimer++)
            setTimeout(() => {
                if (clickTime >= 2) {
                    clickTime = 0;
                    doubleGo = fun;
                    doubleGo();
                }
            }, 10);
        setTimeout(() => {
            clickTime = 0;
        }, 550);
    }
}

// 长按事件
function longPressToDo(fun) {
    console.log('touchstart');
    $("body")[0].setAttribute("select", "false");
    timer = setTimeout(function () {
        console.log('LongPress');
        // e.preventDefault();
        longPressFun = fun;
        longPressFun();
    }, 510);
}

function longPressStop() {
    console.log('stop');
    $("body")[0].setAttribute("select", "true");
    clearTimeout(timer);
    timer = 0;
}

window.addEventListener('touchstart', function (e) {
    console.log('start');
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
});
window.addEventListener('touchmove', function (e) {
    console.log('move');
});
window.addEventListener('touchend', function (e) {
    console.log('end');
});

// 选中文字
function selectText(element) {
    if (document.body.createTextRange) {
        let range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        alert('none');
    }
}

// 复制文本
function copyToClipboard(text = window.getSelection().toString()) {
    let textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.zIndex = -1;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '1em';
    textArea.style.height = '1em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.log('该浏览器不支持点击复制到剪贴板');
    }
    document.body.removeChild(textArea);
}

function gTime() {
    time = new Date();
    return time.getTime() + 60000 * time.getTimezoneOffset();
}

function pushHistory(what) {
    var state = {
        title: "title",
        url: "#" + what
    };
    window.history.pushState(state, "title", "#" + what);
}

// Header动画
refreshFloatFrameOnScroll();
function refreshFloatFrameOnScroll() {
    $(".floatFrame-content").on("scroll", (function (e) {
        if (!this.getAttribute("oriheight")) this.setAttribute("oriheight", this.parentNode.getElementsByClassName("floatFrame-header")[0].getBoundingClientRect().height);
        userFrameHeaderHeight = this.getAttribute("oriheight");
        userFrameStrollPercent = (this.scrollTop / userFrameHeaderHeight > 1 ? 1 : this.scrollTop / userFrameHeaderHeight);
        if (userFrameStrollPercent == 1) this.parentNode.getElementsByClassName("typeSelecter")[0].setAttribute("fly", "true");
        else this.parentNode.getElementsByClassName("typeSelecter")[0].setAttribute("fly", "false");
        this.getElementsByClassName("placeHolder")[0].style.height = ((userFrameStrollPercent < 0 ? 0 : userFrameStrollPercent) * userFrameHeaderHeight) + "px";
        for (y = 0; y < this.parentNode.getElementsByClassName("floatFrame-header").length; y++)
            this.parentNode.getElementsByClassName("floatFrame-header")[y].style.height = ((1 - userFrameStrollPercent) * userFrameHeaderHeight) + "px";
    }));
}

// 时间
setInterval(() => {
    setTimeTexts();
}, 60000);

function setTimeTexts() {
    $("[time=true]").each(function (index, domEle) {
        timeInText = new Date();
        time = new Date();
        time.setTime(time.getTime() + 60000 * time.getTimezoneOffset());
        // if (debugMode) console.log(time.getTime());
        // 读取要求的时间
        timeS = Number(domEle.getAttribute("timestamp"));
        // 换算PHP的时间戳
        timeS *= 1000;
        // 将时间转为当前时区
        zone = Number(localStorage.zone);
        timeInText = new Date();
        timeInText.setTime(timeS + 3600000 * zone * 0);// 禁用了这里的转换，问就不知道为什么
        time.setTime(time.getTime() + 3600000 * zone);
        // 处理两则时间
        timeInText = JSON.parse(splitTime(timeInText));
        time = JSON.parse(splitTime(time));
        var timeWord = "";
        showTime = true;
        showDate = false;
        // if (debugMode) console.log(JSON.stringify(timeInText) + JSON.stringify(time));
        switch (domEle.getAttribute("timestyle")) {
            case "absolute":
                switch (time.fullDate - timeInText.fullDate) {
                    case 0:
                        break;
                    case -1:
                        break;
                    case 1:
                        timeWord = "昨天";
                        break;
                    case 2:
                        timeWord = "前天";
                        break;
                    default:
                        showTime = false;
                        showDate = true;
                }
                if (showTime) {
                    timeWord += timeInText.hour + ":" + timeInText.sMinute + (domEle.getAttribute("timesec" == "true") ? ":" + timeInText.SSecond : "");
                }
                if (showDate) {
                    timeWord += (time.year == timeInText.year ? "" : timeInText.year + "/") + timeInText.month + "/" + timeInText.date;
                }
                domEle.innerHTML = timeWord;
                domEle.setAttribute("title", timeInText.year + "-" + timeInText.month + "-" + timeInText.date + " " + timeInText.hour + ":" + timeInText.sMinute + ":" + timeInText.sSecond);
                break;
            case "relative":
                if (time.fullMinute - timeInText.fullMinute < 1) {
                    timeWord = "现在";
                }
                else if (time.fullMinute - timeInText.fullMinute < 60) {
                    timeWord = time.fullMinute - timeInText.fullMinute + "分钟前";
                }
                else if (time.fullHour - timeInText.fullHour < 24) {
                    timeWord = time.fullHour - timeInText.fullHour + "小时前";
                }
                else if (time.fullDate - timeInText.fullDate < 15) {
                    timeWord = time.fullDate - timeInText.fullDate + "天前";
                }
                else timeWord = (time.year == timeInText.year ? "" : timeInText.year + "/") + timeInText.month + "/" + timeInText.date;
                domEle.innerHTML = timeWord;
                domEle.setAttribute("title", timeInText.year + "-" + timeInText.month + "-" + timeInText.date + " " + timeInText.hour + ":" + timeInText.sMinute + ":" + timeInText.sSecond);
                break;
            case "fixed":
                domEle.innerHTML = timeInText.year + "-" + timeInText.month + "-" + timeInText.date + " " + timeInText.hour + ":" + timeInText.sMinute + ":" + timeInText.sSecond;
                break;
        }
    });
    console.log("setTimeTexts");
}

function splitTime(timeToSplit) {
    return JSON.stringify({
        "ori": timeToSplit,
        "full": timeToSplit.getTime(),
        "year": timeToSplit.getFullYear(),
        "month": timeToSplit.getMonth() + 1,
        "date": timeToSplit.getDate(),
        "fullDate": Math.floor((timeToSplit.getTime() + (8 * 60 * 60 * 1000)) / 86400000),
        "hour": timeToSplit.getHours(),
        "minute": timeToSplit.getMinutes(),
        "sMinute": (timeToSplit.getMinutes() < 10 ? "0" + String(timeToSplit.getMinutes()) : timeToSplit.getMinutes()),
        "second": timeToSplit.getSeconds(),
        "sSecond": (timeToSplit.getSeconds() < 10 ? "0" + String(timeToSplit.getSeconds()) : timeToSplit.getSeconds()),
        "fullHour": Math.floor(timeToSplit.getTime() / 60000 / 60),
        "fullMinute": Math.floor(timeToSplit.getTime() / 60000),
        "fullSecond": Math.floor(timeToSplit.getTime() / 1000)
    });
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

// DIV Enter 打开
function divClick(div, event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        div.click();
    }
}

// 换算文件大小
function fileConversion(size) {
    if (size < 1000)
        return size.toFixed(0) + "Bytes";
    else size = size / 1024;
    if (size < 1000)
        return size.toFixed(1) + "KB";
    else size = size / 1024;
    if (size < 1000)
        return size.toFixed(2) + "MB";
    else size = size / 1024;
    if (size < 1000)
        return size.toFixed(2) + "GB";
}

// 社区公告模块
function openNotice(name) {
    newBrowser(siteURL + "/notice.html?name=" + name, " noticeFrame ", false, false);
}

function logRequire() {
    if (!localStorage.sessionid) {
        newMsgBox("还没有登录，登录后才能继续哦");
        showLogFrame();
        return false;
    }
    else return true;
}

function cleanHTMLTag(text) {
    text = text.replace(/<[\/\s]*(?:(?!div|br)[^>]*)>/g, '');
    text = text.replace(/<\s*div[^>]*>/g, '<div>');
    text = text.replace(/<\s*div[^>]*>/g, '<div>');
    text = text.replace(/<[\/\s]*div[^>]*>/g, '<br>');
    text = text.replace(/<br><br>/g, '<br>');
    text = text.replace(/<br>/g, '[br]');
    return text;
}

// PWA-BETA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (registration) {
            // 注册成功 
            console.log('ServiceWorker registration successful with scope: ', registration.scope)
        }).catch(function (err) {
            // 注册失败
            (console.log('ServiceWorker registration failed: ', err))
        })
    })
}

// TestField
function showTestField() {
    newBrowser("settings/testfield.html", "", false, false);
}

function isPwa() {
    if (window.matchMedia('(display-mode: standalone)').matches)
        return true;
    else return false;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var url = decodeURI(decodeURI(window.location.search))
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 大号字体
setInterval(() => {
    if (localStorage.bigText == "true" && !debugMode) {
        $("html").css("cssText", "font-size: 1.35px!important");
    }
    else {
        $("html").css("cssText", "font-size: var(--fontSize)");
    }
}, 300);

function writeLog(logType, funName, content) {
    if (!localStorage.systemLog) localStorage.systemLog = "";
    logTypeList = ["INFO", "DEBUG", "WARN", "ERROR", "FATAL"];
    logTypeList.forEach(en => {
        if (en[0].toLowerCase() == logType.toLowerCase()) logType = en;
    });
    if (logType == "DEBUG" && !debugMode) return;
    logTime = new Date();
    logTime.setTime(logTime.getTime() + 60000 * logTime.getTimezoneOffset());
    logTime = JSON.parse(splitTime(logTime));
    ltime = logTime.year + "-" + logTime.month + "-" + logTime.date + " " + logTime.hour + ":" + logTime.sMinute + ":" + logTime.sSecond;
    logWord = (`[` + logType + `] ` + ltime + " " + funName + `: ` + content + ` \n`);
    try { localStorage.systemLog += logWord; }
    catch (err) {
        localStorage.removeItem("systemLog");
        writeLog("e", "writeLog", "Write to localStorage error "
            + err + ". Has rebulit the log.");
        writeLog(logType, funName, content);
    }
    console.log(logWord);
}

function newAjax(type, url, session, getParam, postParam, succeedF = function () { }, faliureF = function () { }) {
    sessionid = localStorage.sessionid;
    writeLog("i", "newAjax", (type + ", " + url + ", " + session + ", " + getParam + ", " + JSON.stringify(postParam)));
    $.ajax(url + "?" + (session ? "CodySESSION=" + sessionid + "&" : "") + getParam, {
        type: type,
        async: true,
        data: postParam,
        crossDomain: true,
        datatype: "jsonp",
        success: function (data) {
            let status = data['status'];
            if (status == "successful" || status == "success") {
                console.log("ajax接收数据成功");
                writeLog("i", "newAjax", "ok");
                succeedF(data);
            } else {
                console.log("ajax接收数据失败");
                writeLog("e", "newAjax", "error");
                faliureF(data);
            }
            return data;
        },
        error: function () {
            newMsgBox("服务器故障，请重试。");
            writeLog("e", "newAjax", "error(network)");
            faliureF({ "status": "error", "info": "网络错误" });
            return null;
        }
    });
}

function newFileAjax(type, url, session, getParam, postParam, succeedF = function () { }, faliureF = function () { }) {
    sessionid = localStorage.sessionid;
    writeLog("i", "newFileAjax", (type + ", " + url + ", " + session + ", " + getParam + ", " + JSON.stringify(postParam)));
    $.ajax(url + "?" + (session ? "CodySESSION=" + sessionid + "&" : "") + getParam, {
        type: type,
        async: true,
        data: postParam,
        crossDomain: true,
        contentType: false,
        processData: false,
        datatype: "jsonp",
        success: function (data) {
            let status = data['status'];
            if (status == "successful" || status == "success") {
                console.log("ajax接收数据成功");
                writeLog("i", "newFileAjax", "ok");
                succeedF(data);
            } else {
                console.log("ajax接收数据失败");
                writeLog("e", "newFileAjax", "error");
                faliureF(data);
            }
            return data;
        },
        error: function () {
            writeLog("e", "newAjax", "error(network)");
            faliureF({ "status": "error", "info": "网络错误" });
            return null;
        }
    });
}

getStickersJSON(function (data) { });

function getStickersJSON(fun) {
    try {
        stickersJSON;
        fun();
    }
    catch (err) {
        $.ajax({
            type: "GET",
            url: "/src/json/stickers.json",
            async: true,
            dataType: "json",
            success: function (response, status, request) {
                writeLog("i", "get stickers set", JSON.stringify(response));
                stickersJSON = response['stickers'];
                fun(stickersJSON);
            },
            error: function () {
                writeLog("e", "get stickers", "ajax error");
            }
        });
    }
}

function setStickersSelBox(div, targetInput) {
    if (localStorage.disableStickers == "true") {
        div.innerHTML = "<center style='font-size: 15rem;'>已经在 Test Field 禁用了表情功能</center>";
        return;
    }
    getStickersJSON(function () {
        try {
            div.innerHTML = "<div class='stks'></div><div class='bar'></div>";
            stksDiv = div.getElementsByClassName("stks")[0];
            sbarDiv = div.getElementsByClassName("bar")[0];
            stickersJSON.forEach(function (val) {
                stksListHTML = getStickerSetHTML(val, targetInput);
                stksDiv.innerHTML += `<div class="set" data-setid="${val['id']}"><div class="name">${val['name']}</div><div class="list">${stksListHTML}</div></div>`;
                sbarDiv.innerHTML += `<button data-setid="${val['id']}" title="${val['name']}" style="background-image:url(${stickersURL}/${val['id']}/${val['icon']})" onclick="jumpStickers('${div.id}','${val['id']}')"></button>`;
            });
        }
        catch (err) {
            writeLog("e", "set stickers", err);
            console.error(err);
            newMsgBox("加载表情面板出错，试着不发龙图吧");
        }
    });
}

function getStickerSetHTML(val, targetInput) {
    sHTML = "";
    pakId = val['id'];
    val['stickers'].forEach(function (val2) {
        sHTML += `<button contenteditable="true" title="${val2['name']}" onclick="addStickerToEditBox('${targetInput}','${pakId}','${val['size']}','${val2['id']}','${`${stickersURL}/${pakId}/${val2['src']}`}')" ondrag="this.innerHTML=\`<img data-type='sticker' data-setname='${pakId}' data-stickerid='${val2['id']}' data-size='${val['size']}' src='${stickersURL}/${pakId}/${val2['src']}' noselect oncontextmenu='return false;'>\`;"><img data-type="sticker" data-setname="${pakId}" data-stickerid="${val2['id']}" data-size="${val['size']}" src="${stickersURL}/${pakId}/${val2['src']}" noselect oncontextmenu="return false;"></button>`;
    });
    return sHTML;
}

function jumpStickers(divId, setId) {
    div = $("#" + divId);
    setDivPlace = div.find("[data-setid=" + setId + "]")[0].getBoundingClientRect().top - div.find(".stks")[0].getBoundingClientRect().top;
    console.log(setDivPlace);
    div.find(".stks").animate({
        scrollTop: div.find(".stks").scrollTop() + setDivPlace
    }, { duration: 300, easing: "swing" });
}

function addStickerToEditBox(targetInput, pakId, pakSize, stkId, src) {
    htmlW = document.createElement("img");
    htmlW.setAttribute("data-type", "sticker");
    htmlW.setAttribute("data-setname", pakId);
    htmlW.setAttribute("data-stickerid", stkId);
    htmlW.setAttribute("data-size", pakSize);
    htmlW.setAttribute("src", src);
    try {
        newE = window.getSelection().baseNode.splitText(window.getSelection().baseOffset);
        window.getSelection().baseNode.parentNode.insertBefore(htmlW, newE);
    }
    catch (err) {
        console.log(err);
        $("#" + targetInput + " .sendBoxInput").append(htmlW);
    }
}

function showStickerSet(json) {
    try {
        json = JSON.parse(json.replace(/\'/g, '"'));
        stickersSetId = json.id;
        if ($("#stickersSetFrame" + stickersSetId).length > 0) {
            $("#stickersSetFrame" + stickersSetId).attr("open", "true");
            $("#coverWithColorSti" + stickersSetId).attr("open", "true");
        }
        new_element = document.createElement('div');
        new_element.setAttribute('id', "stickersSetFrame" + stickersSetId);
        new_element.setAttribute('class', 'popFrame stickersSetFrame ');
        new_element.setAttribute('name', json.name);
        new_element.setAttribute('totallyClose', 'true');
        new_element.innerHTML = stickersSetFrameTemplate.replace(/{{name}}/g, json.name).replace(/{{id}}/g, json.id).replace(/{{stickers}}/g, function () {
            sHTML = "";
            val = json.stickers;
            val.forEach(function (val2) {
                sHTML += `<button title="${val2['name']}" onclick="localStorage.imgSrc='${stickersURL}/${stickersSetId}/${val2['src']}'; newBrowser('imgviewer.html',false,false,false)"><img data-type="sticker" data-setname="${stickersSetId}" data-stickerid="${val2['id']}" data-size="${val['size']}" src="${stickersURL}/${stickersSetId}/${val2['src']}" noselect oncontextmenu="return false;"><p>${val2['name']}</p></button>`;
            });
            return sHTML;
        });
        document.body.appendChild(new_element);
        new_element = document.createElement('div');
        new_element.setAttribute('id', 'coverWithColorSti' + stickersSetId);
        new_element.setAttribute('class', 'coverWithColor pop');
        new_element.setAttribute('open', 'true');
        document.body.appendChild(new_element);
        document.getElementById("stickersSetFrame" + stickersSetId).setAttribute('open', 'true');
        pushHistory("");
        writeLog("i", "showStickerSet", "showStickerSet" + stickersSetId);
        setPopScale();
    }
    catch (err) {
        writeLog("e", "showStickerSet", err);
        newMsgBox("加载表情包错误")
    }
}

function closeStickerSet(stickersSetId) {
    $("#stickersSetFrame" + stickersSetId).attr("open", "false");
    $("#coverWithColorSti" + stickersSetId).removeAttr("open");
    setTimeout(() => {
        $("#stickersSetFrame" + stickersSetId).remove();
        $("#coverWithColorSti" + stickersSetId).remove();
    }, 500);
    setPopScale();
}

stickersSetFrameTemplate = `
<header>
<div class="left">
    <button class="backButton" title="关闭" onclick="closeStickerSet('{{id}}')" oncontextmenu="" ontouchstart="" ontouchend="longPressStop()"><i class="material-icons">keyboard_arrow_down</i></button>
    <div class="nameDiv">
        <p class="title">{{name}}</p>
        <p class="little">查看表情包</p>
    </div>
</div>
<div class="right"></div>
</header>
<div class="main list">
    {{stickers}}
</div>
`;

var isiPhone = /iphone/i.test(navigator.userAgent.toLowerCase());
var isiPad = /ipad/i.test(navigator.userAgent.toLowerCase());
var isiPod = /ipod/i.test(navigator.userAgent.toLowerCase());
var isiOS = isiPhone || isiPad || isiPod;
var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());
var isFunApp = /nmfun/i.test(navigator.userAgent.toLowerCase());
var isMobile = isAndroid || isiOS || isWindowsPhone;
var isOpera = navigator.userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
var isIE = navigator.userAgent.indexOf("compatible") > -1 && navigator.userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
var isEdge = navigator.userAgent.indexOf("Edge") > -1; //判断是否Edge浏览器
var isFF = navigator.userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
var isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
var isChrome = navigator.userAgent.indexOf("Chrome") > -1; //判断Chrome浏览器

if (isiPhone || isiPod || isAndroid) $("body").attr("data-mobile", "true");
if (isFunApp) $("body").attr("data-funapp", "true");
if (isSafari || isiOS) $("body").attr("data-webkit", "true");

function report(type, uid, postid = "", content = "") {
    newBrowser(`/settings/report.html?type=${type}&uid=${uid}&postid=${postid}&content=${content.substring(0, 20)}`, '', false, false, '', `<button onclick='$(\`#browserFrame{{browserId}} iframe\`)[0].contentWindow.submit(\`{{browserId}}\`)' title='提交'><i class='material-icons'>send</i></button>`);
}

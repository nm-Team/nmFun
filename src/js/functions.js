hasCreatedContextMenu = false;
themeList = ["default", "dark",];
languageList=["zh_cn"]

//  禁用右键
setInterval(() => {
    {
        $(`.contextMenu, .commonCover, .coverWithColor, #bodyHover, button, .alertBox, .msgBox, #widthChanger`).contextmenu(function () {
            return false;
        })
    }
}, 200);

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
        document.body.appendChild(new_element);
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
        document.body.appendChild(new_element);
        document.getElementById('contextMenu' + time).style.animation = "contextMenu 0.35s";
        new_element = document.createElement('div');
        new_element.setAttribute('id', 'commonCover' + time);
        new_element.setAttribute('class', 'commonCover');
        new_element.setAttribute('onclick', 'closeContextMenu(' + time + ')');
        new_element.setAttribute('oncontextmenu', 'closeContextMenu(' + time + ')');
        document.body.appendChild(new_element);
        document.getElementById('contextMenu' + time).getElementsByTagName("button")[0].focus();
        hasCreatedContextMenu = true;
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
    document.body.appendChild(new_element);
    new_element = document.createElement('div');
    new_element.setAttribute('id', 'coverWithColor' + time);
    new_element.setAttribute('class', 'coverWithColor');
    new_element.setAttribute('open', 'true');
    document.body.appendChild(new_element);
    document.getElementById('alertBox' + time).getElementsByClassName("buttons")[0].getElementsByClassName("positive")[0].focus();
}

function closeAlert(time) {
    document.getElementById('alertBox' + time).setAttribute("die", "true");
    document.getElementById('coverWithColor' + time).removeAttribute("open");
    setTimeout(() => {
        document.getElementById('coverWithColor' + time).outerHTML = "";
        document.getElementById('alertBox' + time).outerHTML = "";
    }, 500);
}

// msgBox
function newMsgBox(msg) {
    var time = gTime();
    new_element = document.createElement('div');
    new_element.setAttribute('id', 'msgBox' + time);
    new_element.setAttribute('class', 'msgBox');
    new_element.innerHTML = msg;
    document.body.appendChild(new_element);
    setTimeout(() => {
        document.getElementById('msgBox' + time).outerHTML = "";
    }, 10000);
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
    // console.log("Now mouse at" + mouseX + mouseY);
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
$(".floatFrame-content").scroll(function (e) {
    if (!this.getAttribute("oriheight")) this.setAttribute("oriheight", this.parentNode.getElementsByClassName("floatFrame-header")[0].getBoundingClientRect().height);
    userFrameHeaderHeight = this.getAttribute("oriheight");
    userFrameStrollPercent = (this.scrollTop / userFrameHeaderHeight > 1 ? 1 : this.scrollTop / userFrameHeaderHeight);
    if (userFrameStrollPercent == 1) this.parentNode.getElementsByClassName("typeSelecter")[0].setAttribute("fly", "true");
    else this.parentNode.getElementsByClassName("typeSelecter")[0].setAttribute("fly", "false");
    this.getElementsByClassName("placeHolder")[0].style.height = ((userFrameStrollPercent < 0 ? 0 : userFrameStrollPercent) * userFrameHeaderHeight) + "px";
    for (y = 0; y < this.parentNode.getElementsByClassName("floatFrame-header").length; y++)
        this.parentNode.getElementsByClassName("floatFrame-header")[y].style.height = ((1 - userFrameStrollPercent) * userFrameHeaderHeight) + "px";
});

// 时间
setInterval(() => {
    setTimeTexts();
}, 50);

function setTimeTexts() {
    $("*[time=true]").each(function (index, domEle) {
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

// 更新图集
setInterval(() => {
    $("ui.medias").each(function (index, domEle) {
        new Viewer(domEle, {
            title: false
        })
    });
}, 200);

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
    return text;
}

function headerClick() {
    if (window.offsetWidth > 800) {
        window.location.href = "";
    }
    else if (pageHeader.getAttribute("open") == "true")
        pageHeader.removeAttribute("open");
    else pageHeader.setAttribute("open", "true");
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
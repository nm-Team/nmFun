boxOprTime = 0;

// 调整窗口大小
widthChanger.ondragstart = function () {
    // alert("Developing");
}

// 使得Box置顶
function focusBox(div, boxId, noOther) {
    if (noOther == undefined && document.getElementById(boxId).getAttribute("noother") == "true") noOther = true;
    else if (noOther == undefined) noOther = false;
    document.getElementById(boxId).removeAttribute("noani");
    document.getElementById(boxId).removeAttribute("pcnoani");
    document.getElementById(boxId).removeAttribute("back");
    document.getElementById(boxId).setAttribute("from", "");
    // 为特殊窗口移除无动画
    document.getElementById(boxId).removeAttribute("nownoani");
    boxOprTime++;
    document.getElementById(boxId).setAttribute("oprT", boxOprTime);
    lastFinish = getAllBoxes(div);
    zIndex = 10;
    for (focusBoxTime = lastFinish.length - 1; focusBoxTime > -1; focusBoxTime--) {
        boxOprTime++;
        divToDel = [];
        boxDelTime = 0;
        zIndex++;
        if (document.getElementById(lastFinish[focusBoxTime][1]).getAttribute("id") == boxId) {
            document.getElementById(lastFinish[focusBoxTime][1]).setAttribute("top", "true");
            document.getElementById(lastFinish[focusBoxTime][1]).setAttribute("con", "on");
        }
        else if (noOther) {
            document.getElementById(lastFinish[focusBoxTime][1]).removeAttribute("top");
            document.getElementById(lastFinish[focusBoxTime][1]).setAttribute("con", "gone");
            if (document.getElementById(lastFinish[focusBoxTime][1]).getAttribute("totallyclose") == "true") {
                divToDel[boxDelTime] = document.getElementById(lastFinish[focusBoxTime][1]);
            }
        } else if (document.getElementById(lastFinish[focusBoxTime][1]).getAttribute("con") == "on") {
            document.getElementById(lastFinish[focusBoxTime][1]).removeAttribute("top");
            document.getElementById(lastFinish[focusBoxTime][1]).setAttribute("con", "none");
        }
        document.getElementById(lastFinish[focusBoxTime][1]).setAttribute("oprT", boxOprTime);
        document.getElementById(lastFinish[focusBoxTime][1]).style.zIndex = zIndex;
    }
    setTimeout(() => {
        for (dt = 0; dt < boxDelTime; dt++)
            divToDel[dt].outerHTML = "";
    }, 600);
    pushHistory("");
    if (div == "pageRight" && noOther) {
        document.getElementById(boxId).setAttribute("pcnoani", "true");
        document.getElementById(boxId).setAttribute("back", "no");
    }
    checkBoxOpen(div);

    // 检测pageRight有没有多窗口，没有就关闭
    if (getOpenBoxes("pageRight").length > 0) {
        thinPageRight(false);
    }
    else thinPageRight(true);
}

function closeBox(div, boxId, totally = false, origin = "") {
    document.getElementById("bodyMain").setAttribute("trans", true);
    setTimeout(() => {
        document.getElementById("bodyMain").setAttribute("trans", false);
    }, 500);
    if (document.getElementById(boxId).getAttribute("uncloseable") == "true") return -1;
    // 判断关闭是否需要动画
    // 如果在iOS PWA上返回手势则不需要动画
    // 为特殊窗口移除无动画
    // beta: 窗口none->on效果
    openBoxes = getOpenBoxes(div);
    if (openBoxes.length > 1) {
        document.getElementById(openBoxes[1][1]).setAttribute("con", "on");
        if (!((navigator.userAgent.indexOf("ios") > 0 || navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0) && isPwa()) && origin == "system")
            document.getElementById(openBoxes[1][1]).setAttribute("from", "none");
    } document.getElementById(boxId).removeAttribute("nownoani");
    if (((navigator.userAgent.indexOf("ios") > 0 || navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0) && isPwa()) && origin == "system") {
        document.getElementById(boxId).setAttribute("noani", "true");
    }
    document.getElementById(boxId).setAttribute("con", "gone");
    setTimeout(() => {
        if (totally | document.getElementById(boxId).getAttribute("totallyclose") == "true") {
            document.getElementById(boxId).outerHTML = "";
        }
    }, 500);
    boxOprTime++;
    checkBoxOpen(div);
    // 检测pageRight有没有多窗口，没有就关闭
    if (getOpenBoxes("pageRight").length > 0) {
        thinPageRight(false);
    }
    else thinPageRight(true);
}

function thinPageRight(to) {
    if (to) {
        bodyMain.setAttribute("thin", "true");
    }
    else {
        bodyMain.removeAttribute("thin");
    }
    mySwiper.updateSize();
}

function checkBoxOpen(div) {
    div = document.getElementById(div);
    for (checkBoxOpenTime = 0; checkBoxOpenTime < div.getElementsByClassName("box").length; checkBoxOpenTime++) {
        boxOprTime++;
        if (div.getElementsByClassName("box")[checkBoxOpenTime].getAttribute("con") == "on") {
            div.setAttribute("show", "true");
            return 0;
        }
    }
    div.removeAttribute("show");
}

function getOpenBoxes(div) {
    div = document.getElementById(div);
    openBoxes = [];
    checkOpenBox = 0;
    for (openBoxNum = 0; openBoxNum < div.getElementsByClassName("box").length; openBoxNum++) {
        if (div.getElementsByClassName("box")[openBoxNum].getAttribute("con") != "gone") {
            openBoxes[checkOpenBox] = [div.getElementsByClassName("box")[openBoxNum].getAttribute("oprT"), div.getElementsByClassName("box")[openBoxNum].getAttribute("id"), div.getElementsByClassName("box")[openBoxNum].getAttribute("name")];
            checkOpenBox++;
        }
    }
    openBoxes.sort(function (x, y) {
        return y[0] - x[0];
    });
    return openBoxes;
}

function getAllBoxes(div) {
    div = document.getElementById(div);
    allBoxes = [];
    checkallBox = 0;
    for (allBoxNum = 0; allBoxNum < div.getElementsByClassName("box").length; allBoxNum++) {
        if (div.getElementsByClassName("box")[allBoxNum]) {
            allBoxes[checkallBox] = [div.getElementsByClassName("box")[allBoxNum].getAttribute("oprT"), div.getElementsByClassName("box")[allBoxNum].getAttribute("id"), div.getElementsByClassName("box")[allBoxNum].getAttribute("name")];
            checkallBox++;
        }
    }
    allBoxes.sort(function (x, y) {
        return y[0] - x[0];
    });
    return allBoxes;
}

// 修正右侧窗口切单屏动画
fixIndexAni = function () {
    if (window.innerWidth < 800) {
        $(".pageRight .rightBox[pcnoani]").each(function (index, domEle) {
            domEle.setAttribute("nownoani", "true");
        })
        setTimeout(() => {
            $(".pageRight .rightBox[pcnoani]").each(function (index, domEle) {
                domEle.removeAttribute("nownoani");
            })
        }, 500);
    }
    else {
        pageLeft.setAttribute("noani", "true");
        pageRight.setAttribute("noani", "true");
        bodyMain.setAttribute("noani", "true");
        setTimeout(() => {
            pageLeft.removeAttribute("noani");
            pageRight.removeAttribute("noani");
            bodyMain.removeAttribute("noani");
        }, 500);
    }
}

window.onresize = fixIndexAni();

fixIndexAni();

// 返回事件
function quickBack(div) {
    var divList = getOpenBoxes(div);
    msgContextMenuItems = [];
    for (quickMenuNum = 0; quickMenuNum < divList.length + 1; quickMenuNum++) {
        if (quickMenuNum == divList.length) {
            msgContextMenuItems[quickMenuNum] = ["line"];
            msgContextMenuItems[quickMenuNum + 1] = ["Home", "", "&#xe88a;"];
            for (quickMenuClickToDoNum = 0; quickMenuClickToDoNum < quickMenuNum; quickMenuClickToDoNum++)
                msgContextMenuItems[quickMenuNum + 1][1] += "closeBox('" + div + "','" + divList[quickMenuClickToDoNum][1] + "');";
        }
        else {
            msgContextMenuItems[quickMenuNum] = [divList[quickMenuNum][2], ""];
            for (quickMenuClickToDoNum = 0; quickMenuClickToDoNum < quickMenuNum; quickMenuClickToDoNum++)
                msgContextMenuItems[quickMenuNum][1] += "closeBox('" + div + "','" + divList[quickMenuClickToDoNum][1] + "');";
        }
    }
    createContextMenu(msgContextMenuItems);
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

$(function () {
    // pushHistory();
    window.addEventListener("popstate", function (e) {
        console.log("返回");
        if (getOpenBoxes("pageRight").length > 0)
            closeBox("pageRight", getOpenBoxes("pageRight")[0][1], false, "system");
        else if (getOpenBoxes("pageLeft").length > 0)
            closeBox("pageLeft", getOpenBoxes("pageLeft")[0][1], false, "system");
        else openSideBar();
    }, false);
});

// 键盘事件
window.onkeydown = function (event) {
    // 定义按键
    esc = event.keyCode == 27;
    ctrl = event.ctrlKey;
    shift = event.shiftKey;
    enter = event.keyCode == 13;
    // ESC 侧栏
    if (esc) {
        console.log("Esc");
        // 如果有右键菜单，关闭
        if (document.getElementsByClassName("contextMenu").length > 0) {
            document.getElementsByClassName("contextMenu")[document.getElementsByClassName("contextMenu").length - 1].click();
        }
        return false;
    }
    // Enter 关闭 alert
    if (enter && document.getElementsByClassName("alertBox").length > 0 && document.activeElement.className.indexOf("negative") == -1) {
        document.getElementsByClassName("alertBox")[document.getElementsByClassName("alertBox").length - 1].getElementsByClassName("positive")[0].click();
    }
    // Ctrl Enter 和 Ctrl Shift Enter 发送消息
    // sendKey = localStorage.getItem("sendKey");
    // if (sendKey != "close") {
    //     if ((sendKey == "ctrlEnter" && ctrl && shift && enter) || (sendKey == "enter" && ctrl && enter)) {
    //         if (document.activeElement.getAttribute("cid")) {
    //             console.log("Send message for " + document.activeElement.getAttribute("cid"));
    //             sendText(document.activeElement.getAttribute("cid"), true);
    //             return false;
    //         }
    //     }
    //     else if ((sendKey == "ctrlEnter" && ctrl && enter) || (sendKey == "enter" && !shift && enter)) {
    //         if (document.activeElement.getAttribute("cid")) {
    //             console.log("Send message for " + document.activeElement.getAttribute("cid"));
    //             sendText(document.activeElement.getAttribute("cid"));
    //             document.activeElement.innerHTML = "";
    //             return false;
    //         }
    //    }
    // }
}

function headerClick() {
    if (window.offsetWidth > 800) {
        window.location.href = "";
    }
    else if (pageHeader.getAttribute("open") == "true")
        pageHeader.removeAttribute("open");
    else pageHeader.setAttribute("open", "true");
}

// 首页的滚动屏
var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal', // 垂直切换选项
    loop: true, // 循环模式选项
    speed: 300,
    autoplay: {
        delay: 4000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
    },
    effect: '',
    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    // 如果需要前进后退按钮
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // 如果需要滚动条
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})

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

// pop
function openPop(ele) {
    ele.setAttribute("open", "true");
}

function closePop(ele, totally = false) {
    ele.setAttribute("open", "false");
    if (totally) {
        setTimeout(() => {
            ele.outerHTML = "";
        }, 1000);
    }
}

// 首页typeSelecter自动操作与记忆
if (!localStorage.typeSelected) localStorage.typeSelected = "indexType_all";

document.getElementById(localStorage.typeSelected).click();

function indexSwitchType(typeName) {
    newMsgBox("帖子展示功能开发中");
    localStorage.typeSelected = "indexType_" + typeName;
}
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
    writeLog("i", "focusBox", "div: " + div + ", boxId: " + boxId + ", noOther: " + noOther + ", allBoxes: " + getAllBoxes(div));
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
        if (!((navigator.userAgent.indexOf("ios") > 0 || navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0) && isPwa()) || origin != "system")
            document.getElementById(openBoxes[1][1]).setAttribute("from", "none");
    }
    document.getElementById(boxId).removeAttribute("nownoani");
    if (!((navigator.userAgent.indexOf("ios") > 0 || navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0) && isPwa()) && origin == "system") {
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
    writeLog("i", "closeBox", "div: " + div + ", boxId: " + boxId + ", totally: " + totally + ", origin: " + origin + ", allBoxes: " + getAllBoxes(div));
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
function quickBack(div, ele) {
    var divList = getOpenBoxes(div);
    msgContextMenuItems = [];
    for (quickMenuNum = 0; quickMenuNum < divList.length + 1; quickMenuNum++) {
        if (quickMenuNum == divList.length) {
            msgContextMenuItems[quickMenuNum] = ["line"];
            msgContextMenuItems[quickMenuNum + 1] = ["主页", "", "&#xe88a;"];
            for (quickMenuClickToDoNum = 0; quickMenuClickToDoNum < quickMenuNum; quickMenuClickToDoNum++)
                msgContextMenuItems[quickMenuNum + 1][1] += "closeBox('" + div + "','" + divList[quickMenuClickToDoNum][1] + "');";
        }
        else {
            msgContextMenuItems[quickMenuNum] = [divList[quickMenuNum][2], ""];
            for (quickMenuClickToDoNum = 0; quickMenuClickToDoNum < quickMenuNum; quickMenuClickToDoNum++)
                msgContextMenuItems[quickMenuNum][1] += "closeBox('" + div + "','" + divList[quickMenuClickToDoNum][1] + "');";
        }
    }
    createContextMenu(msgContextMenuItems, undefined, undefined, ele);
    writeLog("i", "quickBack", "div: " + div + ", contextMenuItems: " + msgContextMenuItems);

}

$(function () {
    window.addEventListener("popstate", function (e) {
        console.log("返回");
        if ($(".popFrame[open=true]").length>0) $(".popFrame[open=true]")[$(".popFrame[open=true]").length - 1].getElementsByClassName("backButton")[0].click();
        else if (getOpenBoxes("pageRight").length > 0)
            closeBox("pageRight", getOpenBoxes("pageRight")[0][1], false, "system");
        else if (getOpenBoxes("pageLeft").length > 0)
            closeBox("pageLeft", getOpenBoxes("pageLeft")[0][1], false, "system");
        else openSideBar();
    }, false);
});

// pop
function openPop(ele) {
    ele.setAttribute("open", "true");
    pushHistory("");
}

function closePop(ele, totally = false) {
    ele.setAttribute("open", "false");
    if (totally) {
        setTimeout(() => {
            ele.outerHTML = "";
        }, 1000);
    }
    pushHistory("");
}

// scale
setInterval(() => {
    if ($(".popFrame[open=true]").length > 0) {
        document.body.setAttribute("scale", "true");
    }
    else {
        document.body.setAttribute("scale", "false");
    }
}, 40);
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
    pushHistory(div + "_" + boxId);
    if (div == "pageRight" && noOther) {
        document.getElementById(boxId).setAttribute("pcnoani", "true");
        document.getElementById(boxId).setAttribute("back", "no");
    }
    checkBoxOpen(div);
    // 检测pageRight有没有多窗口，没有就关闭
    if (div == "pageRight")
        if (getOpenBoxes("pageRight").length > 0) {
            thinPageRight(false);
            pageLeft.setAttribute("behind", "true");
        }
        else {
            thinPageRight(true);
            pageLeft.setAttribute("behind", "false");
        }
    document.getElementById(div).removeAttribute("childnoani");
    $("#" + div + " .box").attr("data-hidden", "false");
    // 更新底栏
    if (div == "pageLeft") lightBottomBar();
    writeLog("i", "focusBox", "div: " + div + ", boxId: " + boxId + ", noOther: " + noOther + ", allBoxes: " + getAllBoxes(div));
}

function closeBox(div, boxId, totally = false, origin = "") {
    document.getElementById("bodyMain").setAttribute("trans", true);
    document.getElementById(div).removeAttribute("childnoani");
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
        if (!(((navigator.userAgent.indexOf("ios") > 0 || navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0) && isPwa()) && origin != "system"))
            document.getElementById(openBoxes[1][1]).setAttribute("from", "none");
    }
    document.getElementById(boxId).removeAttribute("nownoani");
    if ((((navigator.userAgent.indexOf("ios") > 0 || navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0) && isPwa()) && origin != "system"))
        document.getElementById(boxId).setAttribute("noani", "true");
    document.getElementById(boxId).setAttribute("con", "gone");
    setTimeout(() => {
        if (totally | document.getElementById(boxId).getAttribute("totallyclose") == "true") {
            document.getElementById(boxId).outerHTML = "";
        }
    }, 500);
    boxOprTime++;
    checkBoxOpen(div);
    // 检测pageRight有没有多窗口，没有就关闭
    if (div == "pageRight")
        if (getOpenBoxes("pageRight").length > 0) {
            thinPageRight(false);
            pageLeft.setAttribute("behind", "true");
        }
        else {
            thinPageRight(true);
            pageLeft.setAttribute("behind", "false");
        }
    $("#" + div + " .box").attr("data-hidden", "false");
    // 更新底栏
    pushHistory("");
    if (div == "pageLeft") lightBottomBar();
    writeLog("i", "closeBox", "div: " + div + ", boxId: " + boxId + ", totally: " + totally + ", origin: " + origin + ", allBoxes: " + getAllBoxes(div));
}

function thinPageRight(to) {
    if (to) {
        bodyMain.setAttribute("thin", "true");
    }
    else {
        bodyMain.removeAttribute("thin");
    }
    try {
        mySwiper.updateSize();
    } catch (e) {
        writeLog("e", "thinPageRight", "mySwiper.updateSize() error: " + e);
    }
}

// 检测pageRight有没有多窗口，没有就关闭
if (getOpenBoxes("pageRight").length > 0) {
    thinPageRight(false);
}
else thinPageRight(true);

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

// 修正窗口切屏动画
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
        // 若有左侧前置窗口，修复切屏时前排窗口干扰
        if ($("#pageLeft .box[con=on]").length == 0) {
            $("#pageLeft .box").attr("data-hidden", "true");
        }
        else {
            pageLeft.setAttribute("noani", "true");
            pageLeft.setAttribute("childnoani", "true");
        }
        pageRight.setAttribute("noani", "true");
        pageRight.setAttribute("childnoani", "true");
        bodyMain.setAttribute("noani", "true");
        setTimeout(() => {
            pageLeft.removeAttribute("noani");
            pageRight.removeAttribute("noani");
            bodyMain.removeAttribute("noani");
        }, 500);
    }
}

$(window).on("resize", function () { fixIndexAni(); })

fixIndexAni();

// barPage逻辑
barPageCD = false;
function showBarPage(pageId) {
    if (barPageCD) return;
    barPageCD = true;
    if (getOpenBoxes("pageLeft").length == 0) {
        focusBox("pageLeft", $("[data-bar-page-id=" + pageId + "]")[0].id, true);
        $("[data-bar-page-id]:not([data-bar-page-id=" + pageId + "]):not([data-bar-page-id=home])").attr("data-hidden", "true");
    } else {
        focusBox("pageLeft", $("[data-bar-page-id=" + pageId + "]")[0].id, true);
        $("[data-bar-page-id]:not([data-bar-page-id=" + pageId + "]):not([data-bar-page-id=home])").attr("con", "none");
        setTimeout(() => {
            $("[data-bar-page-id]:not([data-bar-page-id=" + pageId + "]):not([data-bar-page-id=home])").attr("con", "gone");
            $("[data-bar-page-id]:not([data-bar-page-id=" + pageId + "]):not([data-bar-page-id=home])").attr("data-hidden", "true");
        }, 500);
    }
    setTimeout(() => {
        barPageCD = false;
    }, 500);
    lightBottomBar(pageId);
}

// bottomBar 高亮
function lightBottomBar(id = undefined) {
    if (!id && $("#pageLeft .box[con=on]").length == 0) id = "home";
    $(".bottomBar .item").attr("data-active", "false");
    $(".bottomBar .item[data-bar-id=" + id + "]").attr("data-active", "true");
}

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
        // 如果有alert，关闭
        if (hoverArea.getElementsByClassName("alertBox").length > 0) {
            $(".alertBox:last button:last").click();
        }
        // 如果有viewer，关闭
        else if (document.body.getElementsByClassName("viewer-in").length > 0) {
            $(".viewer-button.viewer-close:last").click();
        }
        // 如果有右键菜单，关闭
        else if (hoverArea.getElementsByClassName("contextMenu").length > 0) {
            hoverArea.getElementsByClassName("contextMenu")[hoverArea.getElementsByClassName("contextMenu").length - 1].click();
        }
        // 如果有popFrame，关闭
        else if ($(".popFrame[open=true]").length > 0) {
            $(".popFrame[open=true]")[$(".popFrame[open=true]").length - 1].getElementsByClassName("backButton")[0].click();
        }
        else if (getOpenBoxes("pageRight").length > 0)
            closeBox("pageRight", getOpenBoxes("pageRight")[0][1], false, "system");
        else if (getOpenBoxes("pageLeft").length > 0)
            closeBox("pageLeft", getOpenBoxes("pageLeft")[0][1], false, "system");
        // else openSideBar();
    }, false);
});

// pop
function openPop(ele) {
    writeLog("i", "openPop", "ele: " + ele);
    ele.setAttribute("open", "true");
    setPopScale();
    pushHistory("pop_" + ele);
}

function closePop(ele, totally = false) {
    writeLog("i", "closePop", "ele: " + ele);
    ele.setAttribute("open", "false");
    setPopScale();
    if (totally) {
        setTimeout(() => {
            ele.outerHTML = "";
        }, 1000);
    }
    pushHistory("");
}

// scale
function setPopScale() {
    if ($(".popFrame[open=true]").length > 0) {
        document.body.setAttribute("scale", "true");
        if ($(".popFrame[open=true]").length > 1) $(".popFrame[open=true]").attr("data-behind", "true");
        $(".popFrame[open=true]")[$(".popFrame[open=true]").length - 1].setAttribute("data-behind", "false");
    }
    else {
        document.body.setAttribute("scale", "false");
    }
    console.log("setPopScale");
}

$("body").bind("DOMNodeInserted", function () {
    $(".popFrame").bind("change", function (e) {
        setPopScale();
    });
    setPopScale();
});
// 初始化
$.ajax({
    type: "GET",
    url: backEndURL + "/info.php",
    async: true,
    dataType: "json",
    success: function (response, status, request) {
        writeLog("i", "get backend site info", JSON.stringify(response));
        try {
            // 首页轮播图
            eval(response['info']['header_swiper']).forEach(element => {
                indexSwiperBox.innerHTML += `<div class="swiper-slide" onclick="` + element[1] + `" title="` + element[2] + `" style="background-image: url('` + element[0] + `'); background-position: 50% 50%;">` + element[3] + `</div>`;
            });
            // 首页分类
            moreCategoryList = eval(response['info']['category']);
            categoryList = systemCategoryList.concat(moreCategoryList);
            initPostsListMonitor($("#indexMainCards"));
            categoryList.forEach(element => {
                indexMoreTypes.innerHTML += `<label for="indexType_${element['id']}"><input id="indexType_${element['id']}" onclick="indexSwitchType('${element['id']}');" type="radio" name="indexType"><span>${element['name']}</span></label>`;
                indexMainLists.innerHTML += `<div id="indexPostsList_${element['id']}"></div>`;
                initPostsList($("#indexPostsList_" + element['id']), { "type": "post", "search": { "category": element['id'] }, "noOther": true });
            });
            // 选择默认分类
            if (!document.getElementById(localStorage.typeSelected))
                localStorage.typeSelected = "indexType_";
            document.getElementById(localStorage.typeSelected).click();
            closeHover();
            roleList = response['info']['role'];
        }
        catch (err) {
            writeLog("e", "setting site main", err);
            console.error(err);
            alert("抱歉，加载 nmFun 重要组件时出现错误，可能导致 nmFun 体验出现问题。请尝试刷新页面，若问题持续存在，请联系 nmFun 支持。<br><br><b>错误详情：</b><code>" + err + "</code>", "好像出了点问题…", "仍要继续", "closeHover();", "刷新", "window.location.href=''");
        }
    },
    error: function () {
        writeLog("e", "get backend site info", "ajax error");
        alert("抱歉，与 nmFun 的连接出现问题。请尝试刷新页面，或检查您的网络状况。若问题持续存在，请联系 nmFun 支持。", "nm，出错了", "刷新", "window.location.href=''", "查看高级菜单(开发者)", "showTestField()");
    }
});

startInv = null;

function closeHover() {
    try {
        $(startHover).attr("data-closed", "true");
        writeLog("i", "closeHover", "done");
        $("body").attr("data-loadover", "true");
        console.log("closeHover closed");
        postInputInit();
        loadWelcomePage();
        setTimeout(() => {
            startHover.outerHTML = "";
        }, 400);
    }
    catch (err) {
        writeLog("e", "closeHover", err);
        setTimeout(() => {
            closeHover();
        }, 400);
    }
}

function indexSwitchType(typeName) {
    localStorage.typeSelected = "indexType_" + typeName;
    loadPostsList($("#indexPostsList_" + typeName));
    focusInPostsList($("#indexMainCards"), $("#indexPostsList_" + typeName));
}

// 键盘事件
window.onkeydown = function (event) {
    // 定义按键
    esc = event.keyCode == 27;
    ctrl = event.ctrlKey;
    shift = event.shiftKey;
    enter = event.keyCode == 13;
    // ESC 侧栏
    if (esc) {
        writeLog("i", "Keyboad Event", "ESC");
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
        // 否则，删除顶栏的open参数
        else pageHeader.removeAttribute("open");
        return false;
    }
    // Enter 关闭 alert
    if (enter && document.getElementsByClassName("alertBox").length > 0 && document.activeElement.className.indexOf("negative") == -1) {
        document.getElementsByClassName("alertBox")[document.getElementsByClassName("alertBox").length - 1].getElementsByClassName("positive")[0].click();
    }
}

// 首页的滚动屏
try {
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal', // 垂直切换选项
        loop: true, // 循环模式选项
        speed: 300,
        resizeObserver: true,
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
}
catch (err) {
    writeLog("e", "index swiper", err);
}

// thinmode
if (localStorage.thinMode == "true") {
    bodyMain.setAttribute("thinable", "true");
}
else bodyMain.removeAttribute("thinable");

// 登录 
inv = setInterval(() => {
    if (getInfo) {
        clearInterval(inv);
        setHeaderLog();
    }
}, 10);

// 预定义的选项表
settingsPreDefineList = [["region", "China Standard Time (UTC + 8:00)"], ["zone", 8], ["usebrowser", "true"], ["thinMode", "true"], ["autoSaveCraft", "false"], ["bigText", "false"], ["noAni", "false"], ["showbuttonAni", "true"]];

for (settingsPDT = 0; settingsPDT < settingsPreDefineList.length; settingsPDT++) {
    if (!localStorage.getItem(settingsPreDefineList[settingsPDT][0])) {
        localStorage.setItem(settingsPreDefineList[settingsPDT][0], settingsPreDefineList[settingsPDT][1]);
        writeLog("i", "set default setting", "" + settingsPreDefineList[settingsPDT][0] + ", " + settingsPreDefineList[settingsPDT][1]);
    }
}

// 自动切换主题色
if (localStorage.usebrowser == "true") {
    console.log("正在识别系统主题...");
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        switchTheme("dark");
    else switchTheme("default");
}

// 测试版显示
if (version.betaVersion) {
    debugInfo.innerHTML += `nmFun Beta Version ` + version.version + `(` + version.versionNum + `_` + version.branch + `). For Test Purpose only. <br>Content on the page does not represent the final quality. `;
}

// 保存到草稿箱按钮
if (localStorage.getItem("autoSaveCraft") == "true") {
    $(".editbox-save").attr("style", "display: none");
    writeLog("i", "autoSaveCraft", "autoSaveCraft open, save button hidden");
}

// 欢迎页面
welcomeFrameHTML = `
<div class="popFrame welcomeFrame" id="welcomeFrame" open="true" style="display:none">
    <link rel="stylesheet" type="text/css" href="src/css/welcome.css">
    <header id="welcomeFrame_frameHeader">
        <div class="left">
            <div class="nameDiv">
                <p class="title">欢迎使用 nmFun</p>
                <p class="little"></p>
            </div>
        </div>
        <div class="right"> </div>
    </header>
    <div class="main" id="welcomeFrame_main">
        <div class="welcome_icon" id="welcome_icon" title="nmFun Icon"></div>
        <h1 class="welcome_Header" id="welcome_Header">欢迎使用 nmFun</h1>
        <p class="welcome_FirstIntroduce" id="welcome_Header">nmFun 将为您营造全新的看乐子体验。</p>
        <div class="welcome_Intro" id="welcome_Intro">
            <div class="intro_item">
                <i style="background-image: url(./src/img/welcome/laugh.svg);" title="大笑"></i>
                <div class="intro">
                    <h2>让读者开心的乐子，开了又开</h2>
                    <p>有用户的大力支持，nmFun 将源源不断地更新新的高质量乐子。</p>
                </div>
            </div>
            <div class="intro_item">
                <i style="background-image: url(./src/img/welcome/act.svg);" title="用户在 nmFun 愉快的互动"></i>
                <div class="intro">
                    <h2>独乐乐不如众乐乐</h2>
                    <p>精彩的评论也是乐子的一部分。<br />nmFun 包含的丰富互动功能使乐子画龙点睛，更上一层楼。</p>
                </div>
            </div>
            <div class="intro_item">
                <i style="background-image: url(./src/img/welcome/minutiae.svg);" title="nmFun 正在研究细节"></i>
                <div class="intro">
                    <h2>细节决定成败</h2>
                    <p>nmFun 历经百般打磨，每一处细节都让使用更简单高效。</p>
                </div>
            </div>
            <div class="intro_item">
                <i style="background-image: url(https://logos.nmteam.agou.im/nmTeam/logo@64.png);"
                    title="nmTeam"></i>
                <div class="intro">
                    <h2>由 nmTeam 开发</h2>
                    <p>nmFun 由 nmTeam 开发和运营，定能保证您的优质体验。</p>
                </div>
            </div>
        </div>
        <button class="welcome_goButton" title="开始使用 nmFun"
            onclick="welcomeFrame_close();">开始使用
            nmFun</button>
            <button class="welcome_knowMore" title="转到 nmTeam 官方网站上对 nmFun 的介绍" onclick="welcomeFrame_close(); newBrowser('https://nmteam.xyz/products/nmFun', false, false, true)">了解更多<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2323"><path d="M247.168 776.832a42.666667 42.666667 0 0 1 0-60.330667l388.544-388.544h-277.333333a42.666667 42.666667 0 1 1 0-85.333333h384a42.666667 42.666667 0 0 1 42.666666 42.666667v384a42.666667 42.666667 0 1 1-85.333333 0V384.64L307.498667 776.832a42.666667 42.666667 0 0 1-60.330667 0z"></path></svg></div>
    </div>
</div>
<div class="coverWithColor pop sendCover" id="welcomeFramePop" hidden open="true">
    <div class="content">
        <i></i>
        <p>正在加载</p>
    </div>
</div>
`;

function loadWelcomePage() {
    if (localStorage.getItem("started") != "true") {
        startPage = document.createElement("div");
        startPage.innerHTML = welcomeFrameHTML;
        document.body.appendChild(startPage);
        writeLog("i", "welcomeFrame", "shown");
        welcomeFrame_main.onscroll = function () {
            if (welcomeFrame_main.scrollTop > welcome_icon.offsetHeight + 40)
                welcomeFrame_frameHeader.setAttribute("hidden", "false");
            else welcomeFrame_frameHeader.setAttribute("hidden", "true");
            if (welcomeFrame_main.scrollTop < welcome_icon.offsetHeight * 0.63)
                welcome_icon.setAttribute("hidden", "false");
            else welcome_icon.setAttribute("hidden", "true");
        }
        welcomeFrame_close = function () {
            document.getElementById('welcomeFramePop').removeAttribute('open');
            welcomeFrame.setAttribute('open', 'false');
            localStorage.started = 'true';
        }
    }
}

// 搜索
initSearch();
// sTypeR_all.click();
function initSearch() {
    searchResults.innerHTML = `
    <div id="searchResultsContainer" class="cardsListsContainer">
        <div id="sRes_all"></div>
        <div id="sRes_post"></div>
        <div id="sRes_user"></div>
    </div>
    <div class="postMainReal card avatarBox" id="sBoxDefault">
        <div class="unavaliable search-not-start" noselect><i></i>
        </div>
    </div>`;
    initPostsListMonitor($(`#searchResults`));
}

function search() {
    initSearch();
    sWord = searchFrame_input.value;
    initPostsList($(`#sRes_all`), { "type": "post", "search": { "type": "all", "keyword": sWord }, "order": { "time": sRankTime, "type": sRankType }, "noOther": true });
    initPostsList($(`#sRes_post`), { "type": "post", "search": { "type": "post", "keyword": sWord }, "order": { "time": sRankTime, "type": sRankType }, "noOther": true });
    initPostsList($(`#sRes_user`), { "type": "search", "search": { "type": "user", "keyword": sWord }, "noOther": true });
    $("#sType :checked")[0].click();
    writeLog("i", "search", "search_" + sWord + "_" + $("#sType :checked")[0].innerHTML);
    if (sBoxDefault) sBoxDefault.outerHTML = "";
}

// 搜索正序倒序
sRankTime = "DESC";

function switchSearchRankTime() {
    if (sRankTime == "DESC") {
        sRankTime = "ASC";
        $("#sRankTimeR+span").html("正序");
    }
    else {
        sRankTime = "DESC";
        $("#sRankTimeR+span").html("倒序");
    }
    search();
}

// 搜索排序
sRankType = "time";

sRankTypeJSON = {
    "time": { "name": "发布时间", "icon": "access_time" },
    "view": { "name": "阅读量", "icon": "remove_red_eye" },
    "like": { "name": "点赞量", "icon": "thumb_up" },
    "comment": { "name": "评论量", "icon": "comment" },
};

function switchSearchRankType(typeId) {
    sRankType = typeId;
    $("#sRankTypeR+span").html(sRankTypeJSON[typeId]['name'])
    if (typeId != "time") {
        newMsgBox("非按时间排序的搜索结果可能不完全。请尝试使用更准确的搜索词或切换到按时间排序以获得精确结果。");
    }
    search();
}

function showSwitchSearchRankTypeContextMenu() {
    sSRTCMI = [];
    for (var i in sRankTypeJSON) {
        sSRTCMI.push([sRankTypeJSON[i]['name'], "switchSearchRankType('" + i + "')", sRankTypeJSON[i]['icon']]);
    }
    createContextMenu(sSRTCMI, true, true, sRankTimeR);
}
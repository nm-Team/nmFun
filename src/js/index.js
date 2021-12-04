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
        // 否则，删除顶栏的open参数
        pageHeader.removeAttribute("open");
        return false;
    }
    // Enter 关闭 alert
    if (enter && document.getElementsByClassName("alertBox").length > 0 && document.activeElement.className.indexOf("negative") == -1) {
        document.getElementsByClassName("alertBox")[document.getElementsByClassName("alertBox").length - 1].getElementsByClassName("positive")[0].click();
    }
}

// 首页的滚动屏
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

// thinmode
if (localStorage.thinMode == "true") {
    bodyMain.setAttribute("thinable", "true");
}
else bodyMain.removeAttribute("thinable");

// 首窗口的Theme按钮事件
function showMainPageThemeContextMenu(ele) {
    msgContextMenuItems = [];
    if (localStorage.usebrowser == "true") msgContextMenuItems = [[i18n.t("theme.usebrowser"), "newLegacyBrowser('/settings/theme.html', false, false)"]];
    else {
        msgContextMenuItems = ["line"];
        for (themeFor = 0; themeFor < themeList.length; themeFor++)
            msgContextMenuItems[themeFor] = [i18n.t("theme." + themeList[themeFor] + ""), "switchTheme('" + themeList[themeFor] + "')"];
        msgContextMenuItems[themeFor] = ["line"];
        msgContextMenuItems[themeFor + 1] = [i18n.t("theme.more"), "newLegacyBrowser('/settings/theme.html', false, false)", "&#xe8b8;"];
    } createContextMenu(msgContextMenuItems, undefined, undefined, ele);
}

// 登录 
inv = setInterval(() => {
    if (getInfo) {
        clearInterval(inv);
        setHeaderLog();
    }
}, 10);

// 预定义的选项表
settingsPreDefineList = [["region", "China Standard Time (UTC + 8:00)"], ["zone", -8], ["usebrowser", "true"], ["thinMode", "true"], ["autoSaveCraft", "false"], ["bigText", "false"]];

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
    bVE = document.createElement("div");
    bVE.setAttribute("style", "position: fixed; bottom: 6px; right: 10px; font-size: 12px; color: var(--page-bgcolor); filter: invert(1); z-index: 9999999999999999999999999999999; ");
    bVE.innerHTML = `nmFun Beta Version ` + version.version + `(` + version.versionNum + `_` + version.branch + `). For Test Purpose only. <br>Content on the page does not represent the final quality. `;
    document.body.appendChild(bVE);
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
<div class="coverWithColor pop" id="welcomeFramePop" hidden open="true"></div>
`;

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
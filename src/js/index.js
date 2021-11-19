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

// 首窗口的Theme按钮事件
function showMainPageThemeContextMenu(ele) {
    msgContextMenuItems = [];
    for (themeFor = 0; themeFor < themeList.length; themeFor++)
        msgContextMenuItems[themeFor] = [i18n.t("theme." + themeList[themeFor] + ""), "switchTheme('" + themeList[themeFor] + "')"];
    msgContextMenuItems[themeFor] = ["line"];
    msgContextMenuItems[themeFor + 1] = [i18n.t("theme.more"), "newLegacyBrowser('/settings/theme.html', false, false),openSideBar()", "&#xe8b8;"];
    createContextMenu(msgContextMenuItems, undefined, undefined, ele);
}
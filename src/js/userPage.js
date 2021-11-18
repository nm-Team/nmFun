// Header动画
$(".userFrame .main .userMainCards").scroll(function (e) {
    userFrameHeaderHeight = 180;
    userFrameStrollPercent = (this.scrollTop / userFrameHeaderHeight > 1 ? 1 : this.scrollTop / userFrameHeaderHeight);
    if (userFrameStrollPercent == 1) this.parentNode.getElementsByClassName("typeSelecter")[0].setAttribute("fly", "true");
    else this.parentNode.getElementsByClassName("typeSelecter")[0].setAttribute("fly", "false");
    this.getElementsByClassName("placeHolder")[0].style.height = (userFrameStrollPercent * userFrameHeaderHeight) + "px";
    this.parentNode.getElementsByClassName("userHeader")[0].style.height = ((1 - userFrameStrollPercent) * userFrameHeaderHeight) + "px";
    this.parentNode.getElementsByClassName("uHeaderMain")[0].style.height = ((1 - userFrameStrollPercent) * userFrameHeaderHeight) + "px";
});

// 菜单
function showUserPageContextMenu(uid, ele) {
    if (uid == myUid) {
        cMenuItems = [["编辑资料", "", "edit"]];
    }
    else {
        cMenuItems = [["屏蔽", ""], ["举报", "", "report"]];
    }
    createContextMenu(cMenuItems, undefined, undefined, ele);
}
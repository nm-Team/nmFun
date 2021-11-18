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
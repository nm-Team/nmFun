// 打开新用户信息页
function newUserInfoPage(uid, uNick, noOther = false) {
    if (isNaN(uid) || uid == 0) return newMsgBox("参数错误，无法打开用户页面");
    try {
        //如果有则定位
        try {
            focusBox("pageRight", 'userInfoFrame_' + uid, noOther);
        }
        catch (error) { // 没有则创建
            new_element = document.createElement('div');
            new_element.setAttribute('id', "userInfoFrame_" + uid);
            new_element.setAttribute('class', 'userFrame box rightBox');
            new_element.setAttribute('con', 'none');
            new_element.setAttribute('totallyclose', 'true');
            new_element.setAttribute('uid', uid);
            new_element.setAttribute('name', uNick);
            new_element.setAttribute('data-url', 'user_' + uid + "_" + escape(uNick));
            new_element.setAttribute('noother', noOther);
            new_element.innerHTML = uPageTemp.replace(/{{uid}}/g, uid).replace(/{{nick}}/g, uNick).replace(/{{avatar}}/g, avatarURL.replace(/{id}/g, uid)).replace(/{{background}}/g, backEndURL + "/user/background/index.php?id=" + uid + "&t=" + gTime());
            pageRight.appendChild(new_element);
            focusBox("pageRight", "userInfoFrame_" + uid, noOther);
            initPostsListMonitor($(`#userPage_${uid}_postsListScrollMonitor`));
            initPostsList($(`#userPage_${uid}_postsList_posts`), { "type": "post", "search": { "uid": uid }, "noOther": false });
            initPostsList($(`#userPage_${uid}_postsList_comments`), { "type": "user_comment", "uid": uid, "rank_type": "DESC" });
            refreshUserInfoArea(uid);
            focusInPostsList($(`#userPage_${uid}_postsListScrollMonitor`), $(`#userPage_${uid}_postsList_info`));
            refreshFloatFrameOnScroll();
        };
    }
    catch (err) {
        console.error(err);
    }
}

function refreshUserInfoArea(uid) {
    if (isNaN(uid)) return;
    newAjax("POST", backEndURL + "/user/getuser.php", true, "uid=" + uid, {}, function (data) {
        if (data['status'] == "successful") {
            pData = data['data'];
            $(`#userInfoFrame_${uid} .urole`).html(getNickHTML(pData, { "nick": false }));
            $(`#userInfoFrame_${uid} .ubio`).html(cleanHTMLTag(pData['bio']));
            $("[data-disabled-uid=" + uid + "]").attr("data-show", pData['disabled'] == 1 ? "true" : "false");
            $("[data-disabled-time-uid=" + uid + "]").attr("timestamp", pData['disabled_time']);
            $("[data-following-num-uid=" + uid + "]").html(pData['followings_num']);
            $("[data-followers-num-uid=" + uid + "]").html(pData['followers_num']);
            $("[data-gain-likes-num-uid=" + uid + "]").html(pData['receive_like']);
            $("[data-posts-num-uid=" + uid + "]").html(pData['publish_post']);
            $("[data-replies-num-uid=" + uid + "]").html(pData['publish_comment']);
            $("[data-my-following-to-uid=" + uid + "]").attr("data-follow", (pData['is_myself'] ? "edit" : (pData['i_followed'] ? (pData['followed_me'] ? "both" : "true") : (pData['followed_me'] ? "followedme" : "false"))));
            setTimeTexts();
            if (pData['blocked'] == 1) {
                $(`#userInfoFrame_${uid} .blockTip`).css("display", "flex");
            }
            if (pData['hide_follow'] == 1 && uid != myUid) {
                $(`#u${uid}FollowButton`).attr("onclick", "newMsgBox('根据用户的隐私设置，你无法查看他的关注。')");
            }
            else {
                $(`#u${uid}FollowButton`).attr("onclick", `showUserFollowListPage(${uid},'${$(`#userInfoFrame_${uid} .uHeaderInfos .name`).html()}','followings');`);
            }
            if (pData['hide_post'] == 1 && uid != myUid) {
                $(`#userPage_${uid}_postsList_posts`).attr("data-config", JSON.stringify({ "type": "undefined" }));
                $(`#userPage_${uid}_postsList_posts`).html(`<div class="card" noselect><div class="content"><center>根据用户的隐私设置，你无法查看他发布的帖子。</center></div></div>`);
            }
            else {
                loadPostsList($(`#userPage_${uid}_postsList_posts`));
            }
            if (pData['hide_comment'] == 1) {
                $(`#userPage_${uid}_postsList_comments`).attr("data-config", JSON.stringify({ "type": "undefined" }));
                $(`#userPage_${uid}_postsList_comments`).html(`<div class="card" noselect><div class="content"><center>根据用户的隐私设置，你无法查看他发布的评论。</center></div></div>`);
            }
            else {
                loadPostsList($(`#userPage_${uid}_postsList_comments`));
            }
            if ((pData['hide_like'] != 1 || pData['is_myself']) && pData['recent_like'].length != 0) {
                uRecentLikePreview = "";
                pData['recent_like'].forEach(element => {
                    uRecentLikePreview += `<button onclick="newPostDetailPage('${element['pid']}')">${element['title'] ? "<div><p class='t'>" + element['title'] + "</p>" : ""}<p class='s'>${contentFormat(element['content'])}</p></div>${element['attachment'] ? "<i style='background-image: url(" + attachURL + element['attachment']['src'] + ")'></i>" : ""}</button>`;
                });
                $(`#userInfoFrame_${uid} .recentLikeBox`).css("display", "block");
                $(`#userInfoFrame_${uid} .recentLikeArea`).html(uRecentLikePreview);
            }
            else {
                $(`#userInfoFrame_${uid} .recentLikeBox`).css("display", "none");
            }
            if (uid == myUid) {
                $("[data-mypoint]").html(pData['point']);
            }
            $(`#userInfoFrame_${uid} .postsListBar .refresh`).click(function () {
                refreshUserInfoArea(uid);
            });
        }
        else {
            newMsgBox("用户信息加载失败");
            writeLog("e", "refreshUserInfoArea", `uid${uid}信息加载失败: ${data['info']}`);
        }
    }, function () {
        newMsgBox("用户信息加载失败");
        writeLog("e", "refreshUserInfoArea", `uid${uid}信息加载失败: JSON未解析`);
    });
}

uPageTemp = `
<header>
    <div class="left">
        <button class="backButton" title="返回" onclick="closeBox('pageRight','userInfoFrame_{{uid}}')" oncontextmenu="quickBack('pageRight',this)" ontouchstart="longPressToDo(function(){quickBack('pageRight', $('#userInfoFrame_{{uid}} .backButton')[0])})" ontouchend="longPressStop()"><i class="material-icons"></i></button>
        <div class="nameDiv">
            <p class="title">{{nick}}</p>
            <p class="little"></p>
        </div>
    </div>
    <div class="right">
        <button onclick="showUserPageContextMenu({{uid}},'{{nick}}',this)" title="选项"><i class="material-icons"></i></button>
    </div>
</header>
<div class="main floatFrame">
    <div class="userHeader floatFrame-header">
        <div class="uHeaderMain floatFrame-header" style="background-image: url('{{background}}')">
            <div class="lin"></div>
            <div class="uHeaderInfos">
                <div class="disabled" title="此用户封禁中" data-disabled-uid="{{uid}}"></div>
                <button class="avatar" style="background-image: url('{{avatar}}');" onclick="localStorage.imgSrc='{{avatar}}'; newBrowser('imgviewer.html',false,false,false)"></button>
                <div class="name">{{nick}}</div>
                <div class="urole"></div>
                <div class="data">
                    <button id="u{{uid}}FollowButton" onclick="newMsgBox('加载中')">关注<span class="num" data-following-num-uid="{{uid}}"><span class="skeleton" style="padding-right: 2em"></span></span></button>
                    <button onclick="showUserFollowListPage({{uid}},'{{nick}}','followers' );">粉丝<span class="num" data-followers-num-uid="{{uid}}"><span class="skeleton" style="padding-right: 2em"></span></span></button>
                    <button>获赞<span class="num" data-gain-likes-num-uid="{{uid}}"><span class="skeleton" style="padding-right: 2em"></span></span></button>
                </div>
                <div class="interaction" data-my-following-to-uid="{{uid}}" data-follow="loading">
                <button class="followButton nega" onclick="followUser('{{uid}}',false, $(this));" data-stat="false" title="关注"><i class="material-icons">add</i><span>关注</span></button>
                <button class="followButton posi" onclick="alert('确认要取消关注 <b>{{nick}}</b> 吗？','取消关注','取消关注','followUser(\`{{uid}}\`,true, $(this));','再想想');" data-stat="true" title="取消关注"><i class="material-icons">check</i><span>已关注</span></button>
                <button class="followButton nega" onclick="followUser('{{uid}}',false, $(this));" data-stat="followedme" title="关注"><i class="material-icons">check</i><span>关注了我</span></button>
                <button class="followButton posi" onclick="alert('确认要取消关注 <b>{{nick}}</b> 吗？','取消关注','取消关注','followUser(\`{{uid}}\`,true, $(this));','再想想');" data-stat="both" title="取消关注"><i class="material-icons">done_all</i><span>互相关注</span></button>
                <button class="followButton nega" onclick="newLegacyBrowser('/settings/account.html', false, false);" data-stat="edit" title="编辑个人资料"><i class="material-icons">edit</i><span>编辑资料</span></button>
                <button class="followButton nega" data-stat="loading" title="加载中"><span>加载中</span></button>
        </div>
            </div>
        </div>
    </div>
    <div class="typeContainer" noselect>
        <div class="typeSelecter">
            <label for="uPage_{{uid}}_s_info"><input id="uPage_{{uid}}_s_info" type="radio" name="uPage_{{uid}}_s" checked onclick="focusInPostsList($('#userPage_{{uid}}_postsListScrollMonitor'), $('#userPage_{{uid}}_postsList_info'));"><span>简介</span></label>
            <label for="uPage_{{uid}}_s_posts"><input id="uPage_{{uid}}_s_posts" type="radio" name="uPage_{{uid}}_s" onclick="focusInPostsList($('#userPage_{{uid}}_postsListScrollMonitor'), $('#userPage_{{uid}}_postsList_posts'));"><span>帖子<n data-posts-num-uid="{{uid}}"></n></span></label>
            <label for="uPage_{{uid}}_s_replies"><input id="uPage_{{uid}}_s_replies" type="radio" name="uPage_{{uid}}_s" onclick="focusInPostsList($('#userPage_{{uid}}_postsListScrollMonitor'), $('#userPage_{{uid}}_postsList_comments'));"><span>评论<n data-replies-num-uid="{{uid}}"></n></span></label>
        </div>
    </div>
    <div class="userMainCards equalPages floatFrame-content postsListScrollMonitor" id="userPage_{{uid}}_postsListScrollMonitor">
        <div class="placeHolder"></div>
            <div id="userPage_{{uid}}_postsListContainer" class="cardsListsContainer">
                <div id="userPage_{{uid}}_postsList_info" class="cardBox postsList cardBox postCardBox">
                <div class="card">
                   <div class="header"><div class="name">签名</div></div> 
                   <div class="content ubio">
                        <span class="skeleton" style="padding-right: 100%; margin-bottom: 4rem;"></span><br>
                        <span class="skeleton" style="padding-right: 100%"></span>
                    </div>
                </div>
                <div class="card blockTip" style="display: none;">
                    <div class="header">
                        <div class="name">已屏蔽</div>
                        <div class="buttons">
                            <button onclick="blockUser({{uid}})" title="取消屏蔽"><i class="material-icons">delete</i></button>
                        </div>
                    </div> 
                    <div class="content">
                        您已屏蔽该用户。
                    </div>
                </div>
                <div class="card recentLikeBox">
                    <div class="header" style="cursor: pointer" onclick="showUserRecentLikePage('{{uid}}','{{nick}}')">
                        <div class="name">最近点赞的帖子</div>
                        <div class="buttons">
                            <button title="查看更多"><i class="material-icons">chevron_right</i></button>
                        </div>
                    </div>
                    <div class="main recentLikeArea lightPostsList">
                        <button disabled class="skeleton"></button>
                        <button disabled class="skeleton"></button>
                        <button disabled class="skeleton"></button>
                    </div>
                </div>
            </div>
            <div id="userPage_{{uid}}_postsList_posts"></div>
            <div id="userPage_{{uid}}_postsList_comments"></div>
        </div>
    </div>
</div>
`;

// 关注
function followUser(uid, unfollow = false, ele) {
    if (logRequire()) {
        if (!unfollow) {
            // 展示关注动画
            if (localStorage.showButtonAni == "true") {
                $("body .scaleArea").append(`<div class="buttonAni followAni" data-follow-ani-uid-${uid}>
                    <div class="f"></div>
                    <div class="b"></div>
                </div>
                <style>
                .followAni[data-follow-ani-uid-${uid}]{
                    animation: data-follow-ani-${uid} 2s;
                }
                @keyframes data-follow-ani-${uid}{
                    0%{
                        top: ${ele.find("i")[0].getBoundingClientRect().top}px;
                        left: ${ele.find("i")[0].getBoundingClientRect().left}px;
                    }
                    60%{
                        top: 50vh;
                        left: 50vw;
                        transform: translate(-50%, -50%);
                    }
                    100%{
                        top: 50vh;
                        left: 50vw;
                        transform: translate(-50%, -50%);
                    }
                }
                </style>`);
            }
        }
        switch ($("[data-my-following-to-uid=" + uid + "]").attr("data-follow")) {
            case "false":
                newFollowSta = "true";
                break;
            case "true":
                newFollowSta = "false";
                break;
            case "both":
                newFollowSta = "followedme";
                break;
            case "folllowedme":
                newFollowSta = "both";
                break;
        }
        $("[data-my-following-to-uid=" + uid + "]").attr("data-follow", "loading");
        newAjax("POST", backEndURL + "/user/follow.php", true, "uid=" + uid + (unfollow ? "&unfollow" : ""), "", function () { writeLog("i", "followUser", "follow user " + uid + " success, unfollow=" + unfollow); refreshUserInfoArea(uid); refreshUserInfoArea(myUid) }, function (data) { writeLog("i", "followUser", "follow user " + uid + " error, unfollow=" + unfollow); newMsgBox((unfollow ? "取消" : "") + "关注失败，因为" + data['info']); refreshUserInfoArea(uid); });
    }
}

// 菜单
function showUserPageContextMenu(uid, unick, ele) {
    cMenuItems = [{ "name": "拷贝分享链接", "onclick": "copyToClipboard('" + siteURL + "#" + "user" + "_" + uid + "_" + escape(unick) + "')", "icon": "content_copy" }, { "name": "line" }];
    if (gRole("ban_user")) {
        cMenuItems.push({ "name": "封禁 (管理员)", "onclick": "banUser(" + uid + ")", "icon": "remove_circle" }, { "name": "line" });
    }
    if (uid == myUid) {
        cMenuItems.push({ "name": "编辑资料", "onclick": "newLegacyBrowser('/settings/account.html', false, false)", "icon": "edit" });
    }
    else {
        cMenuItems.push({ "name": "举报", "onclick": "report('user','" + uid + "','','')", "icon": "warning" }, { "name": "屏蔽", "onclick": "blockUser(" + uid + ")", "icon": "block" });
    }
    createContextMenu({ "items": cMenuItems, "position": { "element": ele, "atLeft": true, alignWidth: "right", alignHeight: "bottom" } });
}

// 关注列表/粉丝列表
function showUserFollowListPage(uid, uNick, type) {
    if (logRequire()) {
        try {
            //如果有则定位
            try {
                focusBox("pageRight", 'followListFrame_' + uid, false);
            }
            catch (error) { // 没有则创建
                new_element = document.createElement('div');
                new_element.setAttribute('id', "followListFrame_" + uid);
                new_element.setAttribute('class', 'followListFrame box rightBox');
                new_element.setAttribute('con', 'none');
                new_element.setAttribute('totallyclose', 'true');
                new_element.setAttribute('uid', uid);
                new_element.setAttribute('name', uNick);
                new_element.setAttribute('data-unick', uNick);
                new_element.setAttribute('noother', 'false');
                new_element.innerHTML = followListTemplate.replace(/{{uid}}/g, uid).replace(/{{nick}}/g, uNick).replace(/{{avatar}}/g, avatarURL.replace(/{id}/g, uid));
                pageRight.appendChild(new_element);
                focusBox("pageRight", "followListFrame_" + uid, false);
                initPostsListMonitor($(`#followListFrame_${uid}_lScrollMonitor`));
                initPostsList($(`#followListFrame_${uid}_l_followings`), { "type": "follow", "search": { "uid": uid, "type": "followings" }, "noOther": false });
                initPostsList($(`#followListFrame_${uid}_l_followers`), { "type": "follow", "search": { "uid": uid, "type": "followers" }, "noOther": false });
            };
            $(`#followListFrame_${uid}_${type}`).click();
        }
        catch (err) {
            console.error(err);
        }
    }
}

followListTemplate = `
<header>
    <div class="left">
        <button class="backButton" title="返回" onclick="closeBox('pageRight','followListFrame_{{uid}}',false);"
            oncontextmenu="quickBack('pageRight',this)"
            ontouchstart="longPressToDo(function(){quickBack('pageRight', $('#followListFrame_{{uid}} .backButton')[0])})"
            ontouchend="longPressStop()"><i class="material-icons"></i></button>
        <div class="nameDiv">
            <p class="title">{{nick}}</p>
            <p class="little"></p>
        </div>
    </div>
    <div class="right"></div>
</header>
<div class="cardBox postCardBox main">
    <div class="" >
        <div class="typeSelecter" fly="true" noselect>
            <label for="followListFrame_{{uid}}_followings"><input type="radio" id="followListFrame_{{uid}}_followings" name="followListFrame_{{uid}}_f" onclick="focusInPostsList($('#followListFrame_{{uid}}_lScrollMonitor'), $('#followListFrame_{{uid}}_l_followings')); $('#followListFrame_{{uid}}').attr('name',$('#followListFrame_{{uid}}').attr(\`data-unick\`)+'的关注')"><span>关注</span></label>
            <label for="followListFrame_{{uid}}_followers" ><input type="radio" id="followListFrame_{{uid}}_followers"  name="followListFrame_{{uid}}_f" onclick="focusInPostsList($('#followListFrame_{{uid}}_lScrollMonitor'), $('#followListFrame_{{uid}}_l_followers'));  $('#followListFrame_{{uid}}').attr('name',$('#followListFrame_{{uid}}').attr(\`data-unick\`)+'的粉丝')""><span>粉丝</span></label>
        </div>
    </div>
    <div class="userMainCards equalPages floatFrame-content postsListScrollMonitor" id="followListFrame_{{uid}}_lScrollMonitor">
        <div id="followListFrame_{{uid}}_lContainer" class="cardsListsContainer">
                <div id="followListFrame_{{uid}}_l_followings"></div>
                <div id="followListFrame_{{uid}}_l_followers" ></div>
        </div>
    </div>
</div>`;

// 屏蔽用户 
function blockUser(uid) {
    if (logRequire()) {
        sta = blockList.indexOf(String(uid)) > -1 || blockList.indexOf(Number(uid)) > -1 ? true : false;

        writeLog("i", "blockUser", "get block user " + uid + " status success");
        alert((sta ? "是否要取消屏蔽该用户？" : "是否要确认屏蔽该用户？<br><br>您将不会在信息流中看到他的动态，他也无法在个人主页查看您的签名、最近点赞、发帖和评论列表。"), (sta ? "已屏蔽此用户" : "屏蔽此用户"), "确认", "confirmBlockUser(" + uid + ", " + sta + ")", "取消");
    }
}

function confirmBlockUser(uid, unblock) {
    $("body").append(`<div id="blockCover" class="sendCover unscaleArea" open="true" noselect><div class="content"><i></i><p>正在操作</p></div></div>`);
    newAjax("GET", backEndURL + "/user/blocklist.php", true, "action=" + (unblock ? "del" : "add") + "&uid=" + uid, {}, function (d) {
        $("#blockCover").remove();
        newMsgBox((unblock ? "取消" : "") + "屏蔽成功！<br>可能需要重载 nmFun 才能应用全部更改。");
        if (!unblock) $("[data-postlist-post-uid=" + uid + "]").remove();
        if (d.blocklist) blockList = d.blocklist;
        if (unblock) {
            $("[data-blocklist-uid=" + uid + "]").remove();
            $("#blcount").html(Number($("#blcount").html()) - 1);
            if (Number($("#blcount").html()) == 0) {
                $("#blockListFrame_l .main").html(blockListNoOne);
            }
        }
    }, function (data) {
        $("#blockCover").remove();
        newMsgBox((unblock ? "取消" : "") + "屏蔽失败，因为" + data['info']);
    });
}

// 黑名单
function showUserBlockListPage() {
    if (logRequire()) {
        try {
            //如果有则定位
            try {
                focusBox("pageRight", 'blockListFrame', false);
            }
            catch (error) { // 没有则创建
                new_element = document.createElement('div');
                new_element.setAttribute('id', "blockListFrame");
                new_element.setAttribute('class', 'blockListFrame box rightBox');
                new_element.setAttribute('con', 'none');
                new_element.setAttribute('totallyclose', 'true');
                new_element.setAttribute('name', "黑名单");
                new_element.setAttribute('data-url', "blocklist");
                new_element.setAttribute('noother', 'false');
                new_element.innerHTML = blockListTemplate;
                pageRight.appendChild(new_element);
                focusBox("pageRight", "blockListFrame", false);
                initPostsListMonitor($(`#blockListFrame_scrollMonitor`));
                initPostsList($(`#blockListFrame_l`), { "type": "blocklist", "noOther": false });
                focusInPostsList($(`#blockListFrame_scrollMonitor`), $(`#blockListFrame_l`));
                // loadPostsList($(`#blockListFrame_l`));
            };
        }
        catch (err) {
            console.error(err);
        }
    }
}

blockListTemplate = `
<header>
    <div class="left">
        <button class="backButton" title="返回" onclick="closeBox('pageRight','blockListFrame',false);"
            oncontextmenu="quickBack('pageRight',this)"
            ontouchstart="longPressToDo(function(){quickBack('pageRight', $('#blockListFrame .backButton')[0])})"
            ontouchend="longPressStop()"><i class="material-icons"></i></button>
        <div class="nameDiv">
            <p class="title">黑名单</p>
            <p class="little"><span id="blcount"></span>/200</p>
        </div>
    </div>
    <div class="right">
        <button onclick="openNotice('blocklisthelp')" title="黑名单帮助"><i class="material-icons">info_outline</i></button>
    </div>
</header>
<div class="cardBox postCardBox main" style="overflow: hidden;">
    <div class="equalPages floatFrame-content postsListScrollMonitor" style="height: 100%" id="blockListFrame_scrollMonitor">
        <div id="blockListFrame_lContainer" class="cardsListsContainer">
                <div id="blockListFrame_l"></div>
        </div>
    </div>
</div>`;

// 收藏
function showUserStarListPage() {
    if (logRequire()) {
        try {
            //如果有则定位
            try {
                focusBox("pageRight", 'starListFrame', false);
            }
            catch (error) { // 没有则创建
                new_element = document.createElement('div');
                new_element.setAttribute('id', "starListFrame");
                new_element.setAttribute('class', 'starListFrame box rightBox');
                new_element.setAttribute('con', 'none');
                new_element.setAttribute('totallyclose', 'true');
                new_element.setAttribute('name', "收藏");
                new_element.setAttribute('data-url', "starlist");
                new_element.setAttribute('noother', 'false');
                new_element.innerHTML = starListTemplate;
                pageRight.appendChild(new_element);
                focusBox("pageRight", "starListFrame", false);
                initPostsListMonitor($(`#starListFrame_scrollMonitor`));
                initPostsList($(`#starListFrame_l`), { "type": "post", "search": { "star": true }, "noOther": false });
                focusInPostsList($(`#starListFrame_scrollMonitor`), $(`#starListFrame_l`));
            };
        }
        catch (err) {
            console.error(err);
        }
    }
}

starListTemplate = `
<header>
    <div class="left">
        <button class="backButton" title="返回" onclick="closeBox('pageRight','starListFrame',false);"
            oncontextmenu="quickBack('pageRight',this)"
            ontouchstart="longPressToDo(function(){quickBack('pageRight', $('#starListFrame .backButton')[0])})"
            ontouchend="longPressStop()"><i class="material-icons"></i></button>
        <div class="nameDiv">
            <p class="title">收藏</p>
        </div>
    </div>
    <div class="right">
    </div>
</header>
<div class="cardBox postCardBox main" style="overflow: hidden;">
    <div class="equalPages floatFrame-content postsListScrollMonitor" style="height: 100%" id="starListFrame_scrollMonitor">
        <div id="starListFrame_lContainer"class="cardsListsContainer">
                <div id="starListFrame_l"></div>
        </div>
    </div>
</div>`;

// 收藏
function showUserRecentLikePage(uid, unick) {
    if (logRequire()) {
        try {
            //如果有则定位
            try {
                focusBox("pageRight", 'userRecentLikePage_' + uid, false);
            }
            catch (error) { // 没有则创建
                new_element = document.createElement('div');
                new_element.setAttribute('id', "userRecentLikePage_" + uid);
                new_element.setAttribute('class', 'userRecentLikePage box rightBox');
                new_element.setAttribute('con', 'none');
                new_element.setAttribute('totallyclose', 'true');
                new_element.setAttribute('name', unick + "最近点赞的帖子");
                new_element.setAttribute('data-url', "recentlike_" + uid + "_" + escape(unick));
                new_element.setAttribute('noother', 'false');
                new_element.innerHTML = userRecentLikePageTemplate.replace(/{{uid}}/g, uid).replace(/{{nick}}/g, unick).replace(/{{buttonhidden}}/g, uid != myUid ? "hidden" : "");
                pageRight.appendChild(new_element);
                focusBox("pageRight", "userRecentLikePage_" + uid, false);
                initPostsListMonitor($(`#userRecentLikePage_${uid}_scrollMonitor`));
                initPostsList($(`#userRecentLikePage_${uid}_l`), { "type": "post", "search": { "recent_like": true, "uid": uid }, "noOther": false });
                focusInPostsList($(`#userRecentLikePage_${uid}_scrollMonitor`), $(`#userRecentLikePage_${uid}_l`));
            };
        }
        catch (err) {
            console.error(err);
        }
    }
}

userRecentLikePageTemplate = `
<header>
    <div class="left">
        <button class="backButton" title="返回" onclick="closeBox('pageRight','userRecentLikePage_{{uid}}',false);"
            oncontextmenu="quickBack('pageRight',this)"
            ontouchstart="longPressToDo(function(){quickBack('pageRight', $('#userRecentLikePage_{{uid}} .backButton')[0])})"
            ontouchend="longPressStop()"><i class="material-icons"></i></button>
        <div class="nameDiv">
            <p class="title">{{nick}}最近点赞的帖子</p>
            <!-- <p class="little">最多展现 50 条他最近点赞的帖子</p> -->
        </div>
    </div>
    <div class="right">
        <button {{buttonhidden}} onclick="deleteAllRecentLikes()" title="清空最近点赞记录"><i class="material-icons">remove_circle_outline</i></button>
        <button onclick="alert('“最近点赞的帖子”将记录用户最多 50 个最近点赞的帖子。<br><br>要向其他人隐藏显示最近点赞的帖子，可以前往账号设置关闭相应权限。<br><br>可以在自己的“最近点赞的帖子”页面隐藏某一条最近点赞的帖子或所有最近点赞的帖子。','最近点赞的帖子')" title="帮助"><i class="material-icons">info_outline</i></button>
    </div>
</header>
<div class="cardBox postCardBox main" style="overflow: hidden;">
    <div class="equalPages floatFrame-content postsListScrollMonitor" style="height: 100%" id="userRecentLikePage_{{uid}}_scrollMonitor">
        <div id="userRecentLikePage_{{uid}}_lContainer"class="cardsListsContainer">
                <div id="userRecentLikePage_{{uid}}_l"></div>
        </div>
    </div>
</div>`;

// 隐藏显示点赞的帖子
function removeFromRecentLike(pid) {
    if (logRequire()) {
        newAjax("POST", backEndURL + "/post/recent_like.php", true, "pid=" + pid + "&action=del", "",
            function (d) {
                $(`#userRecentLikePage_${myUid}_l`).find("[data-type=post][data-postid=" + pid + "]").remove();
                newMsgBox("隐藏显示成功");
            }, function (d) {
                writeLog("i", "removeFromRecentLike", " post " + pid + " error");
                newMsgBox("隐藏显示失败，因为" + d['info']);
            }
        );
    }
}

function deleteAllRecentLikes() {
    if (logRequire()) {
        alert("确定要删除所有的最近点赞记录吗？", "清空最近点赞记录", "确定", "confirmDeleteAllRecentLikes()", "取消");
    }
}

function confirmDeleteAllRecentLikes() {
    newAjax("GET", backEndURL + "/post/recent_like.php", true, "action=delall", {},
        function (d) {
            $(`#userRecentLikePage_${myUid}_l`).attr("data-status", "nomore");
            $(`#userRecentLikePage_${myUid}_l`).find(".main").html("");
            newMsgBox("隐藏显示成功");
        }, function (d) {
            writeLog("i", "deleteAllRecentLikes", "error");
            newMsgBox("隐藏显示失败，因为" + d['info']);
        });
}

// 用户权限
function gRole(r) {
    try {
        return roleList.filter(function (_data) { return _data.id == myRole })[0][r] == 1 ? true : false;
    } catch (err) {
        return false;
    }
}
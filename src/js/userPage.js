// 打开新用户信息页
function newUserInfoPage(uid, uNick, noOther = false) {
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
            new_element.setAttribute('noother', noOther);
            new_element.innerHTML = uPageTemp.replace(/{{uid}}/g, uid).replace(/{{nick}}/g, uNick).replace(/{{avatar}}/g, avatarURL.replace(/{id}/g, uid));
            pageRight.appendChild(new_element);
            focusBox("pageRight", "userInfoFrame_" + uid, noOther);
            refreshUserInfoArea(uid);
        };
    }
    catch (err) {
        console.error(err);
    }
}

function refreshUserInfoArea(uid) {
    newAjax("POST", backEndURL + "/user/getuser.php", true, "uid=" + uid, {}, function (data) {
        if (data['status'] == "successful") {
            pData = data['data'];
            $("[data-following-num-uid=" + uid + "]").html(pData['followings_num']);
            $("[data-followers-num-uid=" + uid + "]").html(pData['followers_num']);
            $("[data-gain-likes-num-uid=" + uid + "]").html(pData['receive_like']);
            $("[data-posts-num-uid=" + uid + "]").html(pData['publish_post']);
            $("[data-replies-num-uid=" + uid + "]").html(pData['publish_comment']);
            $("[data-my-following-to-uid=" + uid + "]").attr("data-follow", (pData['is_myself'] ? "edit" : (pData['i_followed'] ? (pData['followed_me'] ? "both" : "true") : (pData['followed_me'] ? "followedme" : "false"))));
        }
        else {
            newMsgBox("用户信息加载失败");
        }
    }, function () {
        newMsgBox("用户信息加载失败");
    });
}

uPageTemp = `
<header>
    <div class="left">
        <button class="backButton" title="返回" onclick="closeBox('pageRight','userInfoFrame_{{uid}}')" oncontextmenu="quickBack('pageRight',this)" ontouchstart="longPressToDo(function(){quickBack('pageRight')})" ontouchend="longPressStop()"><i class="material-icons"></i></button>
        <div class="nameDiv">
            <p class="title">{{nick}}</p>
            <p class="little"></p>
        </div>
    </div>
    <div class="right">
        <button onclick="showUserPageContextMenu({{uid}},this)" title="选项"><i class="material-icons"></i></button>
    </div>
</header>
<div class="main floatFrame">
    <div class="userHeader floatFrame-header">
        <div class="uHeaderMain floatFrame-header">
            <div class="lin"></div>
            <div class="uHeaderInfos">
                <button class="avatar" style="background-image: url('{{avatar}}');" onclick="localStorage.imgSrc='{{avatar}}'; newBrowser('imgviewer.html',false,false,false)"></button>
                <div class="name">{{nick}}</div>
                <div class="data">
                    <button>关注<span class="num" data-following-num-uid="{{uid}}"><span class="skeleton" style="padding-right: 2em"></span></span></button>
                    <button>粉丝<span class="num" data-followers-num-uid="{{uid}}"><span class="skeleton" style="padding-right: 2em"></span></span></button>
                    <button>获赞<span class="num" data-gain-likes-num-uid="{{uid}}"><span class="skeleton" style="padding-right: 2em"></span></span></button>
                </div>
                <div class="interaction" data-my-following-to-uid="{{uid}}" data-follow="loading">
                <button class="followButton nega" onclick="followUser('{{uid}}',false, $(this));" data-stat="false" title="关注"><i class="material-icons">add</i><span>关注</span></button>
                <button class="followButton posi" onclick="followUser('{{uid}}',true, $(this));" data-stat="true" title="取消关注"><i class="material-icons">check</i><span>已关注</span></button>
                <button class="followButton nega" onclick="followUser('{{uid}}',false, $(this));" data-stat="followedme" title="关注"><i class="material-icons">check</i><span>关注了我</span></button>
                <button class="followButton nega" onclick="followUser('{{uid}}',true, $(this));" data-stat="both" title="取消关注"><i class="material-icons">check</i><span>互相关注</span></button>
                <button class="followButton nega" onclick="newLegacyBrowser('/settings/account.html', false, false);" data-stat="edit" title="编辑个人资料"><i class="material-icons">edit</i><span>编辑资料</span></button>
                <button class="followButton nega" data-stat="loading" title="加载中"><span>加载中</span></button>
        </div>
            </div>
        </div>
    </div>
    <div class="typeContainer" noselect>
        <div class="typeSelecter">
            <label for="uPage_{{uid}}_s_posts"><input id="uPage_{{uid}}_s_posts" type="radio" name="uPage_{{uid}}_s"><span>帖子<n data-posts-num-uid="{{uid}}"></n></span></label>
            <label for="uPage_{{uid}}_s_replies"><input id="uPage_{{uid}}_s_replies" type="radio" name="uPage_{{uid}}_s"><span>回复<n data-replies-num-uid="{{uid}}"></n></span></label>
            <label for="uPage_{{uid}}_s_posts"><input id="uPage_{{uid}}_s_posts" type="radio" name="uPage_{{uid}}_s"><span>更多</span></label>
        </div>
    </div>
    <div class="userMainCards equalPages floatFrame-content">
        <div class="placeHolder"></div>
        
        </div>
    </div>
</div>
`;

// 关注
function followUser(uid, unfollow = false, ele) {
    if (logRequire()) {
        if (!unfollow) {
            // 展示关注动画
            if (localStorage.showLikeAni == "true") {
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
        newAjax("POST", backEndURL + "/user/follow.php", true, "uid=" + uid + (unfollow ? "&unfollow" : ""), "", function () { writeLog("i", "followUser", "follow user " + uid + " success, unfollow=" + unfollow); refreshUserInfoArea(uid); }, function () { writeLog("i", "followUser", "follow user " + uid + " error, unfollow=" + unfollow); refreshUserInfoArea(uid); });
    }
}

// 菜单
function showUserPageContextMenu(uid, ele) {
    if (uid == myUid) {
        cMenuItems = [["编辑资料", "newLegacyBrowser('/settings/account.html', false, false)", "edit"]];
    }
    else {
        cMenuItems = [["屏蔽", ""], ["举报", "", "report"]];
    }
    createContextMenu(cMenuItems, undefined, undefined, ele);
}
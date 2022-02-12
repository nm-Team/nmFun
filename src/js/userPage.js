// 打开新用户信息页
function newUserInfoPage(uid, noOther = false) {
    try {
        //如果有则定位
        try {
            focusBox("pageRight", 'userInfoFrame' + uid, noOther);
        }
        catch (error) { // 没有则创建
            new_element = document.createElement('div');
            new_element.setAttribute('id', "userInfoFrame" + uid);
            new_element.setAttribute('class', 'userFrame box rightBox');
            new_element.setAttribute('con', 'none');
            new_element.setAttribute('totallyclose', 'true');
            new_element.setAttribute('uid', uid);
            new_element.setAttribute('name', '加载中');
            new_element.setAttribute('noother', noOther);
            new_element.innerHTML = uPageTemp.replace(/{{uid}}/g, uid).replace(/{{}}/g, "");
            pageRight.appendChild(new_element);
            focusBox("pageRight", "userInfoFrame" + uid, noOther);
        };
    }
    catch (err) {
        console.error(err);
    }
}

uPageTemp = `
<header>
    <div class="left">
        <button class="backButton" title="返回" onclick="closeBox('pageRight','userPage_uid')" oncontextmenu="quickBack('pageRight',this)" ontouchstart="longPressToDo(function(){quickBack('pageRight')})" ontouchend="longPressStop()"><i class="material-icons"></i></button>
        <div class="nameDiv">
            <p class="title">详情</p>
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
                <button class="avatar" style="background-color: url('');" onclick="localStorage.imgSrc='https://img.cncn3.cn/timg'; newBrowser('imgviewer.html',false,false,false)"></button>
                <div class="name">XYZ1024</div>
                <div class="data">
                    <button>关注<span class="num" data-following-num-uid="{{uid}}"><span class="skeleton" style="width: 10em"></span></span></button>
                    <button>粉丝<span class="num" data-followers-num-uid="{{uid}}"><span class="skeleton" style="width: 10em"></span></span></button>
                </div>
                <div class="interaction" data-my-following-to-uid="{{uid}}" data-follow="false true">
                    <button class="followButton nega" title="关注"><i class="material-icons">add</i><span>关注</span></button>
                    <button class="followButton posi" title="取消关注"><i class="material-icons">check</i><span>已关注</span></button>
                </div>
            </div>
        </div>
    </div>
    <div class="typeContainer" noselect>
        <div class="typeSelecter">
            <label for=""><input id="uPage_{{uid}}_s_posts" type="radio"><span>帖子</span></label>
            <label for=""><input id="uPage_{{uid}}_s_replies" type="radio"><span>回复</span></label>
            <label for=""><input id="uPage_{{uid}}_s_posts" type="radio"><span>更多</span></label>
        </div>
    </div>
    <div class="userMainCards equalPages floatFrame-content">
        <div class="placeHolder"></div>
        <div class="postBox cardBox postCardBox">
            <div class="cardBox">
                <div class="postMainSke">
                    <div class="card avatarBox">
                        <div class="header" noselect>
                            <a class="name"><i class="skeleton noscale"></i>
                                <div>
                                    <p class="unick skeleton" style="width: 4em">.</p>
                                    <p class="time skeleton" style="width: 4em">.</p>
                                </div>
                            </a>
                        </div>
                        <div class="content" noselect>
                            <p class="skeleton sentence">.</p>
                            <p class="skeleton sentence">.</p>
                            <p class="skeleton sentence">.</p>
                        </div>
                        <div class="bottom" noselect>
                            <div class="word">
                                <p class="skeleton" style="width: 6em">.</p>
                            </div>
                            <div class="buttons">
                                <button disabled="" class="skeleton" style="width: 3em">.</button><button disabled="" class="skeleton" style="width: 3em">.</button>
                            </div>
                        </div>
                    </div>
                </div>
                <post></post>
                <post></post>
                <post></post>
                <post></post>
            </div>
        </div>
    </div>
</div>
`;

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
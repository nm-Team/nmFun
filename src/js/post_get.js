// 初始化帖子列表
function initPostsList(box, attr) {
    box[0].className += " postsList cardBox postCardBox ";
    box.attr("data-config", JSON.stringify(attr));
    box.attr("data-status", "undefined");
    box.append(`<div class="main"></div><div class="mark"></div><div spe class="loading">${postSkeleton}</div><div spe class="card error">${postsErrorBoxHTML}</div><div spe class="card nomore">${postsNoMoreBoxHTML}</div>`);
    writeLog("i", "initPostsList", `box id: ${box[0].id},attr: ${JSON.stringify(attr)}`);
}

// postsList 滚动事件

$(".postsListScrollMonitor").on('scroll', function (event) {
    postsListOnScroll($(this).find("[data-focus=true]"));
})

$(".postsList").on('scroll', function () {
    postsListOnScroll($(this));
})

function postsListOnScroll(box) {
    attr = JSON.parse(box.attr("data-config"));
    // 如果more的位置在屏幕上，则要继续加载
    if (box.children(".mark")[0].getBoundingClientRect().top < window.outerWidth) {
        loadPostsList(box);
    }
}

// 通用帖子加载函数desu
function loadPostsList(box) {
    attr = JSON.parse(box.attr("data-config"));
    lastPid = box.find(".main .postMainReal:last").attr("data-postid");
    if (box.attr("data-status") != "undefined") return -1;
    writeLog("i", "loadPostsList", "start, attr " + JSON.stringify(attr) + ",detected last pid is " + lastPid + "");
    box.attr("data-status", "loading");
    $.ajax({
        type: "GET",
        url: backEndURL + "/post/getpost.php?pid=" + (lastPid ? lastPid : "") + "&",
        async: true,
        dataType: "json",
        success: function (response, status, request) {
            writeLog("i", "loadPostsList get backend response", JSON.stringify(response));
            try {
                response['data'].forEach(info => {
                    new_element = document.createElement('object');
                    new_element.innerHTML = `
<div class="postMainReal card avatarBox" data-postid="${info.pid}">
    <div class="header">
        <a class="name" tabindex="0" onclick="newUserInfoPage('uid');"
            onkeydown="divClick(this, event)"><i
                style="background-image:url('${avatarURL.replace(/{id}/g, info.uid)}"></i>
            <div>
                <p class="unick">${info.nick}<!-- <span class="usertag border"></span> --> </p>
                <p class="time" time="true" timestamp="${info.time}" timestyle="relative"
                    timesec="false" timefull="false"></p>
            </div>
        </a>
        <div class="buttons">
            <button onclick="postContextMenu('post', '${info.pid}', this);" title="选项"><i
                    class="material-icons">more_vert</i></button>
        </div>
    </div>
    <div class="content">
        <p class="status">status</p>
        <a href="" target="_blank" onclick="" class="text" title="点击来进入帖子详情"><object class="slug">
            <p class="title"><b>${info.title}</b></p>
            <p>${info.description}</p>
            </object></a>
        <div class="media">
            <ui class="medias" id="tes" type="xmediatype">medias</ui>
            specialMedias
        </div>
    </div>
    <div class="bottom">
        <div class="word">
            <p>浏览<span class="viewNum">${info.view}</span>次</p>
        </div>
        <div class="buttons">
            <button onclick="" class="likeButton" title="点赞">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
                <span class="likeNum">${info.like}</span>
            </button>
            <button onclick="" class="unlikeButton" title="不喜欢">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
            </button>
            <button onclick="newPostDetailPage(134, undefined, 'comments');" title="评论">
                <svg class="comment" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M853.333333 768c35.413333 0 64-20.650667 64-55.978667V170.581333A63.978667 63.978667 0 0 0 853.333333 106.666667H170.666667C135.253333 106.666667 106.666667 135.253333 106.666667 170.581333v541.44C106.666667 747.285333 135.338667 768 170.666667 768h201.173333l110.016 117.44a42.752 42.752 0 0 0 60.586667 0.042667L651.904 768H853.333333z m-219.029333-42.666667h-6.250667l-115.797333 129.962667c-0.106667 0.106667-116.010667-129.962667-116.010667-129.962667H170.666667c-11.776 0-21.333333-1.621333-21.333334-13.312V170.581333A21.205333 21.205333 0 0 1 170.666667 149.333333h682.666666c11.776 0 21.333333 9.536 21.333334 21.248v541.44c0 11.754667-9.472 13.312-21.333334 13.312H634.304zM341.333333 490.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z" p-id="5116"></path>
                </svg>
                <span class="commentNum">0</span>
            </button>
        </div>
    </div>
</div>`;
                    box.children(".main").append(new_element);
                    box.attr("data-status", "undefined");
                    if (response['data'] == []) box.attr("data-status", "nomore");
                });
            }
            catch (err) {
                writeLog("e", "loadPostsList", err);
                newMsgBox("抱歉，加载帖子时出现问题。<br>" + err);
                box.attr("data-status", "error");
            }
        },
        error: function () {
            writeLog("e", "loadPostsList", "ajax error");
            newMsgBox("抱歉，加载帖子时出现问题。");
            box.attr("data-status", "error");
        }
    });
}

postSkeleton = `
<div class="postMainSke">
    <div class="card avatarBox ">
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
                <button disabled class="skeleton"
                    style="width: 3em">.</button><button disabled class="skeleton"
                    style="width: 3em">.</button>
            </div>
        </div>
    </div>
</div>`;

postsNoMoreBoxHTML = `
<div class="unavaliable" noselect=""><i></i><p>没有了，怎么想都没有了吧！</p></div>`;
postsErrorBoxHTML = `
<div class="unavaliable search-not-start" noselect=""><i></i><p>坏掉了啦，载不出来了！</p></div>`;
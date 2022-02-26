// 初始化帖子列表
function initPostsList(box, attr) {
    box[0].className += " postsList cardBox postCardBox ";
    box.attr("data-config", JSON.stringify(attr));
    box.attr("data-status", "undefined");
    box.append(`<div class="main"></div><div class="mark"></div><div spe class="loading">${postSkeleton}</div><div spe class="card error">${postsErrorBoxHTML.replace(/{boxid}/g, box[0].id)}</div><div spe class="card nomore">${postsNoMoreBoxHTML}</div>`);
    writeLog("i", "initPostsList", `box id: ${box[0].id},attr: ${JSON.stringify(attr)}`);
}

// 初始化postsListMonitor
function initPostsListMonitor(box) {
    new_element = document.createElement("div");
    new_element.className = "postsListBar";
    new_element.setAttribute("noselect","");
    new_element.innerHTML = `<button class="refresh" onclick="refreshPostsList(getActivePostsList($('#${box[0].id}')))"><i class="material-icons">refresh</i></button><button class="top" onclick="($('#${box[0].id}')).animate({scrollTop: 0}, 500);" data-hidden="true"><i class="material-icons">arrow_upward</i></button>`;
    box.append(new_element);
}

function refreshPostsList(box) {
    newMsgBox("正在刷新...");
    box.find(".main").empty();
    loadPostsList(box);
}

function getActivePostsList(d) {
    return $(d).find("[data-focus=true]");
}

// postsList 滚动事件
$(".postsListScrollMonitor").on('scroll', function (event) {
    postsListOnScroll(getActivePostsList($(this)));
    if ($(this).scrollTop() < $(this).outerHeight()) $(this).find(".postsListBar .top").attr("data-hidden", "true");
    else $(this).find(".postsListBar .top").attr("data-hidden", "false");
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
        url: backEndURL + "/post/listpost.php?pid=" + (lastPid ? lastPid : "") + "&category=" + attr.search.category + "&CodySESSION=" + localStorage.sessionid + "&uid=" + myUid,
        async: true,
        dataType: "json",
        success: function (response, status, request) {
            writeLog("i", "loadPostsList get backend response", JSON.stringify(response));
            try {
                response['data'].forEach(info => {
                    medias = setMedia(info.attachment, info.pid);
                    new_element = document.createElement('object');
                    new_element.innerHTML = `
<div class="postMainReal card avatarBox" data-type="post" data-postid="${info.pid}">
    <div class="header">
        <a class="name" tabindex="0" onclick="newUserInfoPage('${info.uid}', '${info.nick}');"
            onkeydown="divClick(this, event)"><i
                style="background-image:url('${avatarURL.replace(/{id}/g, info.uid)}"></i>
            <div>
                <p class="unick">${info.nick}<!-- <span class="usertag border"></span> --> </p>
                <p class="time" time="true" timestamp="${info.time}" timestyle="relative"
                    timesec="false" timefull="false"></p>
            </div>
        </a>
        <div class="buttons">
            <button onclick="postContextMenu('post', '${info.pid}', '${info.title}', ${info.uid}, this);" title="选项"><i
                    class="material-icons">more_vert</i></button>
        </div>
    </div>
    <div class="content">
        <p class="status"></p>
        <a href="${siteURL + "/post/" + info.pid}" target="_blank" onclick="newPostDetailPage('${info.pid}',${attr.noOther}); return false;" class="text" title="点击来进入帖子详情"><object class="slug">
            <p class="title"><b>${cleanHTMLTag(info.title)}</b></p>
            <p>${contentFormat(info.content)}</p>
            </object></a>
        <div class="media">
        <ui class="medias" id="tes" type="x${medias.mNum}">${medias.mediasHTML}</ui>
        ${medias.specialMediasHTML}
        </div>
    </div>
    <div class="bottom">
        <div class="word">
            <p>浏览<span class="viewNum" data-view-num-post-id="${info.pid}">${info.view}</span>次</p>
        </div>
        <div class="buttons">
            <button onclick="likePost($(this),'${info.pid}')" class="likeButton" data-like-post-id="${info.pid}" data-status="${(info.i ? "yes" : "no")}" title="点赞">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
                <span class="likeNum" data-like-num-post-id="${info.pid}">${info.like}</span>
            </button>
            <button onclick="dislikePost('${info.pid}')" class="unlikeButton" title="不喜欢">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
            </button>
            <button onclick="newPostDetailPage('${info.pid}', undefined, 'comments');" title="评论">
                <svg class="comment" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M853.333333 768c35.413333 0 64-20.650667 64-55.978667V170.581333A63.978667 63.978667 0 0 0 853.333333 106.666667H170.666667C135.253333 106.666667 106.666667 135.253333 106.666667 170.581333v541.44C106.666667 747.285333 135.338667 768 170.666667 768h201.173333l110.016 117.44a42.752 42.752 0 0 0 60.586667 0.042667L651.904 768H853.333333z m-219.029333-42.666667h-6.250667l-115.797333 129.962667c-0.106667 0.106667-116.010667-129.962667-116.010667-129.962667H170.666667c-11.776 0-21.333333-1.621333-21.333334-13.312V170.581333A21.205333 21.205333 0 0 1 170.666667 149.333333h682.666666c11.776 0 21.333333 9.536 21.333334 21.248v541.44c0 11.754667-9.472 13.312-21.333334 13.312H634.304zM341.333333 490.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z" p-id="5116"></path>
                </svg>
                <span class="commentNum" data-comment-num-post-id="${info.pid}">${info.comment}</span>
            </button>
        </div>
    </div>
</div>`;
                    box.children(".main").append(new_element);
                    $("[data-view-num-post-id=" + info.pid + "]").html(info['view']);
                    $(":not([data-ignore=true]) [data-like-num-post-id=" + info.pid + "]").html(info['like']);
                    $("[data-like-post-id=" + info.pid + "]:not([data-ignore=true])").attr("data-status", (info['liked'] ? "yes" : "no"));
                    $("[data-comment-num-post-id=" + info.pid + "]").html(info['comment']);
                });
                if (response['data'].length == 0) box.attr("data-status", "nomore");
                else box.attr("data-status", "undefined");
            }
            catch (err) {
                writeLog("e", "loadPostsList", err);
                newMsgBox("抱歉，加载帖子时出现问题。<br />" + err);
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

function newPostDetailPage(pid, noOther = false, aheadTo = "") {
    try {
        //如果有则定位
        try {
            focusBox("pageRight", 'postFrame' + pid, noOther);
        }
        catch (error) { // 没有则创建
            new_element = document.createElement('div');
            new_element.setAttribute('id', "postFrame" + pid);
            new_element.setAttribute('class', 'postFrame box rightBox');
            new_element.setAttribute('con', 'none');
            new_element.setAttribute('totallyclose', 'true');
            new_element.setAttribute('pid', pid);
            new_element.setAttribute('name', '详情');
            new_element.setAttribute('noother', noOther);
            new_element.innerHTML = postTemplate.replace(/{{pid}}/g, pid).replace(/{{postSke}}/g, postSkeleton);
            pageRight.appendChild(new_element);
            focusBox("pageRight", "postFrame" + pid, noOther);
        }
        // 定位到某个位置
        if (aheadTo) { }
        refreshPostArea(pid);
    }
    catch (err) {
        console.error(err);
    }
}

function refreshPostArea(pid) {
    newAjax("POST", backEndURL + "/post/getpost.php", true, "pid=" + pid, {}, function (data) {
        document.getElementById('postFrame' + pid).getElementsByClassName("postMainSke")[0].style.display = "none";
        if (data['status'] == "successful") {
            pData = data['data'];
            $("#postFrameMenuButton" + pid).attr("onclick", `postContextMenu('post', '${pid}', '${pData['title']}', ${(pData['uid'])}, this)`);
            // 处理内容中的特殊项
            contentHandled = contentFormat(pData['content']).replace(/((((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?)/g, `<a class="linkInPost" href="` + siteURL + `/jumpurl.php?$1" target="_blank" onclick="newBrowser('$1', 'postOutBrowser', true, true); return false;"><svg class="icon link" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M618.24 439.381333a152.746667 152.746667 0 0 1 0 216l-135.893333 135.893334a163.370667 163.370667 0 1 1-231.04-231.04l66.922666-66.944 45.269334 45.269333-66.944 66.944a99.370667 99.370667 0 1 0 140.522666 140.522667l135.893334-135.893334a88.746667 88.746667 0 0 0 0-125.482666z m182.528-197.589333a163.370667 163.370667 0 0 1 0 231.04L733.866667 539.776l-45.269334-45.248 66.944-66.944a99.370667 99.370667 0 1 0-140.522666-140.522667l-135.893334 135.893334a88.746667 88.746667 0 0 0 0 125.482666l-45.269333 45.269334a152.746667 152.746667 0 0 1 0-216l135.893333-135.893334a163.370667 163.370667 0 0 1 231.04 0z"</path></svg>$1</a>`);
            // 识别话题
            tagsIn = [];
            // 抓取每个#至空格和#至换行，并视作话题
            numbersignCaught = contentHandled.split("#");
            for (p = 0; p < numbersignCaught.length; p++) {
                tagCaught = numbersignCaught[p].split("<br />")[0].split(" ")[0];
                if (!tagCaught || (p == 0 && contentHandled.indexOf("#") != 0)
                    || (numbersignCaught[p - 1].split("<br />")[numbersignCaught[p - 1].split("<br />").length - 1].split(" ")[numbersignCaught[p - 1].split("<br />")[numbersignCaught[p - 1].split("<br />").length - 1].split(" ").length - 1])
                    )
                    continue;
                contentHandled = contentHandled.replace("#" + tagCaught, '<a class="linkInPost" href="" target="_blank" onclick="return false;" title="查看话题 #' + tagCaught + '">#' + tagCaught + '</a>');
                tagsIn.push(tagCaught);
            };
            medias = setMedia(pData['attachment'], pid);
            // 基本
            $("#postFrame" + pid + " .postMainReal").html(`
            <div class="header">
                <a class="name" tabindex="0" onclick="newUserInfoPage('${pData['uid']}','${pData['nick']}');" onkeydown="divClick(this, event)"><i style="background-image:url('${avatarURL.replace(/{id}/g, pData['uid'])}"></i>
                    <div>
                        <p class="unick">${pData['nick']}<!-- <span class="usertag border"></span> --> </p>
                        <p class="time" time="true" timestamp="${pData['time']}" timestyle="relative" timesec="false" timefull="false"></p>
                    </div>
                </a>
                <div class="buttons"><button hidden onclick="postContextMenu('post', '${pid}', '', false, this);" title="选项"><i class="material-icons">more_vert</i></button></div>
            </div>
            <div class="content">
                <p class="status"></p>
                <object class="">
                    <p class="title">${cleanHTMLTag(pData['title'])}</p>
                    <p>${contentHandled}</p>
                </object>
                <div class="media">
                    <ui class="medias" id="tes" type="x${medias.mNum}">${medias.mediasHTML}</ui>
                    ${medias.specialMediasHTML}
                </div>
            </div>
            <div class="bottom">
                <div class="word">
                    <p>浏览<span class="viewNum" data-view-num-post-id="${pid}"></span>次</p>
                </div>
                <div class="buttons">
                    <button onclick="likePost($(this),'${pid}')" data-like-post-id="${pid}" class="likeButton" title="点赞">
                        <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                        </svg>
                        <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                        </svg>
                    </button>
                    <button onclick="dislikePost('${pid}')" class="unlikeButton" title="不喜欢">
                        <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                        </svg>
                        <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                        </svg>
                    </button>
                    <button hidden style="display: none;" onclick="newPostDetailPage('${pid}', undefined, 'comments');" title="评论">
                        <svg class="comment" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M853.333333 768c35.413333 0 64-20.650667 64-55.978667V170.581333A63.978667 63.978667 0 0 0 853.333333 106.666667H170.666667C135.253333 106.666667 106.666667 135.253333 106.666667 170.581333v541.44C106.666667 747.285333 135.338667 768 170.666667 768h201.173333l110.016 117.44a42.752 42.752 0 0 0 60.586667 0.042667L651.904 768H853.333333z m-219.029333-42.666667h-6.250667l-115.797333 129.962667c-0.106667 0.106667-116.010667-129.962667-116.010667-129.962667H170.666667c-11.776 0-21.333333-1.621333-21.333334-13.312V170.581333A21.205333 21.205333 0 0 1 170.666667 149.333333h682.666666c11.776 0 21.333333 9.536 21.333334 21.248v541.44c0 11.754667-9.472 13.312-21.333334 13.312H634.304zM341.333333 490.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z" p-id="5116"></path>
                        </svg>
                        <span class="commentNum">${pData['comment']}</span>
                    </button>
                </div>
            </div>
            `);
            // 计算tag
            tagsHTML = ``;
            tagsIn.forEach(function (currentValue, index, arr) {
                tagsHTML += `<a href="javascript:" onclick="newMsgBox('开发中')">` + currentValue + `</a>`;
            });
            document.getElementById('postFrame' + pid).getElementsByClassName("postRelated")[0].innerHTML = `
            <div class="card tagCard"><div class="content"><a class="ca" href="javascript:" onclick="newMsgBox('开发中')" >`+ pData['category'] + `</a>
            <div class="tags">`+ tagsHTML + `</div> </div>
            </div><div class="card interactionBar"><button onclick="newMsgBox('开发中')">评论 <span class="commentNum" data-comment-num-post-id="${pid}">` + pData['comment'] + `</span></button><button onclick="newMsgBox('开发中')">赞 <span class="likeNum" data-like-num-post-id="${pid}">` + pData['like'] + `</span></button> </div>
            `;
            $("[data-view-num-post-id=" + pid + "]").html(pData['view']);
            $(":not([data-ignore=true]) [data-like-num-post-id=" + pid + "]").html(pData['like']);
            $("[data-like-post-id=" + pid + "]:not([data-ignore=true])").attr("data-status", (pData['liked'] ? "yes" : "no"));
            $("[data-comment-num-post-id=" + pid + "]").html(pData['comment']);
            document.getElementById('postFrame' + pid).getElementsByClassName("bottomBox")[0].style.display = "block";

        }
        else {
            document.getElementById('postFrame' + pid).getElementsByClassName("bottomBox")[0].style.display = "none";
        }
    }, function () {
        newMsgBox("帖子加载失败");
        document.getElementById('postFrame' + pid).getElementsByClassName("inputBox")[0].style.display = "none";
        document.getElementById('postFrame' + pid).getElementsByClassName("postMainSke")[0].style.display = "none";
        setPostArea(document.getElementById('postFrame' + pid).getElementsByClassName("postMainReal")[0], { "code": "NETWORK_ERROR" }, { slug: false, click: false, fullmedia: false });
    });
}


postTemplate = `
<header>
<div class="left">
    <button class="backButton" onclick="closeBox('pageRight','postFrame{{pid}}')" oncontextmenu="quickBack('pageRight',this)" ontouchstart="longPressToDo(function(){quickBack('pageRight',this)})" ontouchend="longPressStop()"><i class="material-icons">&#xe5c4;</i></button>
    <div class="nameDiv">
        <p class="title">详情</p>
        <p class="little"></p>
    </div>
</div>
<div class="right">
    <button id="postFrameMenuButton{{pid}}" onclick="postContextMenu('post', '{{pid}}', '', false, this);"><i class="material-icons">&#xe5d3;</i></button>
</div>
</header>
<div class="postBox cardBox postCardBox main">
    <div class="postMainSke">
        {{postSke}}
        <div class="card tagCard">
            <div class="content"><a class="ca skeleton" style="width: 3em;margin-right: 5px">.</a> <a class="ca skeleton" style="width: 3em;margin-right: 5px">.</a> <a class="ca skeleton" style="width: 3em;margin-right: 5px">.</a></div>
        </div>
        <div class="card interactionBar">
            <button disabled class="skeleton" style="margin: -5px 0px;width: 3em">.</button> <button disabled class="skeleton" style="margin: -5px 0px;width: 3em">.</button>
        </div>
    </div>
    <div class="postMainReal card avatarBox"></div>
    <div class="postRelated" noselect></div>
    <div class="card comments avatarBox" style="display:none">
        <div class="header">
            <h2 noselect>评论</h2>
            <div class="buttons"><button onclick="showCommentTypeSwitch({{pid}})"><i class="material-icons">swap_horiz</i></button></div>
        </div>
        <div class="commentsReal"></div>
        <div class="comment skeBox">
        {{postSke}}
        </div>
    </div>
</div>
<div class="bottomBox">
    <div class="bottomSurface"><div onclick="newMsgBox('开发中')" class="fakeInput" tabindex="0" onkeydown="divClick(this, event)" title="点击来发表评论">精彩的评论也是乐子的一部分</div>  
    <button onclick="newMsgBox('开发中')" class="starButton"><i class="material-icons star">star_border</i><i class="material-icons starred">star</i></button>
    <button onclick="newMsgBox('开发中')" class="share"><i class="material-icons">share</i></button>
    </div>
</div>
</div>
`;

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
<div class="unavaliable small" noselect=""><i></i><p>没有了，怎么想都没有了吧！</p></div>`;
postsErrorBoxHTML = `
<div class="unavaliable small search-not-start" noselect=""><i></i><p>坏掉了啦，载不出来了！<br /><button onclick="$('#{boxid}').attr('data-status','undefined');loadPostsList($('#{boxid}'));">重试</button></p></div>`;

function setMedia(mediaJson, pid = 0) {
    try {
        // 设置media
        mediasO = mediaJson;
        mediasHTML = "";
        specialMediasHTML = "";
        mNum = 0;
        mediasO.forEach(function (currentValue, index, arr) {
            mType = currentValue['type'];
            if (mType == "image") {
                mContent = attachURL + currentValue['src'];
                mediasHTML += `<li style="background-image:url('` + mContent + `')"><img src="` + mContent + `" tabindex="0" onkeydown="divClick(this, event)"><outline></outline></li>`;
                ++mNum;
            } else if (mType == "video") {
                mediasHTML += `<li style="background-image:url('')"><video src="` + mContent + `" tabindex="0" controls="controls" onkeydown="divClick(this, event)">请更新你的浏览器，这样才可以查看视频。</video><outline></outline></li>`;
                ++mNum;
            } else if (mType == "bili") {
                mContent = currentValue['src'];
                specialMediasHTML += biliVideoTemplate.replace(/{{bvid}}/g, mContent.bvid).replace(/{{page}}/g, mContent.p);
            }
        });
        if (mNum == 0) mediaType = 0;
        else if (mNum == 1) mediaType = 1;
        else if (mNum == 2 || mNum == 4) mediaType = 2;
        else mediaType = 3;
    }
    catch (err) {
        newMsgBox("媒体加载出错");
        writeLog("e", "load post media in " + pid + "error", err);
        mediasHTML = specialMediasHTML = mNum = "";
    };
    return { "mediasHTML": mediasHTML, "specialMediasHTML": specialMediasHTML, "mNum": mediaType, };
}

// 消息格式处理
function contentFormat(msg) {
    msg = cleanHTMLTag(msg);
    msg = msg.replace(/\\/g, "");
    msg = msg.replace(/\n/g, "<br />");
    msg = msg.replace(/\[b\](.*)\[\/b\]/g, "<b>$1</b>").replace(/\[i\](.*)\[\/i\]/g, "<i>$1</i>").replace(/\[u\](.*)\[\/u\]/g, "<u>$1</u>").replace(/\[br\]/g, "<br />");
    return msg;
}

biliVideoTemplate = `<div class="biliVideoCon" noselect><iframe class="biliVideo" frameborder="no" scrolling="no" src="https://player.bilibili.com/player.html?bvid={{bvid}}&page={{page}}&as_wide=1&high_quality=1" allowfullscreen=""></iframe><div class="biliVideoNote"><span>视频来自 Bilibili</span><button onclick="window.open('https://www.bilibili.com/video/{{bvid}}?p={{page}}&ref=nmfun')" title="在 bilibili.com 查看视频">转到</button></div></div>`;

function postContextMenu(type, id, poName, uid, ele) {
    if (isNaN(myUid)) {
        createContextMenu([["登录后执行更多操作", "showLogFrame()", ""]], true, undefined, ele);
    }
    else if (uid == myUid) {
        createContextMenu([["编辑", "editMyPost(`" + id + "`)", "edit"], ["删除", "deleteMyPostAlert(`" + id + "`, `" + poName + "`)", "delete"],], true, undefined, ele);
    }
    else {
        createContextMenu([["举报", "alert(`开发中`)", "warning"], ["屏蔽", "alert(`开发中`)", "block"]], true, undefined, ele);
    }
}

function editMyPost(pid) {
    if (logRequire()) {
        alert("nm，编辑功能写起来好麻烦，请您删除后重新发布，谢谢", "", "好", "", "nm", "");
    }
}

function deleteMyPostAlert(pid, poName) {
    if (logRequire()) {
        alert("确定要删除帖子<b>" + (poName ? "《" + poName + "》" : "") + "</b>吗？<br /><b style='color:var(--red)'>警告：此操作无法撤销。</b>", "删除帖子", "删除", "deleteMyPost('" + pid + "','" + poName + "')", "取消", "");
    }
}

function deleteMyPost(pid, poName, withMsg = true) {
    if (logRequire()) {
        $("body").append(`
        <div id="delCoverForPost${pid}" class="sendCover unscaleArea" noselect open="true">
            <div class="content">
                <i></i>
                <p>正在删除</p>
            </div>
        </div>`);
        newAjax("POST", backEndURL + "/post/delpost.php", true, "pid=" + pid, "", function () {
            if (withMsg) newMsgBox("删除帖子" + (poName ? " <b>《" + poName + "》</b> " : "") + "成功！");
            document.getElementById(`delCoverForPost${pid}`).outerHTML = "";
            writeLog("i", "deleteMyPost(" + pid + ")", "success");
            $("[data-postid=" + pid + "]").remove();
            closeBox('pageRight', 'postFrame' + pid);
        },
            function () {
                newMsgBox("删除帖子失败");
                document.getElementById(`delCoverForPost${pid}`).outerHTML = "";
                writeLog("i", "deleteMyPost(" + pid + ")", "error");
            });
    }
}

// 点赞
function likePost(ele, pid) {
    if (logRequire()) {
        if (ele.attr("data-ignore") == "true") {
            newMsgBox("点赞冷却中，请稍后再试");
            return;
        }
        if (ele.attr("data-status") == "yes") {
            likeOpe = "unlike";
        }
        else {
            likeOpe = "like";
            // 展示点赞动画
            if (localStorage.showbuttonAni == "true") {
                $("body .scaleArea").append(`<div class="likeAni buttonAni" data-like-ani-pid-${pid}>
                <div class="f"></div>
                <div class="b"></div>
            </div>
            <style>
            .likeAni[data-like-ani-pid-${pid}]{
                animation: data-like-ani-${pid} 2s;
            }
            @keyframes data-like-ani-${pid}{
                0%{
                    top: ${ele.find("svg")[0].getBoundingClientRect().top}px;
                    left: ${ele.find("svg")[0].getBoundingClientRect().left}px;
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
        $("[data-like-post-id=" + pid + "]").attr("data-ignore", "true");
        $("[data-like-post-id=" + pid + "]").attr("data-status", (likeOpe == "like" ? "yes" : "no"));
        newLikeNum = (Number($(":not([data-ignore=true]) [data-like-num-post-id=" + pid + "]")[0].innerHTML) + (likeOpe == "like" ? 1 : -1));
        $(":not([data-ignore=true]) [data-like-num-post-id=" + pid + "]").html(newLikeNum);
        newAjax("POST", backEndURL + "/post/like.php", true, "pid=" + pid + (likeOpe == "unlike" ? "&unlike=unlike" : ""), "", function () { writeLog("i", "likePost", "like post " + pid + " success"); $("[data-like-num-post-id=" + pid + "]").html(newLikeNum); $("[data-like-post-id=" + pid + "]").attr("data-status", (likeOpe == "like" ? "yes" : "no")); $("[data-like-post-id=" + pid + "]").attr("data-ignore", "false"); }, function () { $("[data-like-post-id=" + pid + "]").attr("data-status", (likeOpe != "like" ? "yes" : "no")); writeLog("i", "likePost", "like post " + pid + " error"); $("[data-like-post-id=" + pid + "]").attr("data-ignore", "false"); $(":not([data-ignore=true]) [data-like-num-post-id=" + pid + "]").html((Number($(":not([data-ignore=true]) [data-like-num-post-id=" + pid + "]")[0].innerHTML) + (likeOpe != "like" ? 1 : -1))); });
    }
}

// 点踩
function dislikePost(pid) {
    newMsgBox("收到反馈");
}
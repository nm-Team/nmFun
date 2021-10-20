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
            new_element.innerHTML = postTemplate.replace(/{{pid}}/g, pid).replace(/{{postSke}}/g, postSke);
            pageRight.appendChild(new_element);
            focusBox("pageRight", "postFrame" + pid, noOther);
            newAjax("POST", "post_get.php", true, "", { type: "post", id: pid }, function (data) {
                document.getElementById('postFrame' + pid).getElementsByClassName("postMainSke")[0].style.display = "none";
                setPostArea(document.getElementById('postFrame' + pid).getElementsByClassName("postMainReal")[0], data['info'], { slug: false, click: false, fullmedia: false });
                // 计算tag
                if (data['code'] = 200) {
                    tags = data['info']['tags'].split(";");
                    tagsHTML = ``;
                    tags.forEach(function (currentValue, index, arr) {
                        tagsHTML += `<a href="javascript:" onclick="newMsgBox('开发中')">` + currentValue + `</a>`;
                    });
                    document.getElementById('postFrame' + pid).getElementsByClassName("postRelated")[0].innerHTML = `
                <div class="card tagCard"><div class="content"><a class="ca" href="javascript:" onclick="newMsgBox('开发中')" >`+ data['info']['categoryName'] + `</a>
                <div class="tags">`+ tagsHTML + `</div> </div>
                </div><div class="card interactionBar"><button onclick="newMsgBox('开发中')">评论 <span class="commentNum">`+ data['info']['commentsNum'] + `</span></button><button onclick="newMsgBox('开发中')">赞 <span class="likeNum">` + data['info']['likeNum'] + `</span></button> </div>
                `;
                }
            }, function () { newMsgBox("帖子加载失败") });
        }
        // 定位到某个位置
        if (aheadTo) {

        }
    }
    catch (err) {
        console.error(err);
        newErrorBox("newChatBox", err);
    }
}

// 设置新帖子区域
function setPostArea(div, data, config = { "slug": false, "click": false, "fullmedia": false }) {
    div.setAttribute("pid", data['id']);
    console.log(data);
    if (data['code'] == "200") {
        div.setAttribute("type", data['type']);
        if (data['type'] == "post") {
            buttonsGiven = `<div class="buttons">
            <button class="likeButton">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
                <span class="likeNum">`+ data['likeNum'] + `</span>
            </button>
            <button class="unlikeButton">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
            </button>
            <button onclick="newPostDetailPage(`+ data['id'] + `,undefined,"comments");">
                <svg class="comment" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M853.333333 768c35.413333 0 64-20.650667 64-55.978667V170.581333A63.978667 63.978667 0 0 0 853.333333 106.666667H170.666667C135.253333 106.666667 106.666667 135.253333 106.666667 170.581333v541.44C106.666667 747.285333 135.338667 768 170.666667 768h201.173333l110.016 117.44a42.752 42.752 0 0 0 60.586667 0.042667L651.904 768H853.333333z m-219.029333-42.666667h-6.250667l-115.797333 129.962667c-0.106667 0.106667-116.010667-129.962667-116.010667-129.962667H170.666667c-11.776 0-21.333333-1.621333-21.333334-13.312V170.581333A21.205333 21.205333 0 0 1 170.666667 149.333333h682.666666c11.776 0 21.333333 9.536 21.333334 21.248v541.44c0 11.754667-9.472 13.312-21.333334 13.312H634.304zM341.333333 490.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z" p-id="5116"></path>
                </svg>
                <span class="commentNum">`+ data['commentsNum'] + `</span>
            </button>
        </div>`;
        }
        else if (data['type'] == "comment") {
            buttonsGiven = `<div class="buttons">
            <button class="likeButton">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
                <span class="likeNum">`+ data['likeNum'] + `</span>
            </button>
            <button class="unlikeButton">
                <svg class="no" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M757.76 852.906667c36.906667-0.021333 72.832-30.208 79.296-66.56l51.093333-287.04c10.069333-56.469333-27.093333-100.522667-84.373333-100.096l-10.261333 0.085333a19972.266667 19972.266667 0 0 1-52.842667 0.362667 3552.853333 3552.853333 0 0 1-56.746667 0l-30.997333-0.426667 11.498667-28.8c10.24-25.642667 21.76-95.744 21.504-128.021333-0.618667-73.045333-31.36-114.858667-69.290667-114.410667-46.613333 0.554667-69.461333 23.466667-69.333333 91.136 0.213333 112.661333-102.144 226.112-225.130667 225.109333a1214.08 1214.08 0 0 0-20.629333 0l-3.52 0.042667c-0.192 0 0.64 409.109333 0.64 409.109333 0-0.085333 459.093333-0.490667 459.093333-0.490666z m-17.301333-495.914667a15332.288 15332.288 0 0 0 52.693333-0.362667l10.282667-0.085333c84.010667-0.618667 141.44 67.52 126.72 150.250667L879.061333 793.813333c-10.090667 56.661333-63.68 101.696-121.258666 101.76l-458.922667 0.384A42.666667 42.666667 0 0 1 256 853.546667l-0.853333-409.173334a42.624 42.624 0 0 1 42.346666-42.730666l3.669334-0.042667c5.909333-0.064 13.12-0.064 21.333333 0 98.176 0.789333 182.293333-92.437333 182.144-182.378667C504.469333 128.021333 546.24 86.186667 616.106667 85.333333c65.173333-0.768 111.68 62.506667 112.448 156.714667 0.256 28.48-6.848 78.826667-15.701334 115.050667 8.021333 0 17.28-0.042667 27.584-0.106667zM170.666667 448v405.333333h23.466666a21.333333 21.333333 0 0 1 0 42.666667H154.837333A26.709333 26.709333 0 0 1 128 869.333333v-437.333333c0-14.784 12.074667-26.666667 26.773333-26.666667h38.912a21.333333 21.333333 0 0 1 0 42.666667H170.666667z"></path>
                </svg>
                <svg class="yes" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z" p-id="4969"></path>
                </svg>
            </button>
        </div>`;
        }
        if (data['status'] == "1") {
            statusW = (data['type'] == "post" ? "帖子" : "评论") + "正在审核中，仅自己可见";
        }
        else if (data['status'] == "-1") {
            statusW = (data['type'] == "post" ? "帖子" : "评论") + "被管理员删除";
        }
        else statusW = "";
        try {
            // 设置media
            medias = JSON.parse(data['media'].replace(/\\/g, "")).medias;
            mediasHTML = "";
            specialMediasHTML = "";
            mNum = 0;
            medias.forEach(function (currentValue, index, arr) {
                if (currentValue[0] == "img") {
                    mediasHTML += `<li style="background-image:url('` + currentValue[1] + `')"><img src="` + currentValue[1] + `" tabindex="0" onkeydown="divClick(this, event)"><outline></outline></li>`;
                    ++mNum;
                } else if (currentValue[0] == "video") {
                    mediasHTML += `<li style="background-image:url('')"><video src="` + currentValue[1] + `" tabindex="0" controls="controls" onkeydown="divClick(this, event)">请更新你的浏览器，这样才可以查看视频。</video><outline></outline></li>`;
                    ++mNum;
                } else if (currentValue[0] == "biliVideo")
                    specialMediasHTML += biliVideoTemplate.replace(/{{bvid}}/g, currentValue[2]).replace(/{{page}}/g, currentValue[3]);
            });
        } catch (err) { newMsgBox("媒体加载出错"); console.error(err) };
        if (config.fullmedia) mediaType = 1;
        else {
            if (mNum == 0) mediaType = 0;
            else if (mNum == 1) mediaType = 1;
            else if (mNum == 2 || mNum == 4) mediaType = 2;
            else mediaType = 3;
        }
        div.innerHTML = postAreaTemplate.replace(/{{type}}/g, data['type']).replace(/{{id}}/g, data['id']).replace(/{{slug}}/g, (config.slug ? "slug" : "")).replace(/{{time}}/g, data['time']).replace(/{{status}}/g, statusW).replace(/{{view}}/g, data['view']).replace(/{{href}}/g, (config.click ? `href="/post/` + data['id'] + `"onclick="{event.preventDefault(); newPostDetailPage('` + data['id'] + `',true);return false;}"` : '')).replace(/{{content}}/g, data['text']).replace(/{{nick}}/g, data['author']['nick']).replace(/{{avatar}}/g, data['author']['avatar']).replace(/{{uid}}/g, data['author']['uid']).replace(/{{buttons}}/g, buttonsGiven).replace(/{{medias}}/g, mediasHTML).replace(/{{specialMedias}}/g, specialMediasHTML).replace(/{{mediatype}}/g, mediaType);
    }
    else {
        div.innerHTML = postAreaUnavaliableTemplate.replace(/{{w}}/g, errorCode[data['code']]);
    }
}

// 缩放底栏更多
function changeInputBoxMoreStatus(id, className, toFalse = false) {
    inputDiv = document.getElementById('postFrame' + id).getElementsByClassName("inputBox")[0];
    opeDiv = inputDiv.getElementsByClassName(className)[0];
    for (cIBM = 0; cIBM < inputDiv.getElementsByClassName("more").length; cIBM++) {
        if (inputDiv.getElementsByClassName("more")[cIBM] === opeDiv) {
            if (opeDiv.getAttribute("open") || toFalse) {
                opeDiv.removeAttribute("open");
            }
            else {
                opeDiv.setAttribute("open", "true");
            }
        }
        else {
            inputDiv.getElementsByClassName("more")[cIBM].removeAttribute("open");
        }
    }
    if (inputDiv.getElementsByClassName("inputDrawer")[0].getAttribute("open") != "true") inputDiv.getElementsByClassName("more")[0].removeAttribute("open");
    else inputDiv.getElementsByClassName("more")[0].setAttribute("open", "true");
}

// post 卡片菜单
function postContextMenu(pid) {
    createContextMenu([["开发中"]]);
}

// 设置发帖回帖区域
function setPostInputArea(ele, type) {
    cgOptions = '';
    for (i = 0; i < categoryList.length; i++) {
        cgOptions += `<option cgid="` + categoryList[i][0] + `">` + categoryList[i][1] + `</option>`;
    }
    ele.innerHTML = sendBoxTemplate.replace(/{{cg}}/g, cgOptions).replace(/{{id}}/g, ele.id);
    ele.className += " inputArea " + type;
}

// 展示/关闭发帖
function showPostInput(which, toS) {
    document.getElementById("" + which + "Edit").setAttribute("open", toS);
    if (toS) {
        document.getElementById("" + which + "EditBoxCover").setAttribute("open", "true");
    }
    else document.getElementById("" + which + "EditBoxCover").removeAttribute("open");
}

// 发帖
function sendPost(div, postType, onSuccess) {
    if (logRequire()) {
        // 通用：是否填写内容
        if (div.getElementsByClassName("sendBoxInput")[0].value.replace(/ /g, "").replace(/\\n/g, "") == "") {
            return newMsgBox("你总得写点什么再发表吧……");
        }
        // 通用：设置参数
        textToSend = cleanHTMLTag(div.getElementsByClassName("sendBoxInput")[0].value);
        mediaToSend = '{"medias": [';
        for (i = 0; i < div.getElementsByClassName("mediasBox")[0].getElementsByClassName("m").length; i++) {
            try {
                mediaInfo = cleanHTMLTag(div.getElementsByClassName("mediasBox")[0].getElementsByClassName("m")[i].getAttribute("m")).replace(/\'/g, '"');
                // 转换解析mediaInfo
                // mInfoParsed = JSON.parse(switchMarks(mediaInfo));
                // // 对部分类型进行操作
                // if (mInfoParsed[0] == "img" || mInfoParsed[0] == "video") {
                //     // 以后可能会在这里做一些事情
                // }
                mediaToSend += mediaInfo;
                if (i < div.getElementsByClassName("mediasBox")[0].getElementsByClassName("m").length -1 ) {
                    mediaToSend += ",";
                }
            }
            catch (err) { }
        }
        mediaToSend += "]}";
        // mediaToSend = JSON.stringify(mediaToSend);
        tagsToSend = ""; // 开发中
        // 发送参数：帖子
        if (postType == "post") {
            categoryToSend = div.getElementsByClassName("categoryS")[0].selectedIndex;
            sendData = { type: "post", text: textToSend, media: mediaToSend, category: categoryToSend, tags: tagsToSend };
        }
        if (postType == "comment") {
            // 发送参数：评论
            if (!div.getAttribute("inpost")) return newMsgBox("啊哦，nmFun 内部出现错误");
            inpost = div.getAttribute("inpost");
            tocomment = div.getAttribute("tocomment");
            sendData = { type: "comment", inpost: inpost, tocomment: tocomment, text: textToSend, media: mediaToSend, category: categoryToSend, tags: tagsToSend };
        }
        newAjax("POST", "/post_send.php", true, "", sendData, onSuccess, function (err) { newMsgBox("出现错误，发送失败。<br>服务器返回错误 " + err['info']) });
    }
}

postTemplate = `
<header>
<div class="left">
    <button class="backButton" onclick="closeBox('pageRight','postFrame{{pid}}')" oncontextmenu="quickBack('pageRight')" ontouchstart="longPressToDo(function(){quickBack('pageRight')})" ontouchend="longPressStop()"><i class="material-icons">&#xe5c4;</i></button>
    <div class="nameDiv">
        <p class="title">详情</p>
        <p class="little"></p>
    </div>
</div>
<div class="right">
    <button style="display:none" onclick=""><i class="material-icons">&#xe5d3;</i></button>
</div>
</header>
<div class="postBox cardBox postCardBox main">
    <div class="postMainSke">
        <div class="card avatarBox ">{{postSke}}</div>
        <div class="card tagCard">
            <div class="content"><a class="ca skeleton" style="width: 3em;margin-right: 5px">.</a> <a class="ca skeleton" style="width: 3em;margin-right: 5px">.</a> <a class="ca skeleton" style="width: 3em;margin-right: 5px">.</a></div>
        </div>
        <div class="card interactionBar">
            <button disabled class="skeleton" style="margin: -5px 0px;width: 3em">.</button> <button disabled class="skeleton" style="margin: -5px 0px;width: 3em">.</button>
        </div>
    </div>
    <div class="postMainReal card avatarBox" ></div>
    <div class="postRelated" ></div>
    <div class="card comments avatarBox" style="display:none">
        <div class="header">
            <h2>评论</h2>
            <div class="buttons"><button onclick="showCommentTypeSwitch({{pid}})"><i class="material-icons">swap_horiz</i></button></div>
        </div>
        <div class="commentsReal"></div>
        <div class="comment skeBox">
        {{postSke}}
        </div>
    </div>
</div>
<div class="inputBox">
    <div class="inputSurface"><div onclick="newMsgBox('开发中')" class="fakeInput" tabindex="1" onkeydown="divClick(this, event)">精彩的评论也是乐子的一部分</div>  
    <button onclick="newMsgBox('开发中')" class="starButton"><i class="material-icons star">star_border</i><i class="material-icons starred">star</i></button>
    <button onclick="newMsgBox('开发中')" class="share"><i class="material-icons">share</i></button>
    </div>
</div>
</div>
`;

postSke = `
    <div class="header">
        <a class="name"><i class="skeleton noscale"></i>
            <div>
                <p class="unick skeleton" style="width: 4em">.</p>
                <p class="time skeleton" style="width: 4em">.</p>
            </div>
        </a>
    </div>
    <div class="content">
        <p class="skeleton sentence">.</p>
        <p class="skeleton sentence">.</p>
        <p class="skeleton sentence">.</p>
    </div>
    <div class="bottom">
        <div class="word">
            <p class="skeleton" style="width: 6em">.</p>
        </div>
        <div class="buttons">
            <button disabled class="skeleton" style="width: 3em">.</button><button disabled class="skeleton" style="width: 3em">.</button>
        </div>
    </div>
`;

postAreaTemplate = `
<div class="header">
    <a class="name" tabindex="0" onclick="newUserInfoPage({{uid}});" onkeydown="divClick(this, event)"><i style="background-image:url('{{avatar}}')"></i>
        <div>
            <p class="unick">{{nick}}</p>
            <p class="time" time="true" timestamp="{{time}}" timestyle="relative" timesec="false" timefull="false"></p>
        </div>
    </a>
    <div class="buttons">
        <button onclick="postContextMenu('{{type}}', {{id}});"><i class="material-icons">more_vert</i></button>
    </div>
</div>
<div class="content">
    <p class="status">{{status}}</p>
    <a {{href}} class="text"><object class="{{slug}}">
            <p>{{content}}</p>
        </object></a>
    <div class="media">
        <ui class="medias" id="tes" type="x{{mediatype}}">{{medias}}</ui>
        {{specialMedias}}
    </div>
</div>
<div class="bottom">
    <div class="word">
        <p>浏览<span class="viewNum">{{view}}</span>次</p>
    </div>
    <div class="buttons">{{buttons}} </div>
</div>
`;

postAreaUnavaliableTemplate = `
<div class="unavaliable"><i></i><p>{{w}}</p></div>`;

errorCode = {
    "403": "内容已被封锁，您无权查看",
    "404": "内容可能去了另一个星球"
};

biliVideoTemplate = `<iframe class="biliVideo" frameborder="no" scrolling="no" src="https://player.bilibili.com/player.html?bvid={{bvid}}&page={{page}}&as_wide=1&high_quality=1" allowfullscreen=""></iframe>`;

sendBoxTemplate = `
<select hideincomment class="categoryS" placeholder="请选择分区…">{{cg}}</select>
<textarea class="sendBoxInput" placeholder="说点什么吧……"></textarea>
<div class="mediasBox"></div>
<div class="inputBox">
    <div class="inputSurface">
    <button onclick="{{id}}_imageInput.click();" title="插入图片"><input type="file" multiple="" title="" id="{{id}}_imageInput" accept="image/*" onchange="putFilesToInput(this,'image','{{id}}')"><i class="material-icons">insert_photo</i></button>
    <button onclick="{{id}}_videoInput.click();" title="插入视频"><input type="file" multiple="" title="" id="{{id}}_videoInput" accept="video/*" onchange="putFilesToInput(this,'video','{{id}}')"><i class="material-icons">videocam</i></button>
    <button onclick="newMsgBox('开发中，敬请期待~')" title="添加表情"><i class="material-icons">tag_faces</i></button>
    <button onclick="newMsgBox('开发中，敬请期待~')" title="引用 Bilibili 视频"><i class="material-icons"><svg t="1632823510933" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2423" width="200" height="200"><path d="M777.514667 131.669333a53.333333 53.333333 0 0 1 0 75.434667L728.746667 255.829333h49.92A160 160 0 0 1 938.666667 415.872v320a160 160 0 0 1-160 160H245.333333A160 160 0 0 1 85.333333 735.872v-320a160 160 0 0 1 160-160h49.749334L246.4 207.146667a53.333333 53.333333 0 1 1 75.392-75.434667l113.152 113.152c3.370667 3.370667 6.186667 7.04 8.448 10.965333h137.088c2.261333-3.925333 5.12-7.68 8.490667-11.008l113.109333-113.152a53.333333 53.333333 0 0 1 75.434667 0z m1.152 231.253334H245.333333a53.333333 53.333333 0 0 0-53.205333 49.365333l-0.128 4.010667v320c0 28.117333 21.76 51.157333 49.365333 53.162666l3.968 0.170667h533.333334a53.333333 53.333333 0 0 0 53.205333-49.365333l0.128-3.968v-320c0-29.44-23.893333-53.333333-53.333333-53.333334z m-426.666667 106.666666c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z m320 0c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z" p-id="2424"></path></svg></i></button>
    <button onclick="newMsgBox('开发中，敬请期待~')" title="插入源链接"><i class="material-icons">link</i></button>
    <button onclick="newMsgBox('开发中，敬请期待~')" title="导入 QQ 聊天记录"><i class="material-icons"><svg t="1632823979156" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3346" width="200" height="200"><path d="M537.407 898.774l0 0c-12.725 0-19.065 0-25.407 0-6.298 0-12.681 0-19.024 0l-6.342 0c-6.342 0-19.024 0-25.365 6.298-25.365 25.407-69.753 38.09-126.825 38.09-38.047 0-69.753-6.383-101.462-19.024-25.365-12.681-38.047-25.407-38.047-44.39 0-19.024 12.681-31.705 44.39-44.432 19.024-6.298 25.365-12.639 25.365-25.407 0-12.639 0-25.323-6.342-31.705-12.681-12.556-19.024-31.622-31.705-44.262-6.342-12.681-19.024-19.065-31.705-19.065l0 0c-12.681 0-19.024 6.383-31.705 12.768-12.681 12.639-19.024 18.939-25.365 18.939l0 0c-6.342 0-12.639-18.939-12.639-50.646s6.299-69.796 12.598-107.887c12.681-38.005 31.705-69.711 63.412-101.418 6.342-6.298 12.681-19.024 12.681-31.705 0-6.298 0-6.298 0-12.639 0-19.065 6.342-38.047 19.024-57.072 6.342-6.342 6.342-12.681 6.342-19.024l0-6.342c0.042-76.138 25.365-139.55 82.479-196.622 50.731-57.114 114.142-82.437 190.238-82.437 76.095 0 139.508 25.365 196.579 82.437 50.772 57.072 82.479 120.484 82.479 196.537 0 0 0 0 0 6.342 0 6.342 0 12.681 6.298 19.024 12.681 19.024 19.024 38.005 19.024 57.072 0 6.342 0 6.342 0 12.639 0 12.681 0 25.407 12.681 31.705 31.705 31.705 50.731 63.412 63.412 101.418 12.681 38.09 19.024 76.179 12.681 107.887 0 31.705-6.342 44.345-18.983 50.646-6.342 0-12.725-6.299-25.407-18.939-6.299-6.342-19.024-12.768-31.705-12.768l-6.299 0c-12.725 0-25.407 6.383-31.705 19.065-6.342 19.024-19.065 31.705-31.705 44.345-6.342 6.383-12.725 19.065-6.342 31.705 0 12.768 12.681 19.065 18.983 25.407 31.665 12.768 44.39 25.45 44.39 44.473 0 18.982-12.725 31.705-38.047 44.39-25.365 12.639-63.412 19.024-101.462 19.024-57.072 0-95.119-12.725-126.825-38.09 6.342 0-6.342-6.342-12.639-6.342l0 0zM683.215 1019.301c63.412 0 114.142-12.681 152.19-38.005 38.047-25.407 63.412-57.114 63.412-101.462 0-25.365-6.299-44.432-18.982-63.412 6.342 0 18.982 0 25.365-6.383 38.047-12.639 57.072-44.345 63.412-95.119 6.342-44.345 0-95.119-18.982-152.149-12.725-44.432-38.047-82.437-69.753-120.484l0 0c0-31.705-6.342-57.072-19.024-88.777 0-95.119-31.705-177.556-101.418-247.352-69.882-69.753-152.317-101.462-247.435-101.462-95.119 0-177.556 31.705-247.31 101.418-63.455 69.796-101.462 152.233-101.462 247.352-12.681 25.365-19.024 57.072-19.024 88.777l0 6.342c-38.047 31.705-57.072 76.095-69.753 114.142-19.024 57.029-25.365 107.802-19.024 152.149 6.342 50.772 31.705 82.479 63.412 95.119 6.342 0 19.024 6.383 25.365 6.383-12.681 18.982-19.024 38.047-19.024 63.412 0 38.047 19.024 76.095 63.412 101.462 38.047 25.365 88.777 38.047 145.848 38.047 63.412 0 120.484-12.681 158.532-44.39l31.705 0c44.432 31.705 95.119 44.39 158.532 44.39l0 0z" p-id="3347"></path></svg></i></button>
    <button onclick="newMsgBox('开发中，敬请期待~')" hideincomment title="话题"><i class="material-icons"><svg t="1632824088981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3741" width="200" height="200"><path d="M968.861538 261.907692h-128l55.138462-210.707692v-3.938462c0-7.876923-5.907692-15.753846-15.753846-15.753846h-102.4c-7.876923 0-13.784615 5.907692-15.753846 13.784616l-55.138462 218.584615h-256l55.138462-210.707692v-5.907693c0-7.876923-5.907692-15.753846-15.753846-15.753846h-102.4c-7.876923 0-13.784615 5.907692-15.753847 13.784616l-57.107692 216.615384H173.292308c-7.876923 0-13.784615 3.938462-15.753846 11.815385l-25.6 96.492308v3.938461c0 7.876923 5.907692 15.753846 15.753846 15.753846h133.907692l-63.015385 246.153846h-137.846153c-7.876923 0-13.784615 3.938462-15.753847 11.815385L39.384615 740.430769v3.938462c0 7.876923 5.907692 15.753846 15.753847 15.753846h129.96923L129.969231 974.769231v3.938461c0 7.876923 5.907692 15.753846 15.753846 15.753846h102.4c7.876923 0 13.784615-3.938462 15.753846-13.784615l57.107692-220.553846h254.03077l-55.138462 212.676923v3.938462c0 7.876923 5.907692 15.753846 15.753846 15.753846h102.4c7.876923 0 13.784615-3.938462 15.753846-13.784616L708.923077 758.153846h139.815385c7.876923 0 13.784615-3.938462 15.753846-13.784615l25.6-96.492308v-3.938461c0-7.876923-5.907692-15.753846-15.753846-15.753847h-131.938462L807.384615 382.030769h135.876923c7.876923 0 13.784615-3.938462 15.753847-13.784615l25.6-96.492308v-3.938461s-7.876923-5.907692-15.753847-5.907693z m-360.36923 374.153846H354.461538l63.015385-246.153846h254.030769l-63.015384 246.153846z" p-id="3742"></path></svg></i></button>
    </div>
</div>
`;

setPostInputArea(commentEditBox, "comment");
setPostInputArea(sendEditBox, "post");

// 插入文件
function putFilesToInput(fileInput, type, id) {
    console.log("Get files from fileInput " + fileInput.id);
    //把选择的图片显示到img上
    try {
        for (fileOperated = 0; fileOperated < fileInput.files.length; fileOperated++) {
            file = fileInput.files[fileOperated];
            fileName = fileInput.files[fileOperated].name;
            fileSize = fileInput.files[fileOperated].size;
            console.log(fileInput.files[fileOperated]);
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                console.log(this.result);
                switch (type) {
                    case "image":
                        addItemToFileBar(id, "['img','" + this.result + "']", "<div style='background-image: url(" + this.result + ");background-position: 50% 50%; background-size: cover; background-repeat: no-repeat;'></div>");
                        break;
                    case "video":
                        addItemToFileBar(id, "['video','" + this.result + "']", "<center>视频</center>");
                        break;
                    default:
                }
            }
        }
        document.getElementById(id).getElementsByClassName("sendBoxInput")[0].focus();
    }
    catch (err) {
        newErrorBox("putFilesToInput", err);
    }
}

// 附件栏增加项目
function addItemToFileBar(id, info, HTML) {
    mtid = gTime();
    document.getElementById(id).getElementsByClassName("mediasBox")[0].innerHTML += `<div class="m" m="` + info + `" mtid="` + mtid + `"><button class="delButton" title="删除这个媒体" onclick="delItemInFileBar(` + mtid + `)"></button>` + HTML + `</div>`;
}

// 附件栏删除项目
function delItemInFileBar(mtid) {
    $("*[mtid=" + mtid + "]").remove();
}

// 转换单引号双引号
function switchMarks(t) {
    return t.replace(/'/g, "{{double}}").replace(/"/g, "'").replace(/{{double}}/g, '"');
}
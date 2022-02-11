// 设置发帖回帖区域
function setPostInputArea(ele, type) {
    cgOptions = '';
    for (i = 0; i < moreCategoryList.length; i++) {
        cgOptions += `<option cgid="` + moreCategoryList[i]['id'] + `">` + moreCategoryList[i]['name'] + `</option>`;
    }
    ele.innerHTML = sendBoxTemplate.replace(/{{cg}}/g, cgOptions).replace(/{{id}}/g, ele.id).replace(/{{type}}/g, type);
    ele.className += " inputArea " + type;
    writeLog("i", "setPostInputArea", ele.id);
}

// 发帖
function sendPost(div, postType, onSuccess) {
    if (logRequire()) {
        // 通用：是否填写内容
        if (div.getElementsByClassName("sendBoxInput")[0].innerHTML.replace(/ /g, "").replace(/\\n/g, "") == "") {
            return newMsgBox("你总得写点什么再发表吧……");
        }
        // 通用：设置参数
        textToSend = cleanHTMLTag(div.getElementsByClassName("sendBoxInput")[0].innerHTML);
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
                if (i < div.getElementsByClassName("mediasBox")[0].getElementsByClassName("m").length - 1) {
                    mediaToSend += ",";
                }
            }
            catch (err) { }
        }
        mediaToSend += "]}";
        tagsToSend = ""; // 开发中
        // 发送参数：帖子
        if (postType == "post") {
            titleToSend = div.getElementsByClassName("titleInput")[0].value;
            categoryToSend = div.getElementsByClassName("categoryS")[0].getElementsByTagName("option")[div.getElementsByClassName("categoryS")[0].selectedIndex].getAttribute("cgid");
            sendData = { type: "post", title: titleToSend, content: textToSend, media: mediaToSend, category: categoryToSend, tags: tagsToSend };
        }
        if (postType == "comment") {
            // 发送参数：评论
            if (!div.getAttribute("inpost")) return newMsgBox("啊哦，nmFun 内部出现错误");
            inpost = div.getAttribute("inpost");
            tocomment = div.getAttribute("tocomment");
            sendData = { type: "comment", inpost: inpost, tocomment: tocomment, content: textToSend, media: mediaToSend };
        }
        sendCover.setAttribute("open", "true");
        newAjax("POST", backEndURL + "/post/newpost.php", true, "", sendData, function () { sendCover.setAttribute("open", "false"); onSuccess(); }, function (err) { sendCover.setAttribute("open", "false"); newMsgBox("出现错误，发送失败。<br>服务器返回错误 " + err['info']) });
    }
}

// 展示/关闭发帖
function showPostInput(which, toS) {
    document.getElementById("" + which + "Edit").setAttribute("open", toS);
    if (toS) {
        document.getElementById("" + which + "EditBoxCover").setAttribute("open", "true");
        try {
            if (localStorage.getItem("sendCategoryCraft" + "_" + "" + which + "EditBox")) document.getElementById("" + which + "EditBox").getElementsByClassName("categoryS")[0].value = localStorage.getItem("sendCategoryCraft" + "_" + "" + which + "EditBox");
            document.getElementById("" + which + "EditBox").getElementsByClassName("titleInput")[0].value = localStorage.getItem("sendTitleCraft" + "_" + "" + which + "EditBox");
            document.getElementById("" + which + "EditBox").getElementsByClassName("sendBoxInput")[0].innerHTML = localStorage.getItem("sendCraft" + "_" + "" + which + "EditBox");
            document.getElementById("" + which + "EditBox").getElementsByClassName("mediasBox")[0].innerHTML = localStorage.getItem("sendMediaCraft" + "_" + "" + which + "EditBox");
        } catch (err) { console.error(err); }
    }
    else document.getElementById("" + which + "EditBoxCover").removeAttribute("open");
    try { setStickersSelBox(document.getElementById("" + which + "EditBox").getElementsByClassName("stickersChoose")[0]); }
    catch (err) { console.error(err) };
    writeLog("i", "showPostInput", which + " to " + toS);
}

// 保存到草稿箱
function saveCraft(ele, type, noti = true) {
    localStorage.setItem("sendCategoryCraft" + "_" + ele.id, ele.getElementsByClassName("categoryS")[0].value);
    localStorage.setItem("sendTitleCraft" + "_" + ele.id, ele.getElementsByClassName("titleInput")[0].value);
    localStorage.setItem("sendCraft" + "_" + ele.id, ele.getElementsByClassName("sendBoxInput")[0].innerHTML);
    try {
        localStorage.setItem("sendMediaCraft" + "_" + ele.id, ele.getElementsByClassName("mediasBox")[0].innerHTML);
        if (noti) newMsgBox("当前内容已保存到草稿箱。");
    }
    catch (err) {
        if (noti) newMsgBox("当前内容已保存到草稿箱，但附件由于过大无法保存。");
    }
    writeLog("i", "saveCraft", ele.id);
}

// 清空草稿箱和输入框
function dropCraft(ele, type) {
    localStorage.removeItem("sendCategoryCraft" + "_" + ele.id);
    localStorage.removeItem("sendTitleCraft" + "_" + ele.id);
    localStorage.removeItem("sendCraft" + "_" + ele.id);
    localStorage.removeItem("sendMediaCraft" + "_" + ele.id);
    ele.getElementsByClassName("categoryS")[0].value = "";
    ele.getElementsByClassName("titleInput")[0].value = "";
    ele.getElementsByClassName("sendBoxInput")[0].innerHTML = "";
    ele.getElementsByClassName("mediasBox")[0].innerHTML = "";
    writeLog("i", "dropCraft", ele.id);
}

// 缩放底栏更多
function changebottomBoxMoreStatus(areaId, className, toFalse = false) {
    inputDiv = document.getElementById(areaId).getElementsByClassName("bottomBox")[0];
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
    // if (inputDiv.getElementsByClassName("inputDrawer")[0].getAttribute("open") != "true") inputDiv.getElementsByClassName("more")[0].removeAttribute("open");
    // else inputDiv.getElementsByClassName("more")[0].setAttribute("open", "true");
}



errorCode = {
    "403": "内容已被封锁，您无权查看",
    "404": "内容可能去了另一个星球",
    "NETWORK_ERROR": "无法连接到服务器"
};

biliVideoTemplate = `<iframe class="biliVideo" frameborder="no" scrolling="no" src="https://player.bilibili.com/player.html?bvid={{bvid}}&page={{page}}&as_wide=1&high_quality=1" allowfullscreen=""></iframe>`;

sendBoxTemplate = `
<div class="categoryAndTitle" hideincomment>
    <select hideincomment class="categoryS" placeholder="分区" title="请选择分区…">{{cg}}</select>
    <input hideincomment class="titleInput" title="取个标题" placeholder="取个标题">
</div>
<div class="sendBoxInput textarea" title="说点什么吧……" placeholder="说点什么吧……" oninput="autoSaveCraft({{id}},'{{type}}')" contenteditable="true"></div>
<div class="noticeBox"><button onclick="openNotice('nmfun_post_rule')">nmFun发帖守则</button></div>
<div class="mediasBox" noselect></div>
<div class="bottomBox">
    <div class="bottomSurface">
        <button onclick="{{id}}_imageInput.click();" title="插入图片"><input type="file" multiple="" title="" id="{{id}}_imageInput" accept="image/*" onchange="putFilesToInput(this,'image','{{id}}')"><i class="material-icons">insert_photo</i></button>
        <button onclick="{{id}}_videoInput.click();" title="插入视频"><input type="file" multiple="" title="" id="{{id}}_videoInput" accept="video/*" onchange="putFilesToInput(this,'video','{{id}}')"><i class="material-icons">videocam</i></button>
        <button onclick="changebottomBoxMoreStatus('{{id}}','stickersChoose');" title="添加表情"><i class="material-icons">tag_faces</i></button>
        <button onclick="newBrowser('/settings/bilivideoimport.html?ret={{id}}',' biliImportFrame ',false,false);" title="引用 Bilibili 视频"><i class="material-icons"><svg t="1632823510933" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2423" width="200" height="200"><path d="M777.514667 131.669333a53.333333 53.333333 0 0 1 0 75.434667L728.746667 255.829333h49.92A160 160 0 0 1 938.666667 415.872v320a160 160 0 0 1-160 160H245.333333A160 160 0 0 1 85.333333 735.872v-320a160 160 0 0 1 160-160h49.749334L246.4 207.146667a53.333333 53.333333 0 1 1 75.392-75.434667l113.152 113.152c3.370667 3.370667 6.186667 7.04 8.448 10.965333h137.088c2.261333-3.925333 5.12-7.68 8.490667-11.008l113.109333-113.152a53.333333 53.333333 0 0 1 75.434667 0z m1.152 231.253334H245.333333a53.333333 53.333333 0 0 0-53.205333 49.365333l-0.128 4.010667v320c0 28.117333 21.76 51.157333 49.365333 53.162666l3.968 0.170667h533.333334a53.333333 53.333333 0 0 0 53.205333-49.365333l0.128-3.968v-320c0-29.44-23.893333-53.333333-53.333333-53.333334z m-426.666667 106.666666c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z m320 0c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z" p-id="2424"></path></svg></i></button>
        <button onclick="newMsgBox('开发中，敬请期待~')" title="插入源链接"><i class="material-icons">link</i></button>
        <button onclick="newMsgBox('开发中，敬请期待~')" title="导入 QQ 聊天记录"><i class="material-icons"><svg t="1632823979156" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3346" width="200" height="200"><path d="M537.407 898.774l0 0c-12.725 0-19.065 0-25.407 0-6.298 0-12.681 0-19.024 0l-6.342 0c-6.342 0-19.024 0-25.365 6.298-25.365 25.407-69.753 38.09-126.825 38.09-38.047 0-69.753-6.383-101.462-19.024-25.365-12.681-38.047-25.407-38.047-44.39 0-19.024 12.681-31.705 44.39-44.432 19.024-6.298 25.365-12.639 25.365-25.407 0-12.639 0-25.323-6.342-31.705-12.681-12.556-19.024-31.622-31.705-44.262-6.342-12.681-19.024-19.065-31.705-19.065l0 0c-12.681 0-19.024 6.383-31.705 12.768-12.681 12.639-19.024 18.939-25.365 18.939l0 0c-6.342 0-12.639-18.939-12.639-50.646s6.299-69.796 12.598-107.887c12.681-38.005 31.705-69.711 63.412-101.418 6.342-6.298 12.681-19.024 12.681-31.705 0-6.298 0-6.298 0-12.639 0-19.065 6.342-38.047 19.024-57.072 6.342-6.342 6.342-12.681 6.342-19.024l0-6.342c0.042-76.138 25.365-139.55 82.479-196.622 50.731-57.114 114.142-82.437 190.238-82.437 76.095 0 139.508 25.365 196.579 82.437 50.772 57.072 82.479 120.484 82.479 196.537 0 0 0 0 0 6.342 0 6.342 0 12.681 6.298 19.024 12.681 19.024 19.024 38.005 19.024 57.072 0 6.342 0 6.342 0 12.639 0 12.681 0 25.407 12.681 31.705 31.705 31.705 50.731 63.412 63.412 101.418 12.681 38.09 19.024 76.179 12.681 107.887 0 31.705-6.342 44.345-18.983 50.646-6.342 0-12.725-6.299-25.407-18.939-6.299-6.342-19.024-12.768-31.705-12.768l-6.299 0c-12.725 0-25.407 6.383-31.705 19.065-6.342 19.024-19.065 31.705-31.705 44.345-6.342 6.383-12.725 19.065-6.342 31.705 0 12.768 12.681 19.065 18.983 25.407 31.665 12.768 44.39 25.45 44.39 44.473 0 18.982-12.725 31.705-38.047 44.39-25.365 12.639-63.412 19.024-101.462 19.024-57.072 0-95.119-12.725-126.825-38.09 6.342 0-6.342-6.342-12.639-6.342l0 0zM683.215 1019.301c63.412 0 114.142-12.681 152.19-38.005 38.047-25.407 63.412-57.114 63.412-101.462 0-25.365-6.299-44.432-18.982-63.412 6.342 0 18.982 0 25.365-6.383 38.047-12.639 57.072-44.345 63.412-95.119 6.342-44.345 0-95.119-18.982-152.149-12.725-44.432-38.047-82.437-69.753-120.484l0 0c0-31.705-6.342-57.072-19.024-88.777 0-95.119-31.705-177.556-101.418-247.352-69.882-69.753-152.317-101.462-247.435-101.462-95.119 0-177.556 31.705-247.31 101.418-63.455 69.796-101.462 152.233-101.462 247.352-12.681 25.365-19.024 57.072-19.024 88.777l0 6.342c-38.047 31.705-57.072 76.095-69.753 114.142-19.024 57.029-25.365 107.802-19.024 152.149 6.342 50.772 31.705 82.479 63.412 95.119 6.342 0 19.024 6.383 25.365 6.383-12.681 18.982-19.024 38.047-19.024 63.412 0 38.047 19.024 76.095 63.412 101.462 38.047 25.365 88.777 38.047 145.848 38.047 63.412 0 120.484-12.681 158.532-44.39l31.705 0c44.432 31.705 95.119 44.39 158.532 44.39l0 0z" p-id="3347"></path></svg></i></button>
        <button onclick="document.getElementById('{{id}}').getElementsByClassName('sendBoxInput')[0].innerHTML+='#';" hideincomment title="话题"><i class="material-icons"><svg t="1632824088981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3741" width="200" height="200"><path d="M968.861538 261.907692h-128l55.138462-210.707692v-3.938462c0-7.876923-5.907692-15.753846-15.753846-15.753846h-102.4c-7.876923 0-13.784615 5.907692-15.753846 13.784616l-55.138462 218.584615h-256l55.138462-210.707692v-5.907693c0-7.876923-5.907692-15.753846-15.753846-15.753846h-102.4c-7.876923 0-13.784615 5.907692-15.753847 13.784616l-57.107692 216.615384H173.292308c-7.876923 0-13.784615 3.938462-15.753846 11.815385l-25.6 96.492308v3.938461c0 7.876923 5.907692 15.753846 15.753846 15.753846h133.907692l-63.015385 246.153846h-137.846153c-7.876923 0-13.784615 3.938462-15.753847 11.815385L39.384615 740.430769v3.938462c0 7.876923 5.907692 15.753846 15.753847 15.753846h129.96923L129.969231 974.769231v3.938461c0 7.876923 5.907692 15.753846 15.753846 15.753846h102.4c7.876923 0 13.784615-3.938462 15.753846-13.784615l57.107692-220.553846h254.03077l-55.138462 212.676923v3.938462c0 7.876923 5.907692 15.753846 15.753846 15.753846h102.4c7.876923 0 13.784615-3.938462 15.753846-13.784616L708.923077 758.153846h139.815385c7.876923 0 13.784615-3.938462 15.753846-13.784615l25.6-96.492308v-3.938461c0-7.876923-5.907692-15.753846-15.753846-15.753847h-131.938462L807.384615 382.030769h135.876923c7.876923 0 13.784615-3.938462 15.753847-13.784615l25.6-96.492308v-3.938461s-7.876923-5.907692-15.753847-5.907693z m-360.36923 374.153846H354.461538l63.015385-246.153846h254.030769l-63.015384 246.153846z" p-id="3742"></path></svg></i></button>
    </div>
    <div class="bottomDrawer">
        <div class="more stickersChoose">
        </div>
    </div>
</div>
`;
function postInputInit() {
    setPostInputArea(commentEditBox, "comment");
    setPostInputArea(sendEditBox, "post");
}

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
    writeLog("i", "addItemToFileBar", "id: " + id + ", mtid: " + mtid);
}

// 附件栏删除项目
function delItemInFileBar(mtid) {
    $("*[mtid=" + mtid + "]").remove();
    writeLog("i", "delItemInFileBar", "mtid: " + mtid);

}

// 转换单引号双引号
function switchMarks(t) {
    return t.replace(/'/g, "{{double}}").replace(/"/g, "'").replace(/{{double}}/g, '"');
}

// 自动保存
function autoSaveCraft(ele, type) {
    if (localStorage.autoSaveCraft == "true") {
        saveCraft(ele, type, false);
    }
}
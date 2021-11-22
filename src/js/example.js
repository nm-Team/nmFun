new_element = document.createElement('object');
new_element.innerHTML = `
<div class="postMainReal card avatarBox">
    <div class="header">
        <a class="name" tabindex="0" onclick="newUserInfoPage('uid');"
            onkeydown="divClick(this, event)"><i
                style="background-image:url('avatar')"></i>
            <div>
                <p class="unick">nick</p>
                <p class="time" time="true" timestamp="1919810" timestyle="relative"
                    timesec="false" timefull="false"
                    title=""></p>
            </div>
        </a>
        <div class="buttons">
            <button onclick="postContextMenu('type', 'id', this);" title="选项"><i
                    class="material-icons">more_vert</i></button>
        </div>
    </div>
    <div class="content">
        <p class="status">status</p>
        <a href="" target="_blank" onclick="" class="text" title="点击来进入帖子详情"><object class="slug">
                <p>content</p>
            </object></a>
        <!-- 注：预览页（而不是详情页）此处的设定是点content进入详情页 -->
        <!-- 同时设置onclick（优先）和a标签（新窗口打开，target=blank） -->
        <div class="media">
            <ui class="medias" id="tes" type="xmediatype">medias</ui>
            specialMedias
        </div>
    </div>
    <div class="bottom">
        <div class="word">
            <p>浏览<span class="viewNum">view</span>次</p>
        </div>
        <div class="buttons">buttons </div>
    </div>
</div>`;
$("post").append(new_element);
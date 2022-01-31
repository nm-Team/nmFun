siteURL = "https://fun.nmteam.xyz";
accountClient = "https://accounts.nmteam.xyz";
backEndURL = "https://funapi.nmteam.xyz";
debugMode = true;
version = {
    version: "0.2_dev",
    versionNum: "25",
    branch: "co_refresh",
    betaVersion: true
}

$.ajax({
    type: "GET",
    url: backEndURL + "/info.php",
    async: true,
    dataType: "json",
    success: function (response, status, request) {
        writeLog("i", "get backend site info", JSON.stringify(response));
        try {
            // 首页轮播图
            eval(response['info']['header_swiper']).forEach(element => {
                indexSwiperBox.innerHTML += `<div class="swiper-slide" onclick="` + element[1] + `" title="` + element[2] + `" style="background-image: url('` + element[0] + `'); background-position: 50% 50%;">` + element[3] + `</div>`;
            });
            // 首页分类
            categoryList = eval(response['info']['category']);
            categoryList.forEach(element => {
                indexMoreTypes.innerHTML += `<label for="indexType_more_` + element['id'] + `"><input id="indexType_more_` + element['id'] + `" onclick="indexSwitchType('` + element['id'] + `');" type="radio" name="indexType"><span>` + element['name'] + `</span></label>`;
            });
            closeHover();
        }
        catch (err) {
            writeLog("e", "setting site main", err);
            alert("抱歉，加载 nmFun 重要组件时出现错误，可能导致 nmFun 体验出现问题。请尝试刷新页面，若问题持续存在，请联系 nmFun 支持。<br><br><b>错误详情：</b><code>" + err + "</code>", "好像出了点问题…", "仍要继续", "closeHover();", "刷新", "window.location.href=''");
        }
    },
    error: function () {
        writeLog("e", "get backend site info", "ajax error");
        alert("抱歉，与 nmFun 的连接出现问题。请尝试刷新页面，或检查您的网络状况。若问题持续存在，请联系 nmFun 支持。", "nm，出错了", "刷新", "window.location.href=''", "查看高级菜单(开发者)", "showTestField()");
    }
});

startInv = null;

function closeHover() {
    // if (document.readyState == "complete") {
        try {
            $(startHover).attr("data-closed", "true");
            writeLog("i", "closeHover", "done");
            loadWelcomePage();
            $("body").attr("data-loadover", "true");
            setTimeout(() => {
                startHover.outerHTML = "";
            }, 400);
            clearInterval(startInv);
            startInv = null;
            console.log("startInv closed");
            postInputInit();
        }
        catch (err) { }
    // }
    // else {
    //     startInv = setInterval(() => {
    //         closeHover();
    //     }, 400);
    // }
}


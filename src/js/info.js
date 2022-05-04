siteURL = "https://" + window.location.hostname;
accountClient = "https://accounts.nmteam.xyz";
backEndURL = "https://funapi.nmteam.xyz";
avatarURL = "https://api.nmteam.xyz/avatar/?id={id}";
attachURL = backEndURL + "/attachment/";
stickersURL = "/src/img/stickers";
debugMode = true;
systemCategoryList = [{ "id": "focus", "name": "关注" }, { "id": "", "name": "全部" }, { "id": "selected", "name": "精选" }, { "id": "hot", "name": "热榜" }]
version = {
    version: "0.3_dev",
    versionNum: "99.71.9",
    branch: "co_refresh",
    betaVersion: true
}

// 自定义 API 地址
if (localStorage.debugBackEndURL) {
    backEndURL = localStorage.debugBackEndURL;
    writeLog("d", "Set debug API", backEndURL);
    debugInfo.innerHTML += "debug API enabled ";
    attachURL = backEndURL + "/attachment/";
}
if (localStorage.debugAccountClient) {
    accountClient = localStorage.debugAccountClient;
    writeLog("d", "Set debug account client", accountClient);
    debugInfo.innerHTML += "debug accounts client enabled ";
}
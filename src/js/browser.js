browserId = 0;
legacyBrowserId = 0;

function newBrowser(URL, className = "", withTip = true, showOpenInBrowser = true, script = function () { }, customButtons) {
    browserId++;
    if (withTip) fakeURL = siteURL+"/jumpurl.html?" + URL;
    else fakeURL = URL;
    new_element = document.createElement('div');
    new_element.setAttribute('id', "browserFrame" + browserId);
    new_element.setAttribute('class', 'popFrame browserFrame ' + className);
    new_element.setAttribute('name', URL);
    new_element.setAttribute('totallyClose', 'true');
    new_element.innerHTML = browserTemplate.replace(/{{script}}/g, script).replace(/{{browserId}}/g, browserId).replace(/{{browserURL}}/g, fakeURL).replace(/{{browserRealURL}}/g, URL);
    document.body.appendChild(new_element);
    new_element = document.createElement('div');
    new_element.setAttribute('id', 'coverWithColorBro' + browserId);
    new_element.setAttribute('class', 'coverWithColor');
    new_element.setAttribute('open', 'true');
    document.body.appendChild(new_element);
    if (!showOpenInBrowser) document.getElementById("browserFrame" + browserId).getElementsByClassName("moreButton")[0].style.display = "none";
    document.getElementById("browserFrame" + browserId).setAttribute('open', 'true');
    iframeScript = script;
    iframeScript(browserId);
}

function closeBrowser(id) {
    document.getElementById("browserFrame" + id).setAttribute('open', 'false');
    document.getElementById("coverWithColorBro" + id).removeAttribute('open');
    setTimeout(() => {
        document.getElementById("browserFrame" + id).outerHTML = "";
    document.getElementById("coverWithColorBro" + id).outerHTML = "";
    }, 500);
}

function showBrowserContextMenu(URL) {
    msgContextMenuItems = [["在浏览器中打开", "window.open('" + URL + "')"]];
    createContextMenu(msgContextMenuItems);
}

function updateLegacyTitle(browserId) {
    try {
        bFrameE = document.getElementById("browserFrame" + browserId);
        iframeE = document.getElementById("iframe" + browserId);
        if (iframeE.contentWindow.document.title != "")
            bFrameE.setAttribute("name", iframeE.contentWindow.document.title);
        iframeE.setAttribute("loaded", "");
        document.getElementById("browserTitle" + browserId).innerHTML = iframeE.contentWindow.document.title;
        // 防止网络不通畅
        setTimeout(() => {
            updateLegacyTitle(browserId);
        }, 100);
    }
    catch (err) {
        // newErrorBox("updateLegacyTitle", err);
    }
}

browserTemplate = `
<header>
<div class="left">
    <button class="backButton" onclick="closeBrowser({{browserId}})" oncontextmenu="" ontouchstart="" ontouchend="longPressStop()"><i class="material-icons">keyboard_arrow_down</i></button>
    <div class="nameDiv">
        <p class="title" id="browserTitle{{browserId}}"></p>
        <p class="little"></p>
    </div>
</div>
<div class="right">
    <button class="moreButton" onclick="showBrowserContextMenu('{{browserRealURL}}')"><i class="material-icons">&#xe5d3;</i></button>
</div>
</header>
<div class="main">
    <iframe src="{{browserURL}}" onload="updateLegacyTitle('{{browserId}}')" id="iframe{{browserId}}" oncontextmenu="return false;"></iframe>
</div>
`;

function newLegacyBrowser(URL, withTip = true, showOpenInLegacyBrowser = true, script = function(){},customButtons) {
    legacyBrowserId++;
    if (withTip) fakeURL = "./jumpurl.html?" + URL;
    else fakeURL = URL;
    new_element = document.createElement('div');
    new_element.setAttribute('id', "legacyBrowserFrame" + legacyBrowserId);
    new_element.setAttribute('class', 'rightBox box legacyBrowserFrame');
    new_element.setAttribute('con', 'none');
    new_element.setAttribute('name', URL);
    new_element.setAttribute('totallyClose', 'true');
    new_element.innerHTML = legacyBrowserTemplate.replace(/{{script}}/g, script).replace(/{{legacyBrowserId}}/g, legacyBrowserId).replace(/{{legacyBrowserURL}}/g, fakeURL).replace(/{{legacyBrowserRealURL}}/g, URL);
    pageRight.appendChild(new_element);
    focusBox("pageRight", "legacyBrowserFrame" + legacyBrowserId);
    if (!showOpenInLegacyBrowser) document.getElementById("legacyBrowserFrame" + legacyBrowserId).getElementsByClassName("moreButton")[0].style.display = "none";
    iframeScript = script;
    iframeScript(legacyBrowserId);
}

function showLegacyBrowserContextMenu(URL) {
    msgContextMenuItems = [["在浏览器中打开", "window.open('" + URL + "')"]];
    createContextMenu(msgContextMenuItems);
}

function updateLegacyTitle(legacyBrowserId) {
    try {
        bFrameE = document.getElementById("legacyBrowserFrame" + legacyBrowserId);
        iframeE = document.getElementById("iframe" + legacyBrowserId);
        if (iframeE.contentWindow.document.title != "")
            bFrameE.setAttribute("name", iframeE.contentWindow.document.title);
        iframeE.setAttribute("loaded", "");
        document.getElementById("legacyBrowserTitle" + legacyBrowserId).innerHTML = iframeE.contentWindow.document.title;
        // 防止网络不通畅
        setTimeout(() => {
            updateLegacyTitle(legacyBrowserId);
        }, 100);
    }
    catch (err) {
        // newErrorBox("updateLegacyTitle", err);
    }
}

legacyBrowserTemplate = `
<header>
<div class="left">
    <button class="backButton" onclick="closeBox('pageRight','legacyBrowserFrame{{legacyBrowserId}}', true)" oncontextmenu="quickBack('pageRight')" ontouchstart="longPressToDo(function(){quickBack('pageRight')})" ontouchend="longPressStop()"><i class="material-icons">&#xe5c4;</i></button>
    <div class="nameDiv">
        <p class="title" id="legacyBrowserTitle{{legacyBrowserId}}"></p>
        <p class="little"></p>
    </div>
</div>
<div class="right">
    <button class="moreButton" onclick="showLegacyBrowserContextMenu('{{legacyBrowserRealURL}}')"><i class="material-icons">&#xe5d3;</i></button>
</div>
</header>
<div class="main">
    <iframe src="{{legacyBrowserURL}}" onload="updateLegacyTitle('{{legacyBrowserId}}')" id="iframe{{legacyBrowserId}}" oncontextmenu="return false;"></iframe>
</div>
`;
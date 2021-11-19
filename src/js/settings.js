sessionid = getCookie("sessionid");

function goToPage(dir) {
    parent.newLegacyBrowser('/settings/' + dir, false, false);
}

function goAccount() {
    parent.newLegacyBrowser(accountsURL + '/info.html?sessionid=' + sessionid, false, false,
        function (browserId) {
            setTimeout(() => {
                console.log(document.getElementById('iframe' + browserId));
                iframeE = document.getElementById('iframe' + browserId);
                if (iframeE.contentWindow.window.location.href.indexOf('info.html') < 0)
                    window.location.href = '/';
            }, 1000);
        });
}

function changeCheckInSeries(div, toCheck, only = true) {
    div = document.getElementById(div);
    if (only) {
        for (cCISFor = 0; cCISFor < div.getElementsByClassName("but").length; cCISFor++) {
            div.getElementsByClassName("but")[cCISFor].removeAttribute("checked");
        }
        try {
            document.getElementById(toCheck).setAttribute("checked", "true");
        }
        catch (err) { }
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function searchSetting(ele, divId) {
    word = ele.value;
    div = document.getElementById(divId);
    for (i = 0; i < div.getElementsByClassName("but").length; i++) {
        if (div.getElementsByClassName("but")[i].getElementsByTagName("t")[0].innerHTML.toLowerCase().indexOf(word.toLowerCase()) == -1) {
            div.getElementsByClassName("but")[i].style.display = "none";
        }
        else div.getElementsByClassName("but")[i].style.display = "flex";
    }
}

function setSearchBoxPlaceHolder(divid, word){
    if(i18n.t(word)!=word){
        document.getElementById(divid).setAttribute("placeholder", i18n.t(word));
    }
    else setTimeout(() => {
        setSearchBoxPlaceHolder(divid, word);
    }, 100);
}

setInterval(() => {
    $(".but").each(function (index, domEle){
        domEle.setAttribute("tabindex","0");
    });
}, 500);
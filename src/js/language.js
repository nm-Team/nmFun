
var language; // 全局语言

// 更改语言函数
function changeLanguage(lang) {
    if (lang == "auto") { // 设置为自动
        document.cookie = "pageLanguage=" + "auto" + "; max-age=999999999999999; path=/; ";
        return changeLanguage(undefined);
    }
    else if (lang == undefined) { // 视为页面载入时执行的，而不是更改语言。此种情况作判定
        if (!getCookie('pageLanguage') || getCookie('pageLanguage') == "auto") { // 没有设置Cookie或者Cookie为auto，可以按照浏览器判断
            lang = navigator.language || navigator.userLanguage;
            lang = lang.replace('-', '_');
        }
        else {
            // 设置了 Cookie，按Cookie来
            lang = getCookie('pageLanguage');
        }
    }
    else {
        document.cookie = "pageLanguage=" + lang + "; max-age=999999999999999; path=/; ";
    }
    language = lang;
    i18n.init(
        {
            lng: language,
            // 所有翻译在 /src/locales/ 目录下
            // 注：该目录下的 dev.json 请勿删除
            fallbackLng: 'zh_CN',
            // 缺省语言
            resGetPath: siteURL + '/src/locales/__lng__.json'
        },
        function (t) {
            $('html').i18n();
        }
    );
    writeLog("i", "i18n", "translate start, lan is " + language);
}
changeLanguage();


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
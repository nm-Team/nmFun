var mdDir = "notices_markdown/";

// 解析URL地址
var url = getQueryVariable("name");
if (!url) url = "index";

$.ajax({
    type: "GET",
    url: mdDir + url + ".md",
    async: true,
    dataType: "text",
    success: function (response, status, request) {
        console.log("Get Markdown Succeed");
        htmlWord = marked(response);
        htmlWord = htmlWord.replace(/<p>/g, "<p class='text'>");
        // htmlWord = htmlWord.replace(/<img([^>]*) alt="([^>]*)">/g, '<figure><img $1 alt="$2"><figcaption>$2</figcaption></figure>');
        mainBox.innerHTML = htmlWord;
    }
});

// 解析地址
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "null") {
            return null;
        }
        if (pair[0] == variable) {
            return decodeURI(pair[1]);
        }
    }
    return null;
}

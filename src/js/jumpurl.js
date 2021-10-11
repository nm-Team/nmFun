url.innerHTML = window.location.search.replace("?", "");
jumpbutton.setAttribute("onclick", "window.location.href='" + window.location.search.replace("?", "") + "'")

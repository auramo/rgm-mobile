
//Tells if we're in cordova or ordinary web page:
window.inCordova = (document.URL.indexOf("http://") == -1); 

function store() {
    var creds1 = new credentials.Credentials("saunis", "HY", "useri", "passu");
    var creds2 = new credentials.Credentials("elisa", "YA", "useri2", "passu2");
    function successCallback() { logger.log("saved"); }
    function failureCallback() { logger.log("failed"); }
    new credentials.CredentialRepository().saveCredentialList([creds1, creds2], "my pass", successCallback, failureCallback);
}

function otherPage() {
    $.mobile.changePage("#otherpage");
}

function mainView() {
    $.mobile.changePage("#mainview");
}

function testOpeningNewBrowserWindow() {
    logger.log("Open new browser window");
    navigator.app.loadUrl("http://news.ycombinator.com", { openExternal:true });
    return false;
}

function retrieve() {

    logger.log("in cordova?");
    logger.log(window.inCordova);

    logger.log("RETRIEVING");
    logger.log(_.min([4, 2, 8, 6]));
    new credentials.CredentialRepository().getCredentialList("some pass", ok, fail);
    logger.log("After async retrieve call")

    function ok(creds) {
	logger.log("got creds:");
	logger.log(creds);
    }

    function fail(reason, code) {
	logger.log("fail reason:");
	logger.log(reason);
	logger.log("fail code:");
	logger.log(code);
	if (code == Dropbox.ApiError.INVALID_TOKEN) {
	    alert("Got invalid token");
	}
    }
}

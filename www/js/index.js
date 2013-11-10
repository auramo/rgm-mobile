
var app = function() {
    var credentialRepository = new credentials.CredentialRepository();
    var theEditView = new editView.EditView(credentialRepository);
    var theListView = new listView.ListView(credentialRepository);
    var masterPasswordDialog = new masterPassword.MasterPasswordDialog();

    function initialize() {
        bindEvents();
    }

    function bindEvents() {
	if (runningInMobileDevice()) {
	    logger.log("Running in mobile device");
            document.addEventListener('deviceready', onDeviceReady, false);
	} else {
	    logger.log("Running in normal web page device");
	    document.addEventListener('DOMContentLoaded', onDeviceReady, false);
	}
    }

    function onDeviceReady() {
	ui.showAjaxLoader();
	masterPasswordDialog.show();
    }

    function runningInMobileDevice() {
	return (document.URL.indexOf("http://") == -1);
    }

    return {
	initialize: initialize,
	theEditView: theEditView,
	theListView: theListView,
	masterPasswordDialog: masterPasswordDialog
    }
}();



//Temporary hack, use constructor here as well to get around this problem
var _credentialRepository = new credentials.CredentialRepository();

var app = {
    credentialRepository: _credentialRepository,
    theEditView: new editView.EditView(_credentialRepository),
    theListView: new listView.ListView(_credentialRepository),
    masterPasswordDialog: new masterPassword.MasterPasswordDialog(),
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
	if (this.runningInMobileDevice()) {
	    logger.log("Running in mobile device");
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	} else {
	    logger.log("Running in normal web page device");
	    document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
	}
    },

    onDeviceReady: function() {
	ui.showAjaxLoader();
	this.masterPasswordDialog.show();
    },
    runningInMobileDevice: function() {
	return (document.URL.indexOf("http://") == -1);
    }
};


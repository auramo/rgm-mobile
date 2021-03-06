
var app = function() {
    var preferenceRepository = new preferences.PreferenceRepository();
    var credentialRepository = new credentials.CredentialRepository(preferenceRepository);
    var theEditView = new editView.EditView(credentialRepository);
    var theListView = new listView.ListView(credentialRepository);
    var masterPasswordDialog = new masterPassword.MasterPasswordDialog();
    var preferencesDialog = new preferences.PreferencesDialog(preferenceRepository);

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
	if (!maybeShowPreferenceDialog())
	    masterPasswordDialog.show();
    }

    function maybeShowPreferenceDialog() {
	var prefs = preferenceRepository.getPreferences();
	if (prefs.missingPreferences()) {
	    preferencesDialog.show();
	    return true;
	}
	return false;
     }

    function runningInMobileDevice() {
	return (document.URL.indexOf("http://") == -1);
    }

    return {
	initialize: initialize,
	theEditView: theEditView,
	theListView: theListView,
	masterPasswordDialog: masterPasswordDialog,
	preferencesDialog: preferencesDialog
    }
}();


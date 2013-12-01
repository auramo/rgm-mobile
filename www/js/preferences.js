var preferences = function() {

    function PreferencesDialog() {}

    PreferencesDialog.prototype.show = function() {
	console.log("PregerencesDialog.show");
	ui.showView('ui-preferences');
    }

    function Preferences(loginDetails, dropboxPath) {
	this.loginDetails = loginDetails || new credentials.RgmLoginDetails();
	this.dropboxPath = dropboxPath;
    }

    Preferences.prototype.missingPreferences = function() {
	return !this.loginDetails.hasMinimumDetails() || _.isEmpty(this.dropboxPath)
    }

    Preferences.prototype.getDropboxApiKey = function() {
	return this.loginDetails.details.key;
    }

    Preferences.prototype.getDropboxApiSecret = function() {
	return this.loginDetails.details.secret;
    }

    Preferences.prototype.getDropboxPath = function() { return this.dropboxPath; }

    Preferences.prototype.setDropboxPath = function(path) { this.dropboxPath = path; }

    Preferences.prototype.setDropboxApiSecret = function(secret) {
	this.loginDetails.details.secret = secret;
    }

    function PreferenceRepository() {
	this.loginDetailRepository = new credentials.RgmLoginDetailRepository();
    }

    PreferenceRepository.prototype.getPreferences = function() {
	var loginDetails = this.loginDetailRepository.getStoredLoginDetails()
	var dropboxPath = window.localStorage.getItem(credentials.GENERAL_PREFERENCE_KEY + ".dropboxPath");
	return new Preferences(loginDetails, dropboxPath);
    }

    PreferenceRepository.prototype.storePreferences = function(preferences) {
	this.loginDetailRepository.storeLoginDetails(preferences.loginDetails);
	window.localStorage.setItem(credentials.GENERAL_PREFERENCE_KEY + ".dropboxPath", preferences.dropboxPath);
    }

    return  {
	PreferenceRepository: PreferenceRepository,
	Preferences: Preferences,
	PreferencesDialog: PreferencesDialog
    };
}();


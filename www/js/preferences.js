var preferences = function() {

    function PreferencesDialog(preferenceRepository) {
	this.preferenceRepository = preferenceRepository;
	var prefs = this.preferenceRepository.getPreferences();
	this.setValues(prefs);
	this.initEvents();
    }

    PreferencesDialog.prototype.initEvents = function() {
	addStreams(['input[name="file-path"]', 'input[name="api-key"]', 'input[name="api-secret"]']);
	function addStreams(fieldSelectors) {
	    console.log(fieldSelectors);
	    var fieldEmptyProps = _.map(fieldSelectors, function(selector) {
		return Bacon.$.textFieldValue($(selector)).map(isEmpty)
	    });
	    Bacon.combineAsArray.apply(null, fieldEmptyProps)
	     	.map(_.some)
	     	.onValue($('input[name="save-prefs"]'), "attr", "disabled");
	}
	function isEmpty(val) { return val.length === 0; }
    }

    PreferencesDialog.prototype.setValues = function(prefs) {
	$('input[name="file-path"]').val(prefs.getDropboxPath());
	$('input[name="api-key"]').val(prefs.getDropboxApiKey());
	$('input[name="api-secret"]').val(prefs.getDropboxApiSecret());
    }

    PreferencesDialog.prototype.show = function() {
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


var preferences = function() {

    function PreferencesDialog(preferenceRepository) {
	this.filePathField = $('input[name="file-path"]');
	this.apiKeyField = $('input[name="api-key"]');
	this.apiSecretField = $('input[name="api-secret"]');

	this.preferenceRepository = preferenceRepository;
	var prefs = this.preferenceRepository.getPreferences();
	this.setValues(prefs);
	this.initEvents();
    }

    PreferencesDialog.prototype.initEvents = function() {
	var saveButton = $('input[name="save-prefs"]')
	addStreams(['input[name="file-path"]', 'input[name="api-key"]', 'input[name="api-secret"]']);
	var that = this;
	saveButton.bind('click', function(evt) { that.saveAndShowList(); });
	function addStreams(fieldSelectors) {
	    var fieldEmptyProps = _.map(fieldSelectors, function(selector) {
		return Bacon.$.textFieldValue($(selector)).map(isEmpty)
	    });
	    Bacon.combineAsArray.apply(null, fieldEmptyProps)
	     	.map(_.some)
	     	.onValue(saveButton, "attr", "disabled");
	}
	function isEmpty(val) { return val.length === 0; }
    }

    PreferencesDialog.prototype.saveAndShowList = function() {
	logger.log("saving preferences...");
	this.save();
	app.masterPasswordDialog.show();
	logger.log("saved");
    }

    PreferencesDialog.prototype.save = function() {
	var prefs = new Preferences();
	prefs.setDropboxPath(this.filePathField.val());
	prefs.setDropboxApiSecret(this.apiSecretField.val());
	prefs.setDropboxApiKey(this.apiKeyField.val());
	this.preferenceRepository.storePreferences(prefs);
    }

    PreferencesDialog.prototype.setValues = function(prefs) {
	this.filePathField.val(prefs.getDropboxPath());
	this.apiKeyField.val(prefs.getDropboxApiKey());
	this.apiSecretField.val(prefs.getDropboxApiSecret());
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

    Preferences.prototype.setDropboxApiKey = function(apiKey) {
	this.loginDetails.details.key = apiKey;
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


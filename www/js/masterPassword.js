var masterPassword = function() {
    var password = null;

    function MasterPasswordDialog() {
	initOk();
	initGoToPreferences();
    }

    MasterPasswordDialog.prototype.show = function(message) {
	var messageToShow = message || "";
	$('.master-password-message').text(messageToShow);
	ui.showView('ui-master-password');
    }

    function getPassword() { return password; }
    function hasPassword() { return password !== null; }

    function initGoToPreferences() {
	$("input[name='master-password-go-to-prefs']").bind('click', function() {
	    app.preferencesDialog.show();
	});
    }

    function initOk() {
	var passwordFieldSelector = '.master-password';
	var okSelector = "input[name='master-password-ok']";
	Bacon.$
	    .textFieldValue($(passwordFieldSelector))
	    .map(function(val) { return val.length === 0; })
	    .onValue($(okSelector), "attr", "disabled");

	$(okSelector).bind('click', function(evt) {
	    password = $(passwordFieldSelector).val();
	    app.theListView.fetchAndShowCredentials(); //Just go back to the main view for now
	});
    }

    return { MasterPasswordDialog: MasterPasswordDialog,
	     getPassword: getPassword,
	     hasPassword: hasPassword };

}();

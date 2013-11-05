var masterPassword = function() {
    var password = null;

    function MasterPasswordDialog() {
	var passwordFieldSelector = '.master-password';
	var buttonSelector = "input[value='Ok']";
	Bacon.$
	    .textFieldValue($(passwordFieldSelector))
	    .map(function(val) { return val.length === 0; })
	    .onValue($(buttonSelector), "attr", "disabled");

	$(buttonSelector).bind('click', function(evt) { 
	    password = $(passwordFieldSelector).val();
	    app.theListView.fetchAndShowCredentials(); //Just go back to the main view for now
	});;
    }
    
    MasterPasswordDialog.prototype.show = function(message) {
	var messageToShow = message || "";
	$('.master-password-message').text(messageToShow);
	ui.showView('ui-master-password');
    }

    function getPassword() { return password; }
    function hasPassword() { return password !== null; }

    return { MasterPasswordDialog: MasterPasswordDialog,
	     getPassword: getPassword,
	     hasPassword: hasPassword };
}();

var editView = function() {
    function populate(credentials, site) {
	unhide();
	var credItem = _.find(credentials, function(credItem) { return credItem.site === site });
	setValues(credItem);
    }

    function setValues(credItem) {
	$('.creditem-site').val(credItem.site);
	$('.creditem-site').keyup();
	$('.creditem-description').val(credItem.description);
	$('.creditem-user').val(credItem.userName);
	$('.creditem-password').val(credItem.sitePassword);	
    }

    function close() {
	hide();
	app.theListView.fetchAndShowCredentials();
    }

    function unhide() {  
	ui.showView('ui-edit');
    }

    function hide() { $('.ui-edit').hide(); }

    function EditView(credentialRepository) {
	this.credentialRepository = credentialRepository;
	$( "input[value='X']" ).bind('click', function(evt) { close(); });

	Bacon.$
	    .textFieldValue($(".creditem-site"))
	    .map(function(val) { return val.length === 0; })
	    .onValue($("input[name='save-creds']"), "attr", "disabled")
	this.initSave();
    }
    
    EditView.prototype.show = function(site) {
	ui.showAjaxLoader();
	var that = this;
	function ok(credentialList) {
	    populate(credentialList, site);
	}
	function fail(reason, code) {
	    ui.hideAjaxLoader();
	    alert("Failed to get credentials. Reason: " + reason + " code: " + code);
	}
	this.credentialRepository.getCredentialList(masterPassword.getPassword(), ok, fail);
    }

    EditView.prototype.new = function() {
	unhide();
	setValues({site: "", description: "", userName: "", sitePassword: ""});
    }
    
    EditView.prototype.save = function() {
	var site = $('.creditem-site').val();
	var description = $('.creditem-description').val();
	var user = $('.creditem-user').val();
	var password = $('.creditem-password').val();

	logger.log("SAVING");
	logger.log(site);
	logger.log(user);
	logger.log(password);
	
	hide();
	ui.showAjaxLoader();

	//first fetch, modify or add the new/existing cred and store it
	this.credentialRepository.getCredentialList(
	    masterPassword.getPassword(),
	    freshCredentialListCallback.bind(this),
	    function(errorReason, errorCode) {
		if (code === credentials.errorCodes.DECRYPT_ERROR) {
		    app.masterPasswordDialog.show("Invalid password");
		} else {
		    alert("Failed to get credentials. Reason: " + reason + " code: " + code);
		}
		unhide();
	    });

	function freshCredentialListCallback(credentialList) {
	    var itemToStore = _.find(credentialList, function(credItem) { return credItem.site === site; })
	    if (!itemToStore) {
		itemToStore = { site: site };
		credentialList.push(itemToStore);
	    }
	    itemToStore.description = description;
	    itemToStore.userName = user;
	    itemToStore.sitePassword = password;
	    if (!masterPassword.hasPassword()) {
		app.masterPasswordDialog.show();
		return;
	    }
	    this.credentialRepository.saveCredentialList(
		credentialList,
		masterPassword.getPassword(), 
		function() { unhide(); },
		function() { alert("saving failed!"); unhide(); } );	    
	}
    }

    EditView.prototype.initSave = function() {
	var that = this;
	$( "input[name='save-creds']" ).bind('click', function(evt) { that.save(); });
    }

    return { EditView: EditView }
}();

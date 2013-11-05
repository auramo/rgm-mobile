var listView = function() {
    function ListView(credentialRepository) {
	this.credentialRepository = credentialRepository;
	this.disableSplash();
	this.initRowStream();
	this.initNewStream();	
    }

    ListView.prototype.initRowStream = function() {
	var that = this;
	$(".credential-table")
            .asEventStream("click")
            .onValue(function(event) { 
		var row = $(event.target).closest('tr');
		var site = row.attr('data-id');
		app.theEditView.show(site);
            });
    }

    ListView.prototype.initNewStream = function() {
	var that = this;
	$( "input[value='New']")
	.asEventStream("click")
	.onValue(function() {
	    app.theEditView.new();
	});
    }

    ListView.prototype.fetchAndShowCredentials = function() {
	ui.showAjaxLoader();
	var that = this;
	function ok(credentialList) {
	    that.populateCredentialView(credentialList);
	    that.showCredentialView();
	}
	//TODO in here we would switch to master password view if we get credentials.errorCodes.DECRYPT_ERROR
	function fail(reason, code) {
	    logger.log("fail reason:");
	    logger.log(reason);
	    logger.log("fail code:");
	    logger.log(code);
	    if (code === credentials.errorCodes.DECRYPT_ERROR) {
		app.masterPasswordDialog.show("Invalid password");
	    } else {
		alert("Failed to get credentials. Reason: " + reason + " code: " + code);
	    }
	}
	this.credentialRepository.getCredentialList(masterPassword.getPassword(), ok, fail);
    }

    ListView.prototype.disableSplash = function() { $('.splash').hide() }

    ListView.prototype.showCredentialView = function() { logger.log("showCredentialView"); ui.showView('ui-content'); }

    ListView.prototype.hideCredentialView = function() { $('.ui-content').hide(); }

    ListView.prototype.populateCredentialView = function(credentialList) { 
	var contentRowObjects = _.map(credentialList, function(credItem) {
	    var rowObject = $('<tr class="credential-row"><td></td><td></td></tr>')
		.attr('data-id', credItem.site)
		.find('td')
		.first()
		.text(credItem.site)
		.end()
		.end()
		.find('td:eq(1)')
		.text(credItem.description)
		.end();
	    return rowObject;
	});
	var tableBody = $('<tbody class="credential-table-content">');
	_.each(contentRowObjects, function(rowObject) {
	   tableBody.append(rowObject); 
	});
	$('.credential-table-content').replaceWith(tableBody);
    }

    return { ListView: ListView }
}();

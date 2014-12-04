var listView = function() {
    function ListView(credentialRepository) {
        this.credentialRepository = credentialRepository;
        this.disableSplash();
        this.initSearchStream();
        this.initRowStream();
        this.initNewStream();
    }

    ListView.prototype.initSearchStream = function() {
        Bacon.$.textFieldValue($('.search-credentials')).debounce(400).onValue(function(searchStr) {
            searchStr = searchStr.toLowerCase();
            var rows = $('.credential-row')
            if (_.isEmpty(searchStr.trim())) {
                rows.show()
            } else {
                rows.filter(function() { return matchesSearch(searchStr, this); }).show()
                rows.filter(function() { return !matchesSearch(searchStr, this); }).hide()
            }
        });
        function matchesSearch(searchStr, row) {
            return _.contains($(row).attr('data-id').toLowerCase(), searchStr)
        }
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

    ListView.prototype.showCredentialView = function() {
        logger.log("showCredentialView");
        ui.showView('ui-content');
        $('.search-credentials').val('');
    }

    ListView.prototype.hideCredentialView = function() { $('.ui-content').hide(); }

    ListView.prototype.populateCredentialView = function(credentialList) { 
	var sortedCredList = _.sortBy(credentialList, function(credItem) { return credItem.site.toLowerCase() } );
	var contentRowObjects = _.map(sortedCredList, function(credItem) {
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

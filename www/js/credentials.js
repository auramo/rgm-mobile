var credentials = (function() {
    
    var LOGIN_DETAIL_KEY = "rgm.login.loginDetails";
    var GENERAL_PREFERENCE_KEY = "rgm.preferences";
    
    var errorCodes = { DECRYPT_ERROR: -42 };

    function Credentials(site, description, userName, sitePassword) {
	this.site = site;
	this.description = description;
	this.userName = userName;
	this.sitePassword = sitePassword;
    }

    function DecryptException(message) { this.message = message; }
    DecryptException.prototype = { toString: function() { return "DecryptException: " + this.message; } }

    function CredentialRepository() {
	this.dropboxPath = "rgm-testing.dat";
	this.loginDetailRepository = new RgmLoginDetailRepository();
    }

    CredentialRepository.prototype.getDropboxPath = function () {
	return this.dropboxPath;
    }

    CredentialRepository.prototype.saveCredentialList = function(credentialList, masterPassword, successCallback, errorCallback) {
	var json = this.toJson(credentialList);
	var encrypted = this.encrypt(json, masterPassword);
	this.saveToDropbox(encrypted, successCallback, errorCallback);
    }

    CredentialRepository.prototype.getCredentialList = function(masterPassword, successCallback, errorCallback) {
	this.readFromDropbox(decryptAndConvert.bind(this), errorCallback);
	var that = this;
	function decryptAndConvert(data) {
	    try {
		var decrypted = this.decrypt(data, masterPassword);
		var credentialObjectList = that.fromJson(decrypted);
		successCallback(credentialObjectList);
	    } catch (e) {
		logger.log("Caught error while decrypting: " + e.toString());
		errorCallback(e.toString(), errorCodes.DECRYPT_ERROR);
	    }
	}
    }

    CredentialRepository.prototype.readFromDropbox = function(successCallback, errorCallback) {
	var that = this;
	this.executeDropboxAction(readFileFromDropbox, errorCallback);
	function readFileFromDropbox(client) {
	    client.readFile(that.getDropboxPath(), function(error, data) {
		if (error) {
		    if (error.status === Dropbox.ApiError.INVALID_TOKEN) {
			logger.log("Got invalid token, invalidating old session");
			var loginDetails = that.loginDetailRepository.getStoredLoginDetails();
			loginDetails.validate();
			loginDetails.invalidateSession();
			that.loginDetailRepository.storeLoginDetails(loginDetails);
			that.readFromDropbox(successCallback, errorCallback);
		    } else {
			errorCallback("Error while trying to read credentials from dropbox: " + error.toString(), error.status);
		    }
		} else {
		    successCallback(data);
		}
	    });
        }
    }

    CredentialRepository.prototype.decrypt = function(data, masterPassword) {
	data = data.replace(/(\r\n|\n|\r)/gm,"");
	try {
	    var dec = CryptoJS.AES.decrypt(data, masterPassword);
	    var plaintext = dec.toString(CryptoJS.enc.Utf8);
	    return plaintext;
	} catch (e) {
	    throw new DecryptException(e.message);
	}
    }

    CredentialRepository.prototype.encrypt = function(data, masterPassword) {
	var encryptedBase64 = CryptoJS.AES.encrypt(data, masterPassword);
	var encryptedBase64WithLineBreaks = this.addNewlines(encryptedBase64.toString());
	return encryptedBase64WithLineBreaks;
    }

    CredentialRepository.prototype.saveToDropbox = function(data, successCallback, errorCallback) {
	var that = this;
	this.executeDropboxAction(saveFileToDropbox.bind(this), errorCallback);
	function saveFileToDropbox(client) {
	    client.writeFile(that.getDropboxPath(), data, function(error, stat) {
		if (error) {
		    errorCallback("Error while trying to store credentials to dropbox: " + error.toString(), error.status);
		} else {
		    successCallback();
		}
	    });	
	}
    }

    CredentialRepository.prototype.executeDropboxAction = function(action, errorCallback) {
	var loginDetails = this.loginDetailRepository.getStoredLoginDetails();
	logger.log("Logging into Dropbox with details");
	logger.log(JSON.stringify(loginDetails.details));
	var client = new Dropbox.Client(loginDetails.details);
	var that = this;
	client.authenticate(function(error, client) {
	    if (error) {
		errorCallback("Error while trying to do a dropbox action: " + error.toString(), error.status);
	    } else {

		//debug
		logger.log("Client credentials");
		logger.log(client.credentials());
		logger.log("Access Token:");
		logger.log(client.credentials().token);
		logger.log("uid:");
		logger.log(client.credentials().uid);
		loginDetails.details.token = client.credentials().token;
		loginDetails.details.uid = client.credentials().uid;
		that.loginDetailRepository.storeLoginDetails(loginDetails);
		logger.log("Stored session");
		//end of debug
		action(client);
	    }
	});
    }

    CredentialRepository.prototype.toJson = function(credentialList) {
	var resultObj = {}
	_.forEach(credentialList, function(creds) {
	    resultObj[creds.site] = [creds.description, creds.userName, creds.sitePassword];
	});
	return JSON.stringify(resultObj);
    }

    CredentialRepository.prototype.fromJson = function(json) {
	var parsed = JSON.parse(json);
	var credentialList = [];
	for (var site in parsed) {
	    if(parsed.hasOwnProperty(site)) {
		var siteArray = parsed[site];
		credentialList.push(new Credentials(site, siteArray[0], siteArray[1], siteArray[2]));
	    }
	}	
	return credentialList;
    }

    CredentialRepository.prototype.addNewlines = function(str) {
	var result = '';
	while (str.length > 0) {
	    result += str.substring(0, 64) + '\n';
	    str = str.substring(64);
	}
	return result;
    }

    function RgmLoginDetails(details) { 
	this.details = details; 
    }
    RgmLoginDetails.prototype.validate = function() {
	if (!hasMinimumDetails()) {
	    var errMsg = "Dropbox api key and secret (" + LOGIN_DETAIL_KEY + ".key" + " and " + LOGIN_DETAIL_KEY + ".secret) must be defined, DropBox login requires them";
	    alert(errMsg);
	    throw new Error(errMsg);	    
	}
    }
    RgmLoginDetails.prototype.hasMinimumDetails = function () {
	return _.isEmpty(this.details.key) || _.isEmpty(this.details.secret);
    }
    RgmLoginDetails.prototype.hasToken = function() {
	return typeof this.details.token !== "undefined"  && this.details.accessToken !== null;
    }
    RgmLoginDetails.prototype.hasUid = function() {
	return typeof this.details.uid !== "undefined"  && this.details.uid !== null;
    }
    RgmLoginDetails.prototype.canLoginWithoutInteraction = function() {
	return this.hasToken() && this.hasUid();
    }
    //Resets token and uid
    RgmLoginDetails.prototype.invalidateSession = function() {
	this.details = _.omit(this.details, "token", "uid")
    }


    function RgmLoginDetailRepository() {}
    RgmLoginDetailRepository.prototype.getStoredLoginDetails = function() {
	var details = window.localStorage.getItem(LOGIN_DETAIL_KEY);
	if (_.isEmpty(details)) {
	    details = {}
	} else {
	    details = JSON.parse(details);
	}
	//Get/create these at this site: https://www.dropbox.com/developers 
	//details.key = "my key";
	//details.secret = "my secret";


	var loginDetails = new RgmLoginDetails(details);
	return loginDetails;
    }
    RgmLoginDetailRepository.prototype.storeLoginDetails = function(loginDetails) {
	logger.log("Storing login details to local storage");
	logger.log(this.KEY);
	logger.log(JSON.stringify(loginDetails.details));
	window.localStorage.setItem(this.KEY, JSON.stringify(loginDetails.details))
    }

    //Decryption Can be tested with this: openssl enc -d -aes-256-cbc -a -in rgm-testing.dat -pass "pass:my password"

    return {
	CredentialRepository: CredentialRepository,
	Credentials: Credentials,
	RgmLoginDetails: RgmLoginDetails,
	RgmLoginDetailRepository: RgmLoginDetailRepository,
	errorCodes: errorCodes,
	GENERAL_PREFERENCE_KEY: GENERAL_PREFERENCE_KEY
    };
})();

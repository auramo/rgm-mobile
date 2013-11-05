var logger = (function() {
    var prefix = "RGM_MOBILE"
    return {
	log: function(message) {
	    if (typeof console === "object" && typeof console.log === "function") {
		console.log(prefix, message);
	    }
	}
    }
})();

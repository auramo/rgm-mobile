describe("Login details", function() {

  beforeEach(function(){
      clearStoredLoginDetails();
  })

  describe("Check that storing login details to local storage works", function() {
    it("Stores login details", function() {
	var details = new credentials.RgmLoginDetails({token: "x", uid: "y"});
	var repo = new credentials.RgmLoginDetailRepository();
	repo.storeLoginDetails(details);
	var stored = repo.getStoredLoginDetails()

	assert(stored.details.token === "x");
	assert(stored.details.uid === "y");
	assert(stored.canLoginWithoutInteraction());

	clearStoredLoginDetails();
	stored = repo.getStoredLoginDetails()
	console.log("stored in spec");
	console.log(stored);
	assert(stored.details.token === undefined);
	assert(stored.canLoginWithoutInteraction() === false);
    });
  });

 describe("LoginDetails object", function() {
     it("invalidates session", function() {
	 var details = new credentials.RgmLoginDetails({token: "x", uid: "y"});
	 details.invalidateSession();
	 assert(_.isUndefined(details.details.token))
	 assert(_.isUndefined(details.details.uid))
     });
 });

 function clearStoredLoginDetails() {
     window.localStorage.removeItem(new credentials.RgmLoginDetailRepository().KEY)
 }
});

(function() {
	"use strict";
	(function sendInviteLetter($) {
		const ssAppAuth = firebase.auth(ssl),
			ssAppDatabase = firebase.database(ssl);


		const sendInviteBtn = document.getElementById('invite-btn');


		console.log(ssAppAuth, ssAppDatabase);


	}(jQuery));

}());
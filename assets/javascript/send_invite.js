(function() {
	"use strict";
	(function sendInviteLetter($) {
		const ssAppAuth = firebase.auth(ssl),
			ssAppDatabase = firebase.database(ssl);

		const sendInviteBtn = document.getElementById('invite-btn');

		// so the key links packaging info is to add them as a string after #
		// then for the invite login, I can use a simple function to parse the data and set the user 
		// to the correct group
		// given that group names may contain spaces 
		// a function is needed to replace space with underscore, which is exactly how the parse function will do
		const thisIsTheGroupNameAssociatedToUser = "Tim's Santa Game".replace(/\s/g, "_");

		console.log(ssAppAuth, ssAppDatabase);
		sendInviteBtn.onclick = function(event) {
			event.preventDefault();
			const email = $('#user-email').val(),
				url = 'http://localhost:8000/index.html#' + thisIsTheGroupNameAssociatedToUser,
				// url = 'https%3A%2F%2Fwww.google.com%0A',
				emailContent = "Hi,%0D%0A%0D%0APlease join us on Secret Santa for a game of fun and mystery!!%0D%0A%0D%0Aclick on the link below to join us:%0D%0A" + url + "%0D%0A%0D%0Acheers!!"
				console.log(url);
				console.log(emailContent);

			window.open("mailto:"+ email +"?subject="+"Cool Secret Santa Game"+"&body="+ emailContent);
		};

	}(jQuery));

}());
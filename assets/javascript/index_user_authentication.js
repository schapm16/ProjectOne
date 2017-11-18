(function() {
	"use strict";

	function initializingFireBase() {
		//initialize firebase
		const config = {
			apiKey: "AIzaSyDcO3BpfmGShgWNYjE-b-Wax18ZudRS9fk",
			authDomain: "secret-santa-project.firebaseapp.com",
			databaseURL: "https://secret-santa-project.firebaseio.com",
			projectId: "secret-santa-project",
			storageBucket: "secret-santa-project.appspot.com",
			messagingSenderId: "889146133810"
		};

		firebase.initializeApp(config, "ssl");
		const ssl = firebase.app("ssl");
			return firebase.auth(ssl);
	}

	// main function handling user authentication
	(function userAuthentication($) {

		// get buttons
		const loginBtn = document.getElementById('loginButton'),
			signupBtn = document.getElementById('registerButton');

		// secretsantaAppAuth = firebase.auth();
		const ssAppAuth = initializingFireBase();

		function pageRedirect(url) {
			window.location.assign(url);
		}

		function errorHandler() {

		}

		// sign in with verified email
		loginBtn.onclick = function(event) {
			const email = $('#loginEmail').val(),
				password = $('#loginPassword').val();

			// here goes input validation code


			// if validate
			ssAppAuth.signInWithEmailAndPassword(email, password)
				.then(function(user) {

					console.log('User signed in.', user.uid);




					pageRedirect('/group.html');
				}).catch(function(error) {
					console.log('Error:  ' + error.code + ' ' + error.message);

					// refresh page with erorr message indicating erorr type
					pageRedirect(window.location.href + "#" + error.message);
					$('input').val('');
				});




		}; // lgin 




























	}(jQuery));

}());
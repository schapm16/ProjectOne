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

		function userVerificationStateReload() {
			return new Promise(resolve => {
				let reloadInterval = setInterval(function() {
					ssAppAuth.currentUser.reload();
					console.log(ssAppAuth.currentUser.emailVerified);
					console.log('It\'s been awhile I\'m gonna ping them again');
					
					if (ssAppAuth.currentUser.emailVerified) {
						console.log('it\'s true then');
						resolve(reloadInterval);
					}
				}, Math.floor(Math.random() * 6) * 1000);

				// if no emailVerified state change in 5 min reject and reload the page
				setTimeout(function() {
					throw new Error('No response after 5 min...');
					reject();
				}, 30000);
			})
		}


		// sign in with verified email
		loginBtn.onclick = function(event) {
			// perhaps instead of using button, a input[type="submit"] might be better
			// because using submit can trigger onclick event when user press enter

			const email = $('#loginEmail').val(),
				password = $('#loginPassword').val();

			// here goes input validation 

			// if validate
			ssAppAuth.signInWithEmailAndPassword(email, password)
				.then(function(user) {

					console.log('User signed in.', user.uid);

					pageRedirect('/group.html');
				}).catch(function(error) {
					console.log('Error:  ' + error.code + ' ' + error.message);

					// adding error handling rules

					// refresh page with erorr message indicating erorr type		
					pageRedirect(window.location.href + "#" + error.message);
					$('input').val('');
				});
		}; //  


		signupBtn.onclick = function(event) {
			const email = $('#registerEmail').val(),
				password = $('#registerPassword').val(),
				// I add a password confirmation in the modal so that we can prevent user from typo
				passwordConfirmation = $('#passwordConfirm').val(),
				alias = $('#registerAlias').val();


			// here goes input validation


			ssAppAuth.createUserWithEmailAndPassword(email, password)
				.then(function(user) {
					ssAppAuth.currentUser.sendEmailVerification().then(function() {
						alert('Email Verification Sent!');

						ssAppAuth.onAuthStateChanged(function(user) {
							console.log(user);
							userVerificationStateReload()
								.then(function(intervalId) {
									clearInterval(intervalId);
									// the group.html is a placeholder page, which we can put a "Email Confirmed !!" 
									// later into the project
									pageRedirect('/group.html');
									console.log('Email Verified!!');
								}).catch(function(error) {
									console.log(error.message);
									window.location.reload();
								});
						});
						alert('Please confirm your email address before proceed');
					})

				}).catch(function(error) {
					console.log('Error:  ' + error.code + ' ' + error.message);

					// error handling
					pageRedirect(window.location.href + "#" + error.message);
					$('input').val('');
				})

		};

		console.log(ssAppAuth);




	}(jQuery));

}());
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

		// errorHandler process the error caught by firebase
		// and do something about it
		function errorHandler(errorCode) {
			switch (errorCode) {
				case 'auth/email-already-in-use':
					alert('An account with this email address is already registered.');
					break;
				case 'auth/user-not-found':
					alert('User with this address doesn\'t exist');
					break;
				case 'auth/wrong-password':
					alert('The password does not match the sign in address.');
					break;
			}
		}

		// validateInputValue caught error in account signin and registeration before pinging firebase
		// and do something about it
		function validateInputValue(email, password, passwordConfirmation = false) {
			return new Promise(resolve => {
				if (!(email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i))) {
					throw new Error('invalid email input');
					reject();
				}
				if (password.length < 8) {
					throw new Error('password must be at least 8 characters long');
					reject();
				}
				// could add another check for password pattern
				if (!!passwordConfirmation && passwordConfirmation !== password) {
					throw new Error('password unmatch, please confirm your password');
					reject();
				}
				resolve();
			});
		}

		// this function ping firebase user data with interval of 1 to 5 seconds to capture 
		// currentUser.emailVerified update after user verified through the email sent to their address
		// if verified, auto direct user to the main interface
		// if after 5 min no update, throw and exception and reload the signin page
		function emailVerificationStateReload() {
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
					clearInterval(reloadInterval);
					throw new Error('No response after 5 min...');
					reject();
				}, 30000);
			})
		}


		// sign in with verified email
		loginBtn.onclick = function(event) {
			// perhaps instead of using button, an input[type="submit"] might be better
			// because using submit can trigger onclick event when user press enter

			const email = $('#loginEmail').val(),
				password = $('#loginPassword').val();

			// here goes input validation 

			// if validate
			validateInputValue(email, password).then(() => {
				ssAppAuth.signInWithEmailAndPassword(email, password).then(function(user) {
					console.log('User signed in.', user.uid);

					pageRedirect('/group.html');
				}).catch(function(error) {
					console.log('Error:  ' + error.code + ' ' + error.message);
					errorHandler(error.code);

					// adding error handling rules

					// refresh page with erorr message indicating erorr type		
					pageRedirect(window.location.href + "#" + error.message);
					$('input').val('');
				});
			}).catch((error) => {
				alert(error.message);
			})
		}; //  


		signupBtn.onclick = function(event) {
			const email = $('#registerEmail').val(),
				password = $('#registerPassword').val(),
				// I add a password confirmation in the modal so that we can prevent user from typo
				passwordConfirmation = $('#passwordConfirm').val(),
				alias = $('#registerAlias').val();

			// here goes input validation
			validateInputValue(email, password, passwordConfirmation).then(() => {
				ssAppAuth.createUserWithEmailAndPassword(email, password).then(function(user) {
					ssAppAuth.currentUser.sendEmailVerification().then(function() {
						alert('Email Verification Sent!');

						ssAppAuth.onAuthStateChanged(function(user) {
							console.log(user);
							emailVerificationStateReload().then(function(intervalId) {
								clearInterval(intervalId);
								// the group.html is a placeholder page, which we can put a "Email Confirmed !!" 
								// later into the project
								console.log('Email Verified!!');
								pageRedirect('/group.html');
							}).catch(function(error) {
								console.log(error.message);
								window.location.reload();
							});
						});
						alert('Please confirm your email address before proceed');
					})
				}).catch(function(error) {
					console.log('Error:  ' + error.code + ' ' + error.message);
					errorHandler(error.code);
					// error handling
					pageRedirect(window.location.href + "#" + error.message);
					$('input').val('');
				})
			}).catch((error) => {
				alert(error.message);
			});
		};



	}(jQuery));

}());
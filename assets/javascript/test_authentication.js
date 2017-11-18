(function() {
	"use strict";
	(function($) {


		// Initialize Firebase

		// const fireBaseRuntime = {
		// 	config: {
		// 		apiKey: "AIzaSyDcO3BpfmGShgWNYjE-b-Wax18ZudRS9fk",
		// 		authDomain: "secret-santa-project.firebaseapp.com",
		// 		databaseURL: "https://secret-santa-project.firebaseio.com",
		// 		projectId: "secret-santa-project",
		// 		storageBucket: "secret-santa-project.appspot.com",
		// 		messagingSenderId: "889146133810"
		// 	},

		// 	init: function (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId) {
		// 		this.config = {
		// 			apiKey: apiKey,
		// 			authDomain: authDomain,
		// 			databaseURL: databaseURL,
		// 			projectId: projectId,
		// 			storageBucket: storageBucket,
		// 			messagingSenderId: messagingSenderId
		// 		};
		// 	},


		// }

		// fireBaseRuntime.init();

		const config = {
			apiKey: "AIzaSyDcO3BpfmGShgWNYjE-b-Wax18ZudRS9fk",
			authDomain: "secret-santa-project.firebaseapp.com",
			databaseURL: "https://secret-santa-project.firebaseio.com",
			projectId: "secret-santa-project",
			storageBucket: "secret-santa-project.appspot.com",
			messagingSenderId: "889146133810"
		};

		// create a list of authentication provider
		let provider = new firebase.auth.GoogleAuthProvider();


		firebase.initializeApp(config, "yssl");
		const yssL = firebase.app("yssl"),
			ssAppRef = firebase.auth(yssL);

		///////////////////////////////////////////////////////////////////////// working on creating an object
		let auth, userRef;
		//////////////////////////////////////////////////////////////////////// test authentication snippets
		const loginBtn = document.getElementById('login-btn'),
			signupBtn = document.getElementById('signup-btn');


		// registering account with our app
		signupBtn.onclick = (e) => {
			e.preventDefault();
			try {
				const email = $('#user-email').val(),
					password = $('#user-password').val(),
					alias = $('#user-alias').val();

				ssAppRef.createUserWithEmailAndPassword(email, password)
					.then(function(user) {

						sendEmailVerification(user);

						console.log("Authenticated successfully with payload:", user);

						auth = user;
						console.log("Successfully created user account with uid:", user.uid);

						firebase.database().ref('/aliases').push(alias);

						//now saving the profile data
						firebase.datbase.ref('/users/' + user.uid)
							.child(user.uid)
							.set(user)
							.then(function() {
								console.log("User Information Saved:", user.uid);
							});

						console.log(userRef);


					}).catch(function(error) {
						// Handle Errors here.
						var errorCode = error.code;
						var errorMessage = error.message;
						alert(error.message);
						// ...
					});
			} catch (err) {
				console.log(err.message);
			}
		};

		loginBtn.onclick = (e) => {
			e.preventDefault();

			try {
				const email = $('#user-email').val(),
					password = $('#user-password').val(),
					alias = $('#user-alias').val();

				ssAppRef.signInWithEmailAndPassword(email, password)
					.then(function(user) {
						//now user is needed to be logged in to save data
						console.log("User successfully signed in with payload:", user);

						if (user.uid) {
							console.log('User signed in.', user.uid);
							window.location.replace('/index.html');
						} else {
							alert('failed attempt');
						}

					}).catch(function(error) {
						// Handle Errors here.
						var errorCode = error.code;
						var errorMessage = error.message;
						console.log(error.message);
						// ...
					});
			}
			catch (err) {
				console.log(err.message);
			}


		}






		function sendEmailVerification(user) {
			// [START sendemailverification]
			ssAppRef.currentUser.sendEmailVerification().then(function() {
				// Email Verification sent!
				// [START_EXCLUDE]
				alert('Email Verification Sent!');
				// [END_EXCLUDE]
			});
			// [END sendemailverification]
		}









	}(jQuery));
}());

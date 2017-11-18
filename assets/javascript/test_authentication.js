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

		firebase.initializeApp(config);

		///////////////////////////////////////////////////////////////////////// working on creating an object
		let auth, userRef;
		//////////////////////////////////////////////////////////////////////// test authentication snippets
		const loginBtn = document.getElementById('login-btn'),
			signupBtn =document.getElementById('signupBtn');

		signupBtn.addEventListener('click', (e) => {
			e.preventDefault();
			try {
				const email = $('#user-name').val(),
					password = $('#user-password').val(),
					alias = $('#user-alias').val();

				firebase.auth().createUserWithEmailAndPassword(email, password)
					.then(function(user) {
						//now user is needed to be logged in to save data
						console.log("Authenticated successfully with payload:", user);
						auth = user;
						console.log(auth);
						console.log("Successfully created user account with uid:", user.uid);

						firebase.database().ref('/aliases').push(alias);
						
						//now saving the profile data
						firebase.datbase.ref('/user-login')
							.child(user.uid)
							.set(data)
							.then(function() {
								console.log("User Information Saved:", user.uid);
							});

						console.log(userRef);


					}).catch(function(error) {
						// Handle Errors here.
						var errorCode = error.code;
						var errorMessage = error.message;
						// ...
					});
			} catch (err) {
				console.log(err.message);
			}
		});













	}(jQuery));
}());
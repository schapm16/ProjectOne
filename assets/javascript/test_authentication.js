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

		//////////////////////////////////////////////////////////////////////// test authentication snippets
		const loginBtn = document.getElementById('login-btn');

		loginBtn.addEventListener('click', (e) => {
			e.preventDefault();
			try {
				const email = $('#user-name').val(),
					password = $('#user-password').val();

				firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					// ...
				});
			} catch(err) {
				console.log(err.message);
			}
		});






	}(jQuery));
}());
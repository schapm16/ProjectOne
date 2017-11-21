(function() {
	"use strict";

	(function userAuthentication($) {

		// get buttons
		const loginBtn = document.getElementById("loginButton"),
		signupBtn = document.getElementById("registerButton");

		// secretsantaAppAuth = firebase.auth(ssl);
		// secretsantaAppDatabase = firebase.database(ssl);
		const ssAppAuth = firebase.auth(ssl),
		ssAppDatabase = firebase.database(ssl);

		function pageRedirect(url) {
			window.location.assign(url);
		}

		// errorHandler process the error caught by firebase
		// and do something about it
		function errorHandler(errorCode) {
			switch (errorCode) {
				case "auth/email-already-in-use":
				alert("An account with this email address is already registered.");
				break;
				case "auth/user-not-found":
				alert("User with this address does not exists.");
				break;
				case "auth/wrong-password":
				alert("The password does not match the sign in address.");
				break
				case "auth/network-request-failed":
				alert("Request timeout.");
				break;
					// case ""
				}
			}

		// validateInputValue caught error in account signin and registeration before pinging firebase
		// and do something about it
		function validateInputValue(email, password, passwordConfirmation = false) {
			return new Promise(resolve => {
				// Name and Alias must not be blank or match test

				if (!(email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i))) {
					throw new Error("invalid email input");
					reject();
				}
				if (password.length < 8) {
					throw new Error("password must be at least 8 characters long");
					reject();
				}
				// could add another check for password pattern
				if (!!passwordConfirmation && passwordConfirmation !== password) {
					throw new Error("password unmatch, please confirm your password");
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
				// stored the current user in cache to make sure that the currentUser doesn't change at time of pinging
				const userId = ssAppAuth.currentUser.uid;
				var userProfile = ssAppAuth.currentUser; 
				window.sessionStorage.setItem('userid', ssAppAuth.currentUser.uid);
				window.sessionStorage.setItem('userProfile', userProfile.displayName);
				console.log(sessionStorage.getItem('userid'));

				let reloadInterval = setInterval(function() {
					ssAppAuth.currentUser.reload();
					console.log(ssAppAuth.currentUser.emailVerified);
					console.log("It\'s been awhile I\'m gonna ping them again");

					if (ssAppAuth.currentUser.uid !== userId) {
						throw new Error("The current user online is unfortunately, not you. The page will reload now.");
						reject();
					}

					if (ssAppAuth.currentUser.emailVerified) {
						console.log("it\'s true then");
						resolve(reloadInterval);
					}
				}, Math.floor(Math.random() * 6) * 1000);

				// if no emailVerified state change in 5 min reject and reload the page
				setTimeout(function() {
					clearInterval(reloadInterval);
					throw new Error("No response after 5 min...");
					reject();
				}, 300000);
			})
		}

		//now saving the profile data
		//saving works fine now, if we want to add additional fields to user"s database profile - we can add
		//new property to the object in .set field
		function pushUserInfoToDatabase(user, usrName, usrAlias) {
			ssAppDatabase.ref("/users/" + user.uid)
			.set({
				"Name": usrName,
				"Alias": usrAlias,
				"uniqueId": user.uid
			})
			.then(function() {
				console.log("User Information Saved:", user.uid);
			});
			ssAppAuth.currentUser.updateProfile({
				displayName: usrName +" : " + usrAlias, 
			}).then(function() {
				alert("Display name: " + ssAppAuth.currentUser.displayName);
			});

			
			//temporary adding all new users to the 1 group.
			ssAppDatabase.ref("/groups/" + 0 + "/followers/").push(user.uid);
			ssAppDatabase.ref("/users/"+user.uid+"/groups").set("0")
		}


		// sign in with verified email
		loginBtn.onclick = function(event) {
			// perhaps instead of using button, an input[type="submit"] might be better
			// because using submit can trigger onclick event when user press enter

			const email = $("#loginEmail").val(),
			password = $("#loginPassword").val();

			// input validation
			validateInputValue(email, password).then(() => {

				ssAppAuth.signInWithEmailAndPassword(email, password).then(function(user) {
 					// stop user from signing in before verifing their email
 					if (!(user.emailVerified)) {
 						alert("Please verified your email before proceed.");
 						ssAppAuth.signOut().then(() => {
 							window.location.reload();
 						})
 					}

 					console.log("User signed in.", user.uid);
 					pageRedirect("/group.html");
 				}).catch(function(error) {
 					console.log("Error:  " + error.code + " " + error.message);
 					errorHandler(error.code);

					// refresh page with erorr message indicating erorr type
					pageRedirect(window.location.href + "#" + error.message);
					$("input").val("");
				});
 			}).catch((error) => {
 				alert(error.message);
 			})
 		};

		// register account with email and password
		signupBtn.onclick = function(event) {
			const email = $("#registerEmail").val(),
			password = $("#registerPassword").val(),
				// I add a password confirmation in the modal so that we can prevent user from typo
				passwordConfirmation = $("#registerPasswordConfirm").val(),
				usrName = $("#registerName").val(),
				usrAlias = $("#registerAlias").val();

			// input validation
			validateInputValue(email, password, passwordConfirmation).then(() => {
				ssAppAuth.createUserWithEmailAndPassword(email, password).then(function(user) {
					var actionCodeSettings = {
						url: "httops://secret-santa-project.firebaseapp.com/?email=" + ssAppAuth.currentUser.email,
						handleCodeInApp: false
					};

					ssAppAuth.currentUser.sendEmailVerification().then(function() {
						alert("Email Verification Sent!");

						ssAppAuth.onAuthStateChanged(function(user) {
							console.log(user);
							emailVerificationStateReload().then(function(intervalId) {
								// only store user to database after they verified their email address
								pushUserInfoToDatabase(ssAppAuth.currentUser, usrName, usrAlias);
								clearInterval(intervalId);
								// the group.html is a placeholder page, which we can put a "Email Confirmed !!"
								// later into the project
								console.log("Email Verified!!"); 
								pageRedirect("/group.html");

							}).catch(function(error) {
								console.log(error.message);
								window.location.reload();
							});
						});
						alert("Please confirm your email address before proceed");
					})
				}).catch(function(error) {
					console.log("Error:  " + error.code + " " + error.message);
					errorHandler(error.code);

					// testing, delete user that got created even after exception
					if (!!ssAppAuth.currentUser) {
						ssAppAuth.currentUser.delete();
					}

					pageRedirect(window.location.href + "#" + error.message);
					$("input").val("");
				})
			}).catch((error) => {
				alert(error.message);
			});
		};

	}(jQuery));

}());

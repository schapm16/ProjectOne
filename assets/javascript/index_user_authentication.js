(function() {
	"use strict";

	(function userAuthentication($) {
		// get buttons
		const loginBtn = document.getElementById("loginButton"),
			// startRegisterBtn = document.getElementById("startRegisterButton"),
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
					// alert("An account with this email address is already registered.");
					messageModal("email-already-used");
					break;
				case "auth/user-not-found":
					// alert("User with this address does not exists.");
					messageModal("user-not-found");
					break;
				case "auth/wrong-password":
					// alert("The password does not match the sign in address.");
					messageModal("password-incorrect")
					break;
				case "auth/network-request-failed":
					// alert("Request timeout.");
					break;
			}
		}


		// validateRegisterInput caught error in account signin and registeration before pinging firebase
		// and do something about it
		function validateRegisterInput(userName, alias, email, password, passwordConfirmation) {
			return new Promise(resolve => {
				if (!userName) {
					throw new Error('please give us your name, otherwise no one will know who you are');
				}

				if (!alias) {
					throw new Error('alias is great for hiding who you really are.');
				}

				if (!(email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i))) {
					messageModal("invalid-email");
					throw new Error("invalid email input");
				}

				if (password.length < 8) {
					messageModal("password-length");
					throw new Error("password must be at least 8 characters long");
				}

				// could add another check for password pattern
				if (passwordConfirmation !== password) {
					messageModal("password-match");
					throw new Error("password unmatch, please confirm your password");
				}
				resolve();
			});
		}



		// validateRegisterInput caught error in account signin and registeration before pinging firebase
		// and do something about it
		function validateLoginInput(email, password) {
			return new Promise(resolve => {
				if (!(email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i))) {
					throw new Error("invalid email input");
				}

				if (password.length < 8 && password.length > 0) {
					throw new Error("wrong password!!");
				} else if (password.length <= 0) {
					throw new Error("don't forget to fill your password!!");
				}

				resolve();
			});
		}

		// this function ping firebase user data with interval of 1 to 5 seconds to capture
		// currentUser.emailVerified update after user verified through the email sent to their address
		// if verified, auto direct user to the main interface
		// if after 5 min no update, throw and exception and reload the signin page
		function emailVerificationStateReload() {
			return new Promise((resolve, reject) => {
				// stored the current user in cache to make sure that the currentUser doesn't change at time of pinging
				const userId = ssAppAuth.currentUser.uid;
				let timeOut;

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
				setTimeout((function() {
					clearInterval(reloadInterval);
					reject(new Error("No response after 5 min..."));
				}), 300000)
			})
		}

		//now saving the profile data
		//saving works fine now, if we want to add additional fields to user"s database profile - we can add
		//new property to the object in .set field
		function pushUserInfoToDatabase(user, usrName, usrAlias, groupName = false, joinGroupName = false) {
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
				displayName: usrName + " : " + usrAlias,
			}).then(function() {

				// if the player is not creating new group
				if (!groupName) {
					let playerGroups, userId = user.uid;
					ssAppDatabase.ref("/groups/" + groupName + "/followers/").push(userId);

					ssAppDatabase.ref("/users/" + userId + "/groups").once("value").then((snapshot) => {
						playerGroups = snapshot.val() + "," + joinGroupName;
						ssAppDatabase.ref("/users/" + userId + "/groups").set(joinGroupName);
					});
				} else if (!joinGroupName) {
					let playerGroups, newGroupKey, userId = user.uid;
					newGroupKey = ssAppDatabase.ref("/groups/").push(true).key;
					ssAppDatabase.ref("/groups/GroupsOnline/" + newGroupKey).set(groupName);

					ssAppDatabase.ref("/groups/" + newGroupKey + "/followers/").push(userId);
					ssAppDatabase.ref("/groups/" + newGroupKey + "/groupleader/").push(userId);
					ssAppDatabase.ref("/groups/" + newGroupKey + "/NameOfGroup/").push(groupName);
					ssAppDatabase.ref("/users/" + userId + "/groups").once("value").then((snapshot) => {
						if (snapshot.val()) {
							playerGroups = snapshot.val() + "," + newGroupKey;
						} else {
							playerGroups = newGroupKey;
						}
						ssAppDatabase.ref("/users/" + userId + "/groups").set(playerGroups);
					})
				}
				// alert("Display name: " + ssAppAuth.currentUser.displayName);
				//temporary adding all new users to the 1 group.
				// for group creation
				// new group created is push to groups
				// save group name to groupName  

				// ssAppDatabase.ref("/groups/" + groupName + "/followers/").push(user.uid);
				// ssAppDatabase.ref("/groups/" + groupName + "/groupleader/").push(user.uid);
				// ssAppDatabase.ref("/users/" + user.uid + "/groups").set(groupName);

				// for testing purpose only
				// ssAppDatabase.ref("/groups/" + 0 + "/followers/").push(user.uid);
				// ssAppDatabase.ref("/users/" + user.uid + "/groups").set("0");
			});
		}


		// sign in with verified email
		loginBtn.onclick = function(event) {
			// perhaps instead of using button, an input[type="submit"] might be better
			// because using submit can trigger onclick event when user press enter
			const email = $("#loginEmail").val(),
				password = $("#loginPassword").val();

			// input validation
			validateLoginInput(email, password).then(() => {

				ssAppAuth.signInWithEmailAndPassword(email, password).then(function(user) {

					window.sessionStorage.setItem('userid', ssAppAuth.currentUser.uid);
					console.log(sessionStorage.getItem('userid'));
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
					// pageRedirect(window.location.href + "#" + error.message);
					$('#loginPassword').val("");

				});
			}).catch((error) => {
				console.log(error.message);
				$('#loginPassword').val("");
			});
		};

		// register account with email and password
		// since we check the group input to be non-null before opening the modal
		signupBtn.onclick = function(event) {
			const groupName = $('#loginNewGroup').val(),
				joinGroupName = $('#loginJoinGroup').val(),
				// have to figure out a better way to know which of the aboved is filled
				email = $("#registerEmail").val(),
				password = $("#registerPassword").val(),
				passwordConfirmation = $("#registerPasswordConfirm").val(),
				usrName = $("#registerName").val(),
				usrAlias = $("#registerAlias").val();

			// input validation
			validateRegisterInput(usrName, usrAlias, email, password, passwordConfirmation).then(() => {
				ssAppAuth.createUserWithEmailAndPassword(email, password).then(function(user) {
					var actionCodeSettings = {
						url: "https://secret-santa-project.firebaseapp.com/?email=" + ssAppAuth.currentUser.email,
						handleCodeInApp: false
					};

					ssAppAuth.currentUser.sendEmailVerification().then(function() {
						alert("Email Verification Sent!");

						ssAppAuth.onAuthStateChanged(function(user) {
							console.log(user);

							// check if the user is joining or creating a group
							if (!!groupName) {
								pushUserInfoToDatabase(ssAppAuth.currentUser, usrName, usrAlias, groupName);
							} else {
								pushUserInfoToDatabase(ssAppAuth.currentUser, usrName, usrAlias, false, joinGroupName);
							}

							emailVerificationStateReload().then(function(intervalId) {
								window.sessionStorage.setItem('userid', ssAppAuth.currentUser.uid);
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
					})
				}).catch(function(error) {
					console.log("Error:  " + error.code + " " + error.message);
					errorHandler(error.code);

					// testing, delete user that got created even after exception
					if (!!ssAppAuth.currentUser) {
						ssAppAuth.currentUser.delete();
					}

					$("#registerPassword").val("");
					$("#registerPasswordConfirm").val("");
				})
			}).catch((error) => {
				console.log('This is where I caught user info input error');
				console.log(error.message);
			});
		};

	}(jQuery));

}());
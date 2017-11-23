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

		function redirectAndStoreUserToSession(url, userId, consoleMessage) {
			window.sessionStorage.setItem('userid', userId);
			console.log(consoleMessage);
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
					messageModal("password-incorrect");
					break;
				case "auth/network-request-failed":
					// alert("Request timeout.");
					break;
			}
		}

		// and do something about it
		function validateRegisterInput(userName, alias, email, password, passwordConfirmation) {
			return new Promise(resolve => {
				if (!userName) {
					// messageModal("name-blank");
					throw new Error("name-blank");
				}

				if (!alias) {
					// messageModal("alias-blank");
					throw new Error("alias-blank");
				}

				if (!(email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i))) {
					// messageModal("invalid-email");
					throw new Error("invalid-email");
				}

				if (password.length < 8) {
					// messageModal("password-length");
					throw new Error("password-length");
				}

				// could add another check for password pattern
				if (passwordConfirmation !== password) {
					// messageModal("password-mismatch");
					throw new Error("password-mismatch");
				}
				resolve();
			});
		}

		// validateRegisterInput caught error in account signin and registeration before pinging firebase
		// and do something about it
		function validateLoginInput(email, password) {
			return new Promise(resolve => {
				if (!(email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i))) {
					// messageModal("invalid-email");
					throw new Error("invalid-email");
				} else if (password.length <= 0) {
					// messageModal("password-blank");
					throw new Error("password-blank");
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
				let reloadInterval = setInterval(function() {
					ssAppAuth.currentUser.reload();
					console.log(ssAppAuth.currentUser.emailVerified);
					console.log("It\'s been awhile I\'m gonna ping them again");

					if (ssAppAuth.currentUser.uid !== userId) {
						throw new Error("The current user online is unfortunately, not you. The page will reload now.");
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

		// need to be promise
		function pushUserInfoToDatabase(user, usrName, usrAlias, groupName = false, joinGroupName = false) {
			return new Promise((resolve, reject) => {
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
					logPlayerToGroup(user, groupName, joinGroupName).then(() => {
						resolve();
					}).catch((error) => {
						reject(error);
					})
				});
			})
		}

		// still have uncaught
		function userJoinOrCreateNewGroup(user, groupName = false, joinGroupName = false) {
			return new Promise((resolve, reject) => {
				if (!!groupName && !!joinGroupName) {
					// messageModal("create-join-both");
					throw new Error("create-join-both");
				}
				logPlayerToGroup(user, groupName, joinGroupName).then(() => {
					resolve();
				}).catch((error) => {
					reject(error);
				})
			})
		}

		// all errors caught!! 
		// this is a helper function to reduce repetition	
		function logPlayerToGroup(user, groupName, joinGroupName) {
			// helper function check if player already join the group before setting it to group
			function setPlayerGroups(snapshot, groupKey, userId) {
				let playerGroups, notJoined = false,
					groupString = snapshot.val();
				if (!!groupString) {
					const groupArray = groupString.split(",");
					if (groupArray.indexOf(groupKey) !== -1) {
						playerGroups = groupString;
						return notJoined;
					}
					playerGroups = groupString + "," + groupKey;
				} else {
					playerGroups = groupKey;
				}
				notJoined = true;
				ssAppDatabase.ref("/users/" + userId + "/groups").set(playerGroups);
				return notJoined;
			}

			return new Promise((resolve, reject) => {
				if (!groupName) {
					let playerGroups, groupKey, userId = user.uid;
					ssAppDatabase.ref("/groups/GroupsOnline/").once("value").then((snapshot) => {
						Object.getOwnPropertyNames(snapshot.val()).forEach(function(elem) {
							if (snapshot.child(elem).val() === joinGroupName) {
								groupKey = elem;
							}
						});

						// check if the group name exist
						if (!groupKey) {
							reject(new Error("group-name-mismatch"));
						}

						// check if the group is still open
						ssAppDatabase.ref("/groups/" + groupKey + "/FollowersTest").once("value").then((snap) => {
							console.log(snap);
							console.log(snap.val());
							if (!snap.val()) {
								ssAppDatabase.ref("/users/" + userId + "/groups").once("value").then((snapshot) => {
									const notJoined = setPlayerGroups(snapshot, groupKey, userId);
									notJoined && ssAppDatabase.ref("/groups/" + groupKey + "/followers/").push(userId);
									messageModal("group-already-joined");
									setTimeout(() => {
										resolve();
									}, 3000);
								});
							} else {
								reject(new Error("group-join-unavailable"));
							}
						})
					});
				} else if (!joinGroupName) {
					let playerGroups, newGroupKey, groupNameExist = false,
						userId = user.uid;
					ssAppDatabase.ref("/groups/GroupsOnline/").once("value").then((snapshot) => {

						Object.values(snapshot.val()).forEach((elem) => {
							console.log(elem);
							groupName === elem && (groupNameExist = true);
						});

						if (groupNameExist) {
							reject(new Error("groupname-repeated"));
						} else {
							newGroupKey = ssAppDatabase.ref("/groups/").push(true).key;
							ssAppDatabase.ref("/groups/GroupsOnline/" + newGroupKey).set(groupName);

							ssAppDatabase.ref("/users/" + userId + "/groups").once("value").then((snapshot) => {
								setPlayerGroups(snapshot, newGroupKey, userId);
								ssAppDatabase.ref("/groups/" + newGroupKey + "/followers/").push(userId);
								ssAppDatabase.ref("/groups/" + newGroupKey + "/groupleader/").set(userId);
								ssAppDatabase.ref("/groups/" + newGroupKey + "/NameOfGroup/").set(groupName);
								resolve();
							});
						}
					})
				}
			})
		}

		// sign in with verified email
		loginBtn.onclick = function(event) {
			const groupName = $('#loginNewGroup').val(),
				joinGroupName = $('#loginJoinGroup').val(),
				email = $("#loginEmail").val(),
				password = $("#loginPassword").val();

			// input validation
			validateLoginInput(email, password).then(() => {
				ssAppAuth.signInWithEmailAndPassword(email, password).then(function(user) {
					var actionCodeSettings = {
						url: "https://secret-santa-project.firebaseapp.com/?email=" + ssAppAuth.currentUser.email,
						handleCodeInApp: false
					};
					// stop user from signing in before verifing their email
					if (!(user.emailVerified)) {
						// alert("Please verified your email before proceed.");
						messageModal("email-not-verified");
						ssAppAuth.currentUser.sendEmailVerification().then(() => {
							// messageModal("email-verification-sent");
							$('#loginPassword').val("");
							// window.location.reload();
							ssAppAuth.signOut();
						});
					} else {
						if (!!groupName || !!joinGroupName) {
							userJoinOrCreateNewGroup(user, groupName, joinGroupName).then(() => {
								redirectAndStoreUserToSession("group.html", ssAppAuth.currentUser.uid, "User signed in.", user.uid);
							}).catch((error) => {
								console.log(error);
								messageModal(error.message);
								$('#loginPassword').val("");
							});
						} else {
							redirectAndStoreUserToSession("group.html", ssAppAuth.currentUser.uid, "User signed in.", user.uid);
						}
					}
				}).catch(function(error) {
					console.log("Error:  " + error.code + " " + error.message);
					errorHandler(error.code);
					$('#loginPassword').val("");
				});
			}).catch((error) => {
				messageModal(error.message);
				console.log(error);
				$('#loginPassword').val("");
			});
		};


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
						console.log("Email Verification Sent!");
						messageModal("email-verification-sent");
						ssAppAuth.onAuthStateChanged(function(user) {
							$("#registerButton").prop("disabled", true); // once registered prevent multiple input bug
							console.log(user);

							// for precaution, turn one one of the groupname argument to false						
							pushUserInfoToDatabase(ssAppAuth.currentUser, usrName, usrAlias, groupName, joinGroupName).then(() => {
								emailVerificationStateReload().then(function(intervalId) {
									clearInterval(intervalId);
									redirectAndStoreUserToSession("group.html", ssAppAuth.currentUser.uid, "Email Verified!!");
								}).catch(function(error) {
									console.log(error.message);
									window.location.reload();
								});
							}).catch((error) => {
								console.log(error);
								messageModal(error.message);
								$('#loginPassword').val("");
							});
						});
					})
				}).catch(function(error) {
					console.log("Error:  " + error.code + " " + error.message);
					errorHandler(error.code);
					$("#registerPassword").val("");
					$("#registerPasswordConfirm").val("");
					// // testing, delete user that got created even after exception
					// if (!!ssAppAuth.currentUser) {
					// 	ssAppAuth.currentUser.delete();
					// }
				})
			}).catch((error) => {
				messageModal(error.message);
				console.log(error);
			});
		};
	}(jQuery));

}());
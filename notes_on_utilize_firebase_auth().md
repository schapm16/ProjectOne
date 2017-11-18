# Notes on utilize firebase.auth() method


-- firebase.auth().currentUser >>> return object containing the latest signup ? signin maybe? need some testing

<pre>
	const curUser = firebase.auth().currentUser;

	curUser.displayName; // display name of the sign in user...	
	curUser.email; // curuser@firebasepower.com
	curUser.metadata; // return an object containing info on "lastSignInTime" and "creationTime"...query these two keys will return parsed time 
	curUser.metadata; // "Sat, 18 Nov 2017 00:10:37 GMT"
	curUser.emailVerified; // looks like this is the key to email verifications
	curUser.uid; // query for userId uique to the user

	curUser.providerData; // return and array containing 1 object with key value pair of user id, photo etc...

	firebase.auth().currentUser.providerData.forEach(function (profile) {
	    console.log("Sign-in provider: " + profile.providerId);
	    console.log("  Provider-specific UID: " + profile.uid);
	    console.log("  Name: " + profile.displayName);
	    console.log("  Email: " + profile.email);
	    console.log("  Photo URL: " + profile.photoURL);
  	});

	// Sign-in provider: password
	// Provider-specific UID: tim.jeng@nsysu.edu.org
	// Name: null
	// Email: tim.jeng@nsysu.edu.org
	// Photo URL: null
</pre>


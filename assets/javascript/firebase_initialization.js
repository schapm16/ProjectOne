// intialize firebase in scripts
// project name secret santa
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
	// const ssl = firebase.app("ssl");
	// return firebase.auth(ssl);
	return firebase.app("ssl");
}

// secretsantaAppAuth = firebase.auth(ssl);
// secretsantaAppDatabase = firebase.database(ssl);
var ssl = initializingFireBase();

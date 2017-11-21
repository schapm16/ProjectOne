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




// Fisher-Yates shuffling algorithm

const swap = (targetArray, m, i) => {
	let temp = targetArray[i];
	targetArray[i] = targetArray[m];
	targetArray[m] = temp;
};

const arrayForShuffling = new Array();

for (let i = 0; i < 10; ++i) {
	arrayForShuffling.push(i);
}

function shuffle(targetArray) {
	let m = targetArray.length,
		i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		swap(targetArray, i, m);
	}
	return targetArray;
}


// shuffling 

const ssAppDatabse = firebase.database(ssl);


ssAppDatabse.ref('/groups/Tim\'s Santa Game/followers/').once('child_added').then(function(snapshot) {
	const memberList = Object.getOwnPropertyNames(snapshot.val());
	console.log(snapshot.val());
	console.log(memberList);

	const shuffledList = shuffle(memberList);
	ssAppDatabse.ref('/groups/Tim\'s Santa Game/followers/').set(true);
	shuffledList.forEach(function(elem, index) {
		if (index === shuffledList.length) {
			ssAppDatabse.ref('/groups/Tim\'s Santa Game/followers/' + elem).set(shuffledList[0]);
			return;	
		}
		ssAppDatabse.ref('/groups/Tim\'s Santa Game/followers/' + elem).set(shuffledList[index + 1]);
	});
});


// match 

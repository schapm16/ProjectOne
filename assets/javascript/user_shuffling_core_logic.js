(function() {
	"use strict";

	(function($) {
		console.log("script ran");
		const ssAppDatabase = firebase.database(ssl);

		// getting the user identity by accessing session storage
		const userId = window.sessionStorage.getItem('userid');
		console.log(userId);


		// member creating a group gets a group leader token

		// access datbase look for group leader tag


		// to create shuffling I need to get a list of current members
		// download members as an array of object

		// button onclick, pick random member from the array and check if they are paired to another


		// check for is group shuffled token
		// true return;

		// false
		// start buttons only show up for group creator
		// set token to true 
		// disabled join function 


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


	}(jQuery));

}());
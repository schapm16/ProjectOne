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



	}(jQuery));
	
}());
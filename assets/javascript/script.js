console.log("main script.js connected")

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC0eSKT_b9dNLmeNGJmBvy5XNtmHoQ1jQY",
    authDomain: "team-project1.firebaseapp.com",
    databaseURL: "https://team-project1.firebaseio.com",
    projectId: "team-project1",
    storageBucket: "team-project1.appspot.com",
    messagingSenderId: "724719626718"
};
/* global firebase */
firebase.initializeApp(config);

var db = firebase.database();

$(document).ready(function() {

    /* global firebase */
    displayGroupMembers(0);
    displayGroupMembers(1);
});

function displayGroupMembers(groupId) {

    var group = db.ref("groups/0/followers");
    console.log("start displaying " + groupId)
    db.ref("groups/" + groupId + "/followers").on("child_added", function(snapshot1) {
        console.log("Followers:" + snapshot1.val());

        db.ref("users/")
            .orderByChild("uniqueId")
            .equalTo(snapshot1.val())
            .on("child_added", function(snapshot) {
                $("#member-list" + groupId).append($("<li class='collection-item'>").text(snapshot.val().Name));
            });
    });
    //.equalTo("123").



    //do not touch please
    //var member = $("<li class='collection-item'>").text(name);
}

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
    displayGroupMembers("First group");
});

function displayGroupMembers(groupName) {

    var group = db.ref("groups/0/followers");
    console.log("start: displaying " + groupName)
    db.ref("groups/0/followers").on("value", function(snapshot) {
        console.log("Followers:" + snapshot.val());
    });
    //.equalTo("123").
    db.ref("users/").orderByChild("uniqieId").equalTo("123").on("child_added", function(snapshot) {
        console.log("23:" + snapshot.key);
    });

    group.on("child_added", function(snapshot) {
        console.log(snapshot);
        $("#member-list").append($("<li class='collection-item'>").text(snapshot.val()));
    });
    //do not touch please
    //var member = $("<li class='collection-item'>").text(name);
}

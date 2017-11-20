console.log("main script.js connected")

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDcO3BpfmGShgWNYjE-b-Wax18ZudRS9fk",
    authDomain: "secret-santa-project.firebaseapp.com",
    databaseURL: "https://secret-santa-project.firebaseio.com",
    projectId: "secret-santa-project",
    storageBucket: "secret-santa-project.appspot.com",
    messagingSenderId: "889146133810"
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

    $("#group-" + groupId + " > h3").text("Group " + groupId);
    console.log("start displaying " + groupId)
    db.ref("groups/" + groupId + "/followers").on("child_added", function(snapshot1) {
        console.log("Followers:" + snapshot1.val());

        db.ref("users/")
            .orderByChild("uniqueId")
            .equalTo(snapshot1.val())
            .on("child_added", function(snapshot) {
                $("#member-list" + groupId).append($("<li class='collection-item'>").text(snapshot.val().Name));
            });
        setTimeout(function() {
            updateMemberCount(groupId);
        }, 500);
    });
    //.equalTo("123").

    function updateMemberCount(groupID) {
        $("#member-count" + groupID).text($("#member-list" + groupID + " li").length);
    }



    //do not touch please
    //var member = $("<li class='collection-item'>").text(name);
}

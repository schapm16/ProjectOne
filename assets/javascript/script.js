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

sessionStorage.setItem("auth", "6Y73J7q0C3ZYZbLtge1N9d7cr003")
var db = firebase.database();

$(document).ready(function() {


    var auth = sessionStorage.getItem("auth");
    console.log("Session uID:" + auth);

    db.ref("users/" + auth + "/groups").on("value", function(snapshot) {
        console.log("Groups:" + snapshot.val().split(","));
        snapshot.val().split(",").forEach(function(element) {
            displayGroup(element, element)
            displayGroupMembers(element);
        });
    });
});

function displayGroup(groupName, groudId) {
    var group = $("<div class='group-item' id='group-" + groudId + "'>");
    group.append($("<h3 class='center'>"));
    group.append($("<h5>").html("Members: <span>3</span>/<span>8</span>"));
    group.append($("<ul class='collection' id='member-list" + groudId + "'>"));
    group.append("<a class='waves-effect waves-light btn'><i class='material-icons left'>ac_unit</i>Start</a>");
    $(".s6").append(group);
}

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

console.log("main script.js connected")

var db = firebase.database(ssl);

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
    });
    //.equalTo("123").



    //do not touch please
    //var member = $("<li class='collection-item'>").text(name);
}

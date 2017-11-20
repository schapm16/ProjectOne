/*global firebase $*/
// TODO only for testing, we have to replace this variables by userID after we will get authentication done
var userId = 1;
var groupId = 1;
var db = firebase.database();
var userItemsInDB = db.ref("/groups/" + groupId + "/followers/" + userId + "/items");

function addNewIdeaChip(ideaName) {
    console.log(ideaName);
    userItemsInDB.push().set({ ideaName: 0 });
    var newIdea = $("<div>").addClass("chip close");
    var close = $("<i>").addClass("material-icons close");
    newIdea.attr("data-name", ideaName);
    newIdea.text(ideaName);
    close.text("close");
    newIdea.append(close);
    $("#yourGiftIdeas").append(newIdea);
}

$(document).ready(function() {

    //Adding user's personal preference

    userItemsInDB
        .on('child_added', function(snap) {
            console.log(snap.key);
            addNewIdeaChip(snap.key);
        });
    //Removing element from HTML, and database
    $("#yourGiftIdeas").on("click", ".material-icons.close", function(event) {
        var par = $(event.target).parent().attr("data-name");
        userItemsInDB.child(par).remove();
    });

    $("#giftIdeaButton").click(function() {
        var text = $("#giftIdea").val();
        addNewIdeaChip(text);

        $("#giftIdea").val("");
    });
});

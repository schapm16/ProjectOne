/*global firebase $*/

function addNewIdeaChip(ideaName) {
    var newIdea = $("<div>").addClass("chip close");
    var close = $("<i>").addClass("material-icons close");
    newIdea.attr("data-name", ideaName);
    newIdea.text(ideaName);
    close.text("close");
    newIdea.append(close);
    $("#yourGiftIdeas").append(newIdea);
}

$(document).ready(function() {
    // TODO only for testing, we have to replace this variables by userID after we will get authentication done
    var userId = 1;
    var groupId = 1;

    var db = firebase.database();
    db.ref("/groups/" + groupId + "/followers/" + userId + "/items")
        .on('child_added', function(snap) {
            addNewIdeaChip(snap.val());
        });
    db.ref("/groups/" + groupId + "/followers/" + userId + "/items")
        .on('child_changed', function(snap) {
            addNewIdeaChip(snap.val());
        });

    $("#yourGiftIdeas").on("click", ".material-icons.close", function(event) {
        var par = $(event.target).parent().attr("data-name");
        console.log(par);
        db.ref("/groups/" + groupId + "/followers/" + userId + "/items").child("A hat").remove();

    });

    $("#giftIdeaButton").click(function() {
        var text = $("#giftIdea").val();
        addNewIdeaChip(text);

        $("#giftIdea").val("");
    });
});

/*global firebase $*/

function addNewIdeaChip(ideaName) {
    var newIdea = $("<div>").addClass("chip close");
    newIdea.text(ideaName);
    var close = $("<i>").addClass("material-icons close");
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

    $("#yourGiftIdeas").append();


    $("#giftIdeaButton").click(function() {
        addNewIdeaChip($("#giftIdea").val());

        // $("#yourGiftIdeas").append($("<div>").addClass("chip close"));
        // $(".chip.close:last").text($("#giftIdea").val());
        // $(".chip.close:last").append($("<i>").addClass("material-icons close"));
        // $(".chip.close:last i").text("close");

        $("#giftIdea").val("");
    });







});

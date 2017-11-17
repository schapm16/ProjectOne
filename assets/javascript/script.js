console.log("main script.js connected")

function displayGroupMembers(name) {

    var member = $("<li class='collection-item'>");
    member.text(name);
    $("#member-list").append(member);
}

$(document).ready(function() {
    //
    for (var i = 0; i < 10; i++) {
        displayGroupMembers(i);
    }
});

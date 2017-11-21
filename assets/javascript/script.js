console.log("main script.js connected")

var db = firebase.database(ssl);

$(document).ready(function() {
    var auth = sessionStorage.getItem("userid");
    console.log("Session uID:" + auth);

    db.ref("users/" + auth + "/groups").on("value", function(snapshot) {
        console.log("Groups:" + snapshot.val().split(","));
        snapshot.val().split(",").forEach(function(element) {
            displayGroup(element, element);
            displayGroupMembers(element);
            $("#" + element + ">i").onclick = shuffleMemberList('Razer');
        });
    });
});

function displayGroup(groupName, groupId) {
    var group = $("<div class='group-item' id='group-" + groupId + "'>");
    var form = $("<form class='input-field scale-transition scale-out' id='emailForm" + groupId + ">");

    group.append($("<h3 class='center'>"));
    group.append($("<h5>").html(" <span id='member-count" + groupId + "'> </span>"));
    group.append($("<ul class='collection' id='member-list" + groupId + "'>"));
    group.append("<a class='waves-effect waves-light btn' id='" + groupId + "'><i class='material-icons left'>ac_unit</i>Start</a>");
    group.append("<a class='waves-effect waves-light btn' id='expandEmail0'><i class='material-icons left'>email</i>Add</a>");
    form.append("<input id='inviteEmail' type='email' class='validate' style='width:80%'>");
    form.append("<label for='inviteEmail'>Email</label>");
    form.append("<button id='inviteEmailButton' type='button' class='btn-floating btn-large right'><i class='material-icons'>arrow_forward</i></button>");
    group.append(form);

    $(".s6").append(group);
}

// displayGroup("Group One", 0);


//TODO button click event listener
// $("#expandEmail0").click(function() {
//     $("#emailForm0").toggleClass("scale-out").toggleClass("scale-in");
// });

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
        $("#member-count" + groupID).text("Secret Santas: " + $("#member-list" + groupID + " li").length);
    }
    //do not touch please
    //var member = $("<li class='collection-item'>").text(name);
}


function shuffleMemberList(groupName) {
    // Fisher-Yates shuffling algorithm

    const swap = (targetArray, m, i) => {
        let temp = targetArray[i];
        targetArray[i] = targetArray[m];
        targetArray[m] = temp;
    };

    const arrayForShuffling = new Array();

    for (let i = 0; i < 10; ++i) {
        arrayForShuffling.push(i);
    }

    function shuffle(targetArray) {
        let m = targetArray.length,
            i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            swap(targetArray, i, m);
        }
        return targetArray;
    }

    // shuffling 

    const ssAppDatabse = firebase.database(ssl);

    ssAppDatabse.ref('/groups/' + groupName + '/followers/').once('value').then(function(snapshot) {
        const memberList = Object.getOwnPropertyNames(snapshot.val());
        console.log(memberList);

        const shuffledList = shuffle(memberList);
        ssAppDatabse.ref('/groups/' + groupName + '/followers/').set(true);
        shuffledList.forEach(function(elem, index) {
            if (index === shuffledList.length) {
                ssAppDatabse.ref('/groups/' + groupName + '/followers/' + elem).set(shuffledList[0]);
                return;
            }
            ssAppDatabse.ref('/groups/' + groupName + '/followers/' + elem).set(shuffledList[index + 1]);
        });
    });
}
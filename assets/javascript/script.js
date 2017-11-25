console.log("main script.js connected");

/*global firebase ssl*/
var db = firebase.database(ssl);

$(document).ready(function() {
    $('.modal').modal();
    $("#mainField").on("click", ".goButton", function() {
        console.log("knok");
        window.location.assign("mainDashboard.html");
    });

    var auth = sessionStorage.getItem("userid");
    console.log("Session uID:" + auth);

    db.ref("/users/"+ auth).once("value", function(snap){
        $(".userName").text(snap.val().Name);
    });

    function initializeGroup(element) {
        displayGroup(element);
        displayGroupMembers(element);
        $(document).on("click", "#" + element, function() {
            shuffleMemberList(element);
            $("#goButton" + element).removeClass("hide");
        });
        db.ref("groups/" + element + "/groupleader").once("value", function(snap) {
            console.log("Groupleader: " + snap.val());
            if (auth == snap.val()) {
                $("#" + element).removeClass("hide");
                $("#" + element + "email").removeClass("hide");
            }
        });
        db.ref("groups/" + element + "/FollowersTest").on('value', function(snap) {
            if (snap.val() != null) {
                $("#goButton" + element).removeClass("hide");
            }
        });
    }

    db.ref("users/" + auth + "/groups").once("value", function(snapshot) {
        console.log("Groups:" + snapshot.val().split(","));
        snapshot.val().split(",").forEach(function(element) {
            initializeGroup(element);
        });
    });

    $("#createNewGroup").click(function() {
        db.ref("groups/GroupsOnline").once("value", (snap)=>{
            var exist = 1;
            var name = document.getElementById("nameOfGroup").value;
            for(var prop in snap.val()){
                if(name === snap.val()[prop]){
                    $("#nameOfGroup").val("Such group name already exists! Select a new one!")
                    console.log("exits")
                    exist=0;
                    break;
                }
            }
            if(exist){
                var key = db.ref("groups/")
                .push({
                    NameOfGroup: document.getElementById("nameOfGroup").value,
                    followers: {
                        0: auth,
                    },
                    groupleader: auth
                }).key;
                db.ref("users/" + auth + "/groups").once("value", function(snap) {
                    db.ref("users/" + auth).update({
                        groups: snap.val() + "," + key
                    });
                });
                db.ref("groups/GroupsOnline").push(document.getElementById("nameOfGroup").value);
                initializeGroup(key);
                $('#modal1').modal('close');
            }
        });
    });

    $("#joinGroup").click(function(){   
        var name = document.getElementById("nameOfGroupJoin").value;
        db.ref("groups/GroupsOnline").once("value", (snap)=>{
            for(var prop in snap.val()){
                if(name === snap.val()[prop]){
                    db.ref("groups/"+prop+"/followers").push(auth);
                    console.log("yes:"+  prop)
                    db.ref("users/" + auth + "/groups").once("value", function(snap) {
                        db.ref("users/" + auth).update({
                            groups: snap.val() + "," + prop
                        });
                    }).then(()=>{
                        console.log("Successfully joined!");
                        initializeGroup(prop);
                        $('#modal2').modal('close');
                    })
                    break;
                }
                $("#nameOfGroupJoin").val("Such group does not exist! Check the name!")
            } 
        });
        
    });
});

function displayGroup(groupID) {
    var card = $("<div class='card' style='vertical-align:top'>");
    var cardContent = $("<div class='card-content'>");
    var group = $("<div class='group-item center-align' id='group-" + groupID + "'>");
    var form = $("<form class='input-field scale-transition scale-out' id='emailForm" + groupID + "'>");
    group.append($("<h3 >"));
    group.append($("<h5 class='center-align'>").html(" <span id='member-count" + groupID + "'> </span>"));
    group.append($("<ul class='collection' id='member-list" + groupID + "'>"));
    //keeps "hide" class until until user is groupleader
    group.append("<a class='waves-effect waves-light btn hide' id='" + groupID + "'><i class='material-icons left'>ac_unit</i>Start</a>");
    group.append("<a class='waves-effect waves-light btn emailbtn hide' id='" + groupID + "email' data-target='emailForm" + groupID + "'><i class='material-icons left'>email</i>Add</a>");
    form.append("<input id='inviteEmail-" + groupID + "' type='email' class='validate' style='width:80%'>");
    form.append("<label for='inviteEmail'>Email</label>");
    form.append("<button id='inviteEmailButton-" + groupID + "' type='button' class='btn-floating btn-large right'><i class='material-icons'>arrow_forward</i></button>");
    group.append("<a class='waves-effect waves-light btn hide' id='goButton" + groupID + "'  data-groupId='" + groupID + "'>Go!</a>");

    group.append(form);
    cardContent.append(group);
    card.append(cardContent);
    $("#mainField").append(card);
    $("#mainField").on("click", "#goButton" + groupID, function(event) {
        console.log("knock");
        sessionStorage.setItem("currentGroupId", $(event.currentTarget).attr("data-groupid"));
        window.location.assign("mainDashboard.html");
    });

}

// displayGroup("Group One", 0);

// $(document).click(function(event) {
//     if ($(event.target).hasClass('emailbtn')) {
//         var targetForm = $(event.target).attr("data-target");
//         console.log(targetForm);
//         $(document.getElementById(targetForm)).toggleClass("scale-out").toggleClass("scale-in");
//     }
// });
$("#signOut").click(function() {
    sessionStorage.setItem("userid", "");
    window.location.assign("index.html");
});

$(document).click(function(event) {
    if ($(event.target).hasClass('emailbtn')) {
        var targetForm = $(event.target).attr("data-target");
        console.log(targetForm);
        $(document.getElementById(targetForm)).toggleClass("scale-out").toggleClass("scale-in");

        const groupId = targetForm.replace(/\bemailForm/, "");

        document.querySelector('#inviteEmailButton-' + groupId).onclick = function() {
            const url = 'https://dfarrenk.github.io/ProjectOne/index.html#' + groupId,
            emailContent = "Hi,%0D%0A%0D%0APlease join us on Secret Santa for a game of fun and mystery!!%0D%0A%0D%0Aclick on the link below to join us:%0D%0A" + url + "%0D%0A%0D%0Acheers!!",
            inviteEmail = $('#inviteEmail-' + groupId).val();
            console.log(url);
            console.log(emailContent);

            window.open("mailto:" + inviteEmail + "?subject=" + "Cool Secret Santa Game" + "&body=" + emailContent);
        };
    }
});

function displayGroupMembers(groupId) {
    db.ref("groups/" + groupId + "/NameOfGroup/").once("value", function(snap) {
        $("#group-" + groupId + " > h3").text(snap.val());
    });
    console.log("start displaying " + groupId);
    db.ref("groups/" + groupId + "/followers").on("child_added", function(snapshot1) {
        console.log("Followers:" + snapshot1.val());
        console.log("TEST: " + snapshot1.val());
        db.ref("users/")
        .orderByChild("uniqueId")
        .equalTo(snapshot1.val())
        .on("child_added", function(snapshot) {
            $("#member-list" + groupId).append($("<li class='collection-item center-align'>").text(snapshot.val().Name));
        });
        setTimeout(function() {
            updateMemberCount(groupId);
        }, 500);
    });

    function updateMemberCount(groupID) {
        $("#member-count" + groupID).text("Secret Santas: " + $("#member-list" + groupID + " li").length);
    }
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

    function makePairs(targetArray) {
        var object = {};
        var length = targetArray.length - 1;
        for (var i = 0; i < length; i++) {
            object[targetArray[i]] = targetArray[i + 1];
        }
        object[targetArray[i]] = targetArray[0];
        return object;
    }

    // shuffling
    const ssAppDatabse = firebase.database(ssl);

    ssAppDatabse.ref('/groups/' + groupName + '/followers/').once('value').then(function(snapshot) {
        //Return object values

        const memberList = Object.values(snapshot.val());
        console.log(memberList);

        var shuffledList = shuffle(memberList);
        console.log("Shuffled list: " + shuffledList);

        ssAppDatabse.ref('/groups/' + groupName + '/FollowersTest/').set(true);

        // shuffledList.forEach(function(elem, index) {
        //     if (index === shuffledList.length - 1) {
        //         ssAppDatabse.ref('/groups/' + groupName + '/FollowersTest/' + elem).set(shuffledList[0]);
        //         return;
        //     }
        //     ssAppDatabse.ref('/groups/' + groupName + '/FollowersTest/' + elem).set(shuffledList[index + 1]);
        // });
        //assigning pairs
        ssAppDatabse.ref('/groups/' + groupName + '/FollowersTest/').set(makePairs(shuffledList));
    });
}

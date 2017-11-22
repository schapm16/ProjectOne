/* global $ */
function messageModal(errorType) {
    switch (errorType) {
        //Registration Errors
        case "email-already-used":
            $("#message").text("This email address is already registered to an account.");
            $("#messageModal").modal("open");
            break;

        case "invalid-email":
            $("#message").text("The email address entered is invalid.");
            $("#messageModal").modal("open");
            break;

        case "password-length":
            $("#message").text("Password must be at least 8 characters.");
            $("#messageModal").modal("open");
            break;

        case "password-match":
            $("#message").text("The passwords entered do not match.");
            $("#messageModal").modal("open");
            break;

            //Login Errors
        case "user-not-found":
            $("#message").text("The email address provided is not registered to an existing account.");
            $("#messageModal").modal("open");
            break;

        case ("password-incorrect"):
            $("#message").text("The password entered is incorrect.");
            $("#messageModal").modal("open");
            break;
    }
}


$(document).ready(function() {

    // Initialize registerModal
    $('.modal').modal();
    const ssAppDatabase = firebase.database(ssl);

    checkIfThisIsAnInvitation();

    // this function will check if the user have filled out the group name
    // if not stop action
    function groupNameMustBeFilledAndChecked(groupName = false, joinGroupName = false) {
        return new Promise((resolve, reject) => {
            // if player doesn't join or create a group
            if (!groupName && !joinGroupName) {
                throw new Error('Must choose a group to join or create a new one!!');
            }
            // if player join and create a group
            if (!!groupName && !!joinGroupName) {
                throw new Error('Player can only choose to join a group or create new one.');
            }

            // before resolving joinGroupName must exist 
            if (!!joinGroupName && !groupName) {
                ssAppDatabase.ref("/groups/GroupsOnline/").once("value").then((snapshot) => {
                    let groupNameExist = false;
                    Object.values(snapshot.val()).forEach((elem) => {
                        console.log(elem);
                        joinGroupName === elem && (groupNameExist = true);
                    });
                    groupNameExist ? resolve() :
                        reject(new Error('The group name you entered doesn\'t match any existing group'));
                })
            }

            if (!!groupName && !joinGroupName) {
                resolve();
            }
        });
    }

    // run this function at document ready
    function checkIfThisIsAnInvitation() {
        const isHashWithData = window.location.hash.replace(/[#]/, "");
        if (isHashWithData) {
            ssAppDatabase.ref("/groups/" + isHashWithData + "/NameOfGroup").once("value").then((snapshot) => {
                $("#loginJoinGroup").val(snapshot.val());
                $("#loginJoinGroup").next("label").text("");
                $("#loginNewGroup").prop("disabled", true);
            });
        }
        return;
    }

    // exit modal
    $("#acknowledgeButton").click(function() {
        $("#messageModal").modal("close");
    });


    $("#startRegisterButton").click(function() {
        var joinGroupName = $("#loginJoinGroup").val();
        var createGroupName = $("#loginNewGroup").val();

        var userEmail = $("#loginEmail").val();
        var userPassword = $("#loginPassword").val();

        groupNameMustBeFilledAndChecked(createGroupName, joinGroupName).then(() => {
            $("#registerModal").modal("open");
        }).catch((error) => {
            alert(error.message);
        })
    });

});
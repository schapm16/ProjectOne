/* global $ */
function messageModal(errorType) {
    console.log("Error: " + errorType);
    switch (errorType) {
        //Registration Errors
        case "create-join-blank":
            $("#messageModal h4").text("Oops!");
            $("#message").text("Enter a group name to create or join group.");
            $("#messageModal").modal("open");
            break;

        case "create-join-both":
            $("#messageModal h4").text("Oops!");
            $("#message").text("Enter either a group name to create or join but not both.");
            $("#messageModal").modal("open");
            break;

        case "group-name-mismatch":
            $("#messageModal h4").text("Oops!");
            $("#message").text("This group name does not match any existing groups.");
            $("#messageModal").modal("open");
            break;

        case "name-blank":
            $("#messageModal h4").text("Oops!");
            $("#message").text("Enter your name, otherwise no one will know who you are.");
            $("#messageModal").modal("open");
            break;

        case "alias-blank":
            $("#messageModal h4").text("Oops!");
            $("#message").text("Enter an alias. It is great for hiding who you really are.");
            $("#messageModal").modal("open");
            break;

        case "email-already-used":
            $("#messageModal h4").text("Oops!");
            $("#message").text("This email address is already registered to an account.");
            $("#messageModal").modal("open");
            break;

        case "password-length":
            $("#messageModal h4").text("Oops!");
            $("#message").text("Password must be at least 8 characters.");
            $("#messageModal").modal("open");
            break;

        case "password-mismatch":
            $("#messageModal h4").text("Oops!");
            $("#message").text("The passwords entered do not match.");
            $("#messageModal").modal("open");
            break;

            //Login Errors
        case "user-not-found":
            $("#messageModal h4").text("Oops!");
            $("#message").text("The email address provided is not registered to an existing account.");
            $("#messageModal").modal("open");
            break;

        case "password-incorrect":
            $("#messageModal h4").text("Oops!");
            $("#message").text("The password entered is incorrect.");
            $("#messageModal").modal("open");
            break;

        case "password-blank":
            $("#messageModal h4").text("Oops!");
            $("#message").text("You forgot your password.");
            $("#messageModal").modal("open");
            break;

        case "groupname-repeated":
            $("#messageModal h4").text("Oops!");
            $("#message").text("The group name you wish to create has already been taken, please consider another.");
            $("#messageModal").modal("open");
            break;

        case "group-already-joined":
            $("#messageModal h4").text("Oops!");
            $("#message").text("Looks like you already joined the group!");
            $("#messageModal").modal("open");
            break;

        case "group-join-unavailable":
            $("#messageModal h4").text("Oops!");
            $("#message").text("The group you wish to join has already started please find another group to join.");
            $("#messageModal").modal("open");
            break;

            // Login before verifiying email
        case "email-not-verified":
            $("#messageModal h4").text("Oops!");
            $("#message").text("Email not verified. Please verified your email before proceed.");
            $("#messageModal").modal("open");
            break;

            //Both Login and Registration Errors
        case "invalid-email":
            $("#messageModal h4").text("Oops!");
            $("#message").text("The email address entered is invalid.");
            $("#messageModal").modal("open");
            break;

            //Registration email verification sent.
        case "email-verification-sent":
            $("#registerModal").modal("close");
            $("#messageModal h4").text("Success!");
            $("#message").text("Email verification sent to your inbox.");
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
    function groupNameMustBeFilledAndChecked(groupName = false, joinGroupName = false) {
        return new Promise((resolve, reject) => {

            // if player doesn't join or create a group
            if (!groupName && !joinGroupName) {
                // messageModal("create-join-blank");
                throw new Error("create-join-blank");
            } // if player join and create a group
            else if (!!groupName && !!joinGroupName) {
                // messageModal("create-join-both");
                throw new Error("create-join-both");
            }

            // before resolving joinGroupName must exist 
            if (!!joinGroupName && !groupName) {
                ssAppDatabase.ref("/groups/GroupsOnline/").once("value").then((snapshot) => {
                    let groupNameExist = false;
                    Object.values(snapshot.val()).forEach((elem) => {
                        console.log(elem);
                        joinGroupName === elem && (groupNameExist = true);
                    });
                    if (groupNameExist) {
                        resolve();
                    } else {
                        // messageModal("group-name-mismatch");
                        reject(new Error("group-name-mismatch"));
                    }
                });
            } // before resolving groupName must not exist 
            else if (!!groupName && !joinGroupName) {
                ssAppDatabase.ref("/groups/GroupsOnline/").once("value").then((snapshot) => {
                    let groupNameExist = false;
                    Object.values(snapshot.val()).forEach((elem) => {
                        console.log(elem);
                        groupName === elem && (groupNameExist = true);
                    });

                    if (groupNameExist) {
                        reject(new Error("groupname-repeated"));
                    } else {
                        resolve();
                    }
                });
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
        $("#registerModal input").val("");
    });

    $("#startRegisterButton").click(function() {
        var joinGroupName = $("#loginJoinGroup").val();
        var createGroupName = $("#loginNewGroup").val();

        var userEmail = $("#loginEmail").val();
        var userPassword = $("#loginPassword").val();

        groupNameMustBeFilledAndChecked(createGroupName, joinGroupName).then(() => {
            $("#registerModal").modal("open");
        }).catch((error) => {
            console.log(error);
            messageModal(error.message);
        })
    });

});
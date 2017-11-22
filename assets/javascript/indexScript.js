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
      
    case("password-incorrect"):
      $("#message").text("The password entered is incorrect.");
      $("#messageModal").modal("open");
      break;
    }
    
  }
  
  
$(document).ready(function(){
    
  // Initialize Modal
  $('.modal').modal();
  
  
  $("#startRegisterButton").click(function() {
    //If user validation remains completely in index_user_authentication.js these can be deleted.
    // var joinGroupName = $("#loginJoinGroup").val();
    // var createGroupName = $("#loginCreateGroup").val();
    
    // var userEmail = $("#loginEmail").val();
    // var userPassword = $("#loginPassword").val();
    
    //This should be conditional on either Create Group or Join Group being filled out
    $("#registerModal").modal("open");
    
  });
  
  $("#acknowledgeButton").click(function() {
    $("#messageModal").modal("close");
    
  });
    
  });

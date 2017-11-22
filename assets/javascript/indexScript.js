/* global $ */


function loginErrorModal(errorType) {
    
    switch (errorType) {
    
    //Registration Errors
    case "email-already-used":
      $("#errorMessage").text("This email address is already registered to an account.");
      $("#errorModal").modal("open");
      break;
      
    case "invalid-email":
      $("#errorMessage").text("The email address entered is invalid.");
      $("#errorModal").modal("open");
      break;
    
    case "password-length":
      $("#errorMessage").text("Password must be at least 8 characters.");
      $("#errorModal").modal("open");
      break;
      
    case "password-match":
      $("#errorMessage").text("The passwords entered do not match.");
      $("#errorModal").modal("open");
      break;
    
    //Login Errors
    case "user-not-found": 
      $("#errorMessage").text("The email address provided is not registered to an existing account.");
      $("#errorModal").modal("open");
      break;
      
    case("password-incorrect"):
      $("#errorMessage").text("The password entered is incorrect.");
      $("#errorModal").modal("open");
      break;
    }
    
  }
  
  
$(document).ready(function(){
    
  // Initialize Modal
  $('.modal').modal();
  
  
  $("#startRegisterButton").click(function() {
  
    var joinGroupName = $("#loginJoinGroup").val();
    var createGroupName = $("#loginCreateGroup").val();
    
    var userEmail = $("#loginEmail").val();
    var userPassword = $("#loginPassword").val();
    
    
    $("#registerModal").modal("open");
    
  });
  
  $("#acknowledgeButton").click(function() {
    $("#errorModal").modal("close");
    
  });
    
  });

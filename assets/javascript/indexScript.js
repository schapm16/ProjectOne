/* global $ */

$(document).ready(function(){
    
  // Initialize registerModal
  $('.modal').modal();
  
  
  $("#loginButton").click(function() {
  
    var joinGroupName = $("#loginJoinGroup").val();
    var createGroupName = $("#loginCreateGroup").val();
    
    var userEmail = $("#loginEmail").val();
    var userPassword = $("#loginPassword").val();
    
    if (userEmail === "" || userPassword === "") {
      $("#registerModal").modal("open");
    }
    
    });
  });

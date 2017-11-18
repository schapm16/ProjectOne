/* global $ */

$(document).ready(function(){
    
  // Initialize registerModal
  $('.modal').modal();
  
  
  $("#startRegisterButton").click(function() {
  
    var joinGroupName = $("#loginJoinGroup").val();
    var createGroupName = $("#loginCreateGroup").val();
    
    var userEmail = $("#loginEmail").val();
    var userPassword = $("#loginPassword").val();
    
    
    $("#registerModal").modal("open");
    
    
    });
  });

/*global $*/

$(document).ready(function() {

    $("#giftIdeaButton").click( function() {
        
        $("#yourGiftIdeas").append($("<div>").addClass("chip close"));
        
        $(".chip.close:last").text($("#giftIdea").val());
        $(".chip.close:last").append($("<i>").addClass("material-icons close"));
        $(".chip.close:last i").text("close");

        $("#giftIdea").val("");        
    });

    
}); 

/*global firebase $*/
// TODO only for testing, we have to replace this variables by userID after we will get authentication done
var userId = 1;
var groupId = 1;

var db = firebase.database();
var userItemsInDB = db.ref("/groups/" + groupId + "/followers/" + userId + "/items");

function addNewIdeaChip(ideaName) {
    console.log(ideaName);
    userItemsInDB.child(ideaName).set(0);
    var newIdea = $("<div>").addClass("chip close");
    var close = $("<i>").addClass("material-icons close");
    newIdea.attr("data-name", ideaName);
    newIdea.text(ideaName);
    close.text("close");
    newIdea.append(close);
    $("#yourGiftIdeas").append(newIdea);
}

$(document).ready(function() {
    //Adding user's personal preference
    userItemsInDB
        .on('child_added', function(snap) {
            console.log(snap.key);
            addNewIdeaChip(snap.key);
        });
    //Removing element from HTML, and database
    $("#yourGiftIdeas").on("click", ".material-icons.close", function(event) {
        var par = $(event.target).parent().attr("data-name");
        userItemsInDB.child(par).remove();
    });

    $("#giftIdeaButton").click(function() {
        var text = $("#giftIdea").val();
        userItemsInDB.child(text).set(0);

        $("#giftIdea").val("");
    });
    
    
    
    // Function to make Walmart API call and Display Results
    function walmartAPI(searchTerm) {
        var priceRange = 40;
            
        var key = "bznsyj8ykctspk7c3fr4swkz";
        var url = "https://api.walmartlabs.com/v1/search?";
        
        //Walmart Carousel
            $.ajax({
                url: url,
                method: "GET",
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    query: searchTerm,
                    format: "json",
                    //"facet.range": priceRange, //
                    apiKey: key
                },
            }).done(function(result) {
                console.log(result);
                for (var i = 0; i < 10; i++) {
                    var newImg = $("<img>");
                    newImg.attr("src", result.items[i].imageEntities[0].mediumImage);
                    var Paragraph = $("<p>");
                    Paragraph.text("Item" + i + ": $" + result.items[i].salePrice);
                    var caruItem = $("<a id=img" + i + ">");
                    caruItem.attr("class", 'carousel-item center-align');
                    caruItem.attr("target", "_blank");
                    caruItem.attr("href", result.items[i].productUrl);
                    caruItem.append(newImg);
                    caruItem.append(Paragraph);
                    $("#productDisplay").append(caruItem);
                    $("#img" + i).hammer();
                    $("#img" + i).on("tap", function() {
                        window.open($(this).attr("href"), '_blank');
                    });
                }
                $('.carousel').carousel();
            });
    }
    
    
    
    // Product Display Carousel on partner gift idea "chip" click
    
    var store = "Walmart";
    var searchTerm;
    
    
    
    
    $(document).on("click", "#partnerGiftIdeas .chip", function() {
        
        $('.carousel').carousel('destroy');
        $("#productDisplay").css("display", "block");
        $("#productDisplay").empty();
        searchTerm = $(this).text();
        
        if (store === "Walmart") {
            walmartAPI(searchTerm);    
        }
        
        if (store === "Ebay") {
            ebayAPI(searchTerm);
        }
    });
});

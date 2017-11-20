console.log("Walmart.js connected")

//The Amazon Product API has a function called ItemLookup that can retrieve information based on ISBN.
// The Sample Code & Libraries pages has some (rather old) sample code you could peruse.
var key = "bznsyj8ykctspk7c3fr4swkz";
var url = "https://api.walmartlabs.com/v1/search?";
//query=ipod&format=json&apiKey=bznsyj8ykctspk7c3fr4swkz
//assign an item's name to this variable
var searchTerm = "bmw";

var priceRange = 40; //price range (optional, and it should be a string with "facet: value" format);

$(document).ready(function() {
    //done
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
            $("#mainCaruDiv").append(caruItem);
            $("#img" + i).hammer();
            $("#img" + i).on("tap", function() {
                window.open($(this).attr("href"), '_blank');
            });
        }
        $('.carousel').carousel();
    });
});

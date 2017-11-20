/* global YT */
// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '200',
        videoId: '9DlD7-TykIU',
        events: {
            //'onReady': onPlayerReady,
            //'onStateChange': onPlayerStateChange
        }
    });
}

$("#play-music").click(function() {
    if (player.getPlayerState() !== 1) {
        player.playVideo();
        $("#play-music").addClass("pulse");

    }
    else {
        player.pauseVideo();
        $("#play-music").removeClass("pulse");
    }
});

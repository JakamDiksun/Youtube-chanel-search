var globalKey = "AIzaSyAORPQPMTmZxMpAX5fID61c1lmX0U-OFn8";
var globalVideoID = getUrlVars().video;
var globalChanelID = getUrlVars().chanel;
var globalRelatedCell = $("th[class='related']");

$(document).ready(function () {
    //Az input mezőben {enter} lenyomására meghívódik a search()
    $("#search").on('keyup', function (e) {
        if (e.keyCode == 13 && $("input[id='search']").val() != "") {
            search();
        }
    });
    globalRelatedCell.hide();
    if (globalChanelID != null) {     //Ha az url-ben meg van adva chanelID, akkor lekéri a hozzá tarozó videókat.
        getVideosByChanelID(globalChanelID);
    } else if (globalVideoID != null) {     //Ha chanelID nincs, de konkrét videoID meg van adva, akkor lekéri az adott videót és a hozzá tartozó related videókat.
        globalRelatedCell.show();
        openVideoAndSuggestions();
    }
});

//Lekéri a paraméterben átadott csatorna nevéhez tartozó chanelID-t, majd újratölti az oldalt, úgy hogy az ID szerepel az url-ben mint paraméter.
function search() {
    $("div[class='row']").html("");
    var chanelName = $("input[id='search']").val();
    $.get(
        "https://www.googleapis.com/youtube/v3/channels", {
            part: "contentDetails",
            forUsername: chanelName,
            key: globalKey
        },
        function (data) {
            if (data.items.length > 0) {
                if (chanelName != "") {
                    $("input[id='search']").val("");
                }
                var ChanelID = data.items[0].contentDetails.relatedPlaylists.uploads;
                window.location = window.location.href.split("?")[0] + "?chanel=" + ChanelID;
            } else { //Ha ezek eredménye 0 (Helytelen csatornanév, vagy 0 videóval rendelkező felhasználó) hiba üzenetet ír ki.
                $("div[class='row']").html("<center><div class='invalid'>No chanels were found!</div></center>");
            }
        }
    );
}

//Lekéri a paraméterben kapott chanelID-hoz tartozó videókat, majd megjeleníti felsorolás szerűen a címüket és thumbnail-jüket.
function getVideosByChanelID(ChanelID) {
    $.get(
        "https://www.googleapis.com/youtube/v3/playlistItems", {
            part: "snippet",
            maxResults: 20,
            playlistId: ChanelID,
            key: globalKey
        },
        function (data) {
            $.each(data.items, function (i, item) {
                var title = item.snippet.title;
                var thumbnail = item.snippet.thumbnails.high.url;
                var videoID = item.snippet.resourceId.videoId;
                title = title.length < 42 ? title : title.substring(0, 40) + ". . ."; //Ha 41 karakternél hosszabb a videó címe, nem iratom ki a teljes címet.
                $("div[class='row']").append(getThumbnailAndTitle(videoID, thumbnail, title));
            });
        }
    );
}

//Előállít egy div-et ami tartalmazza egy videó thumbnail-jét és címét.
function getThumbnailAndTitle(videoID, thumbnail, title) {
    return "<div class='col-sm-4' value='" + videoID + "'>" +
        "<img src='" + thumbnail + "' class='img-responsive' onclick='chooseVideo(this);' alt='Image'>" +
        "<p onclick='chooseVideo(this);'>" +
        title +
        "</p>" +
        "</div>";
}

//Újratölti az oldalt, úgy hogy az videoID szerepel az url-ben mint paraméter
function chooseVideo(current) {
    var videoID = $(current).parent().attr("value");
    window.location = window.location.href.split("?")[0] + "?video=" + videoID;
}

//Lekéri az adott videót és a hozzá tartozó related videókat.
function openVideoAndSuggestions() {
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet',
            type: 'video',
            relatedToVideoId: globalVideoID,
            key: globalKey
        },
        function (data) {
            //Beszúrom a videót
            $("td[class='main']").append("<iframe src='http://www.youtube.com/embed/" + globalVideoID + "' height = '420px;' width = '720px;'></iframe>");
            //A kapcsolódó videókat a hozzájuk tartozó címmel beszúrom a megfelelő helyre.
            $.each(data.items, function (i, item) {
                var title = item.snippet.title;
                var thumbnail = item.snippet.thumbnails.medium.url;
                var videoID = item.id.videoId;
                title = title.length < 42 ? title : title.substring(0, 40) + ". . .";
                $("div[class='related']").append(getThumbnailAndTitle(videoID, thumbnail, title));
            });
            $("div[class='related'] div").attr("id", "bordered");
        }
    );

}

//Felparsolja az url-ben szereplő paramétereket és egy listában visszaadja azokat.
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
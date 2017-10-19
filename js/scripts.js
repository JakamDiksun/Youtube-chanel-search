var globalKey = "AIzaSyAORPQPMTmZxMpAX5fID61c1lmX0U-OFn8";
var globalvideoId = getUrlVars().video;
var globalChannelId = getUrlVars().channel;

$(document).ready(function () {
    //Az input mezőben {enter} lenyomására meghívódik a search()
    $("#search").on('keyup', function (e) {
        if (e.keyCode == 13 && $("input[id='search']").val() != "") {
            search();
        }
    });
    //$("th[class='related']").hide();
    if (globalChannelId != null) {     //Ha az url-ben meg van adva channelId, akkor lekéri a hozzá tarozó videókat.
        getVideosByChannelId(globalChannelId);
    } else if (globalvideoId != null) {     //Ha channelId nincs, de konkrét videoId meg van adva, akkor lekéri az adott videót és a hozzá tartozó related videókat.
        openVideoAndSuggestions();
    }
});

//Lekéri a paraméterben átadott csatorna nevéhez tartozó channelId-t, majd újratölti az oldalt, úgy hogy az ID szerepel az url-ben mint paraméter.
function search() {
    $("div[class='row']").html("");
    var channelName = $("input[id='search']").val();
    $.get(
        "https://www.googleapis.com/youtube/v3/channels", {
            part: "contentDetails",
            forUsername: channelName,
            key: globalKey
        },
        function (data) {
            if (data.items.length > 0) {
                if (channelName != "") {
                    $("input[id='search']").val("");
                }
                var ChannelId = data.items[0].contentDetails.relatedPlaylists.uploads;
                window.location = window.location.href.split("?")[0] + "?channel=" + ChannelId;
            } else { //Ha ezek eredménye 0 (Helytelen csatornanév, vagy 0 videóval rendelkező felhasználó) hiba üzenetet ír ki.
                $("div[class='row']").html("<center><div class='invalid'>No channels were found!</div></center>");
            }
        }
    );
}

//Lekéri a paraméterben kapott channelId-hoz tartozó videókat, majd megjeleníti felsorolás szerűen a címüket és thumbnail-jüket.
function getVideosByChannelId(ChannelId) {
    $.get(
        "https://www.googleapis.com/youtube/v3/playlistItems", {
            part: "snippet",
            maxResults: 20,
            playlistId: ChannelId,
            key: globalKey
        },
        function (data) {
            $.each(data.items, function (i, item) {
                var title = item.snippet.title;
                var thumbnail = item.snippet.thumbnails.high.url;
                var videoId = item.snippet.resourceId.videoId;
                title = title.length < 42 ? title : title.substring(0, 40) + ". . ."; //Ha 41 karakternél hosszabb a videó címe, nem iratom ki a teljes címet.
                $("div[class='row']").append(getThumbnailAndTitle(videoId, thumbnail, title));
            });
            if (data.items.length > 0) {
                var channelTitle = data.items[0].snippet.channelTitle.length > 0 ? data.items[0].snippet.channelTitle : "";
            } else {
                $("div[class='row']").html("<center><div class='invalid'>There is no video on this channel!</div></center>");
            }
        }
    );
}

//Előállít egy div-et ami tartalmazza egy videó thumbnail-jét és címét.
function getThumbnailAndTitle(videoId, thumbnail, title) {
    return "<div class='col-sm-4' value='" + videoId + "'>" +
        "<img src='" + thumbnail + "' class='img-responsive' onclick='chooseVideo(this);' alt='Image'>" +
        "<p onclick='chooseVideo(this);'>" +
        title +
        "</p>" +
        "</div>";
}

//Újratölti az oldalt, úgy hogy az videoId szerepel az url-ben mint paraméter
function chooseVideo(current) {
    var videoId = $(current).parent().attr("value");
    window.location = window.location.href.split("?")[0] + "?video=" + videoId;
}

//Lekéri az adott videót és a hozzá tartozó related videókat.
function openVideoAndSuggestions() {
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet',
            type: 'video',
            relatedToVideoId: globalvideoId,
            key: globalKey
        },
        function (data) {
            //Beszúrom a videót
            $("td[class='main']").append("<iframe src='http://www.youtube.com/embed/" + globalvideoId + "' height = '420px;' width = '720px;'></iframe>");
            //A kapcsolódó videókat a hozzájuk tartozó címmel beszúrom a megfelelő helyre.
            $.each(data.items, function (i, item) {
                var title = item.snippet.title;
                var thumbnail = item.snippet.thumbnails.medium.url;
                var videoId = item.id.videoId;
                title = title.length < 42 ? title : title.substring(0, 40) + ". . .";
                $("div[class='related']").append(getThumbnailAndTitle(videoId, thumbnail, title));
            });
            $("div[class='related'] div").attr("id", "bordered");
            $("th[class='related']").show();
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
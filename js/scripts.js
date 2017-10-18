var globalKey = "AIzaSyAORPQPMTmZxMpAX5fID61c1lmX0U-OFn8";
var globalVideoID = getUrlVars().video;
var globalChanelID = getUrlVars().chanel;


$(document).ready(function() {	
	$("#search").on('keyup', function (e) {
        if (e.keyCode == 13 && $("input[id='search']").val()!="") {
            search();
        }
    });
	if(globalChanelID != null){
		getVideosByChanelID(globalChanelID);
	}else if(globalVideoID != null){
		openVideo();
	}
});


function search(){
	$("div[class='row']").html("");
	var chanelName = $("input[id='search']").val();
	$.get(
		"https://www.googleapis.com/youtube/v3/channels", {
			part: "contentDetails",
			forUsername: chanelName,
			key: globalKey,
		},
		function(data){
			if (data.items.length > 0){
				if (chanelName != ""){
					$("input[id='search']").val("");
				}
				var ChanelID = data.items[0].contentDetails.relatedPlaylists.uploads;
				window.location = window.location.href.split("?")[0] + "?chanel=" + ChanelID;
			}else{
				$("div[class='row']").html("<div style='width: 70%; background-color:#c13838; border: 1px solid #9fc4aa; border-radius: 4px; color:wheat;'>No chanels were found!</div>"); 
			}
		}
    );
}

function getVideosByChanelID(ChanelID){
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: "snippet",
			maxResults: 20,
			playlistId: ChanelID,
			key: globalKey,
		},
		function(data){
			$.each(data.items, function(i, item){
				var title = item.snippet.title;
				var thumbnail = item.snippet.thumbnails.high.url;
				var videoID = item.snippet.resourceId.videoId;
				title = title.length < 42 ? title : title.substring(0,40)+". . .";
				$("div[class='row']").append(getThumbnailAndTitle(videoID,thumbnail,title));
			});
		}
    );
}

function getThumbnailAndTitle(videoID,thumbnail,title){
	return  "<div class='col-sm-4' style='padding-top: 20px;' video='"+videoID+"'>"+        
				"<img src='"+thumbnail+"' class='img-responsive' style='width:100%; cursor:pointer;' onclick='chooseVideo(this);' alt='Image'>"+
				"<p style='cursor:pointer;' onclick='chooseVideo(this);'>"+
					title+
				"</p>"+
			"</div>";
}

function chooseVideo(current){
	var videoID = $(current).parent().attr("video");
	window.location = window.location.href.split("?")[0] + "?video=" + videoID;
}

function openVideo(){
	$.get(
		"https://www.googleapis.com/youtube/v3/search", {
			part: 'snippet',
			type: 'video',
			key: globalKey,
			relatedToVideoId: globalVideoID
		},
		function(data){
			console.log(data);
			$("td[id='main']").append("<iframe src='http://www.youtube.com/embed/"+globalVideoID+"' height = '420px;' width = '720px;'></iframe>");

			$.each(data.items, function(i, item){
				var title = item.snippet.title;
				var thumbnail = item.snippet.thumbnails.medium.url;
				var videoID = item.id.videoId;
				title = title.length < 42 ? title : title.substring(0,40)+". . .";
				$("div[id='related']").append(getThumbnailAndTitle(videoID,thumbnail,title));
			})
			$("div[id='related'] div").attr("id","bordered");
		}
    );

}





function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}





	
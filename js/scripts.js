
$(document).ready(function() {
    $("#search").on('keyup', function (e) {
        if (e.keyCode == 13 && $("input[id='search']").val()!="") {
            search();
        }
    });
    var chanelName ="42Alex18";
	var video_data = "";
	var videoIDray = [];
	var pagetoken;
	var resultCount = 0;
	$.get(
		"https://www.googleapis.com/youtube/v3/channels", {
			part: "contentDetails",
			forUsername: chanelName,
			key: "AIzaSyAORPQPMTmZxMpAX5fID61c1lmX0U-OFn8",
			},
			function(data){
				//resultCount = data.pageInfo.totalResults;
				//pagetoken = data.nextPageToken;
				$.each(data.items, function(i, item){
					//var vid = item.snippet.resourceId.videoId;
					//var title = item.snippet.title;
					//video_data += '<li><a href="index.php?v='+vid+'">'+title+'</a></li><br />';
					//videoIDray.push(vid);
                    console.log(item);
                    id = item.contentDetails.relatedPlaylists.uploads;
                    getVids(id);
				});
				//resultCount = resultCount - 50;
				//console.log(videoIDray.length);
				//console.log(resultCount);
                //$("div[class='row']").append(video_data);
			}
    );/*
	while(resultCount > 0){
		$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems", {
				part: "snippet",
			    forUsername: "Alex18",
				maxResults: 50,
				key: "AIzaSyAORPQPMTmZxMpAX5fID61c1lmX0U-OFn8",
				pageToken: pagetoken,
				},
				function(data){
					if(data.nextPageToken)pagetoken = data.nextPageToken;
					$.each(data.items, function(i, item){
						videoIDray.push(item.snippet.resourceId.videoId);
					});
					resultCount = resultCount - 50;
					console.log(videoIDray.length);
				}
		)
    }*/


});

function search(){
    var chanelName = $("input[id='search']").val();
    if (chanelName != ""){
        $("input[id='search']").val("");
        console.log(chanelName);
    }
}

function getVids(pid){
    	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: "snippet",
			maxResults: 10,
            playlistId: pid,
			key: "AIzaSyAORPQPMTmZxMpAX5fID61c1lmX0U-OFn8",
			},
			function(data){
                var out;
				$.each(data.items, function(i, item){
                    var videTitle = item.snippet.title;
                    var tumbnail = item.snippet.thumbnails.high.url;
                    videTitle = videTitle.length < 42 ? videTitle : videTitle.substring(0,40)+"...";
                    console.log(item);
                    //out = "<li><iframe src='http://www.youtube.com/embed/"+video+"'></iframe></li>";
                    out = "<div class='col-sm-4' style='padding-top: 20px;'>"+        
                                "<img src='"+tumbnail+"' class='img-responsive' style='width:100%' alt='Image'>"+
                          "<p>"+videTitle+"</p>"+
                        "</div>";
                    //out="<img src='"+tumbnail+"'></img>";
                    $("div[class='row']").append(out);
				});
			}
    );
}



	
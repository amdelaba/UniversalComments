var url = document.location.href;
var comments = [];
var articleIds = [];

function getRedditArticleIds(url){
	$.get(
	    "http://www.reddit.com/submit.json?url=" + url,
	    {},
	    function(data) {
	    	//If length is undefined, there are multiple articles that match the url
	    	if (data.length === undefined){
	    		//Loop through all relevant reddit posts
		       for(var i = 0; i < data.data.children.length;i++){
		           var article = data.data.children[i].data;
		           if (isGoodArticle(article)){
		           	articleIds.push(article.id);
		           	getRedditComments(article.id);
		           }
		       }
	    	} else{
	    		//only 1 article matching the url
	    		var article = data[0].data.children[0].data
	    		if (isGoodArticle(article)){
	    			articleIds.push(article.id);
	    			getRedditComments(article.id);
	    		}
	    	}

	    }
	);
}

function isGoodArticle(article){
	if (article.num_comments > 0 && article.score > 20){
		return true;
	}
	return false;
}

function getRedditComments(id){
	$.get(
		"http://www.reddit.com/r/all/comments/" + id + ".json",
	    {},
	    function(data) {
	       for(var i = 0; i < data[1].data.children.length; i++ ){

	       	var comment = data[1].data.children[i];
	       	comments.push(comment);
	       	
	       	// var score = data[1].data.children[i].data.ups - data[1].data.children[i].data.downs;
	       	// comment.data.author
	       	// comment.data.link_id
	       	// comment.data.created_utc

			var commentHtml = 	'<div class="panel panel-default">' + 
								  '<div class="panel-heading">' +
								    '<h3 class="panel-title">' + 
								    '<span class="badge pull-left" >' + (comment.data.ups - comment.data.downs) + '   </span>' + 
								    '<a href="http://www.reddit.com/user/WoodStainedGlass" >' + comment.data.author + '</a>' +
								    '|' + comment.data.id + 
								    '>Permalink</a>' + 
								    ' | ' + toDateTime(comment.data.created_utc).toLocaleDateString() + '</h3>' +'</div>' + 

								  '<div class="panel-body">' +
								  	'<div class="noncollapsed">' + 
	       						    	'<a href="#"" class="expand" onclick="return hidecomment(this)"">[--]</a>' + comment.data.body + 
       						        '</div>' +
        	       					'<div class="collapsed" style="display:none">' + 
										'<a href=#" class="expand" onclick="return showcomment(this)">[+]</a>' +
									'</div>' +
								  '</div>' + 


								'</div>';
								
	       	$("#comments").append(commentHtml);

	       }
	    }
	);
}

function toDateTime(secs)
{
	var t = new Date(1970,0,1);
	t.setSeconds(secs);
	return t;
}



$(document).ready(function(){	
	chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
	   function(tabs){
	      try {
	      	// alert('ya');
	      	getRedditArticleIds(tabs[0].url);	
	      }
	      catch (err) {
	      	$("#comments").append("<div>Sorry, unable to find any comments!</div>");
	      }
	      
	   }
	);

	$("#getComments").click(function(){
		$("#comments").html("");
		url = $("#url").val();
		getRedditArticleIds(url);
	})
});




function hidecomment(elem) {
	var anchorMinus = $(elem);
	var noncollapsed = anchorMinus.parent();
	var comment = noncollapsed.parent();
	var collapsed = comment.find(".collapsed");
	noncollapsed.hide();
	collapsed.show();
	return false;

};


function showcomment(elem) {
	var anchorPlus = $(elem);
	var collapsed = anchorPlus.parent();
	var comment = collapsed.parent();
	var noncollapsed = comment.find(".noncollapsed");
	collapsed.hide();
	noncollapsed.show();
	return false;
};

